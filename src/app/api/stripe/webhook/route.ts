import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ Webhook signature failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // Úspěšná jednorázová platba za kurz
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "payment") break;

        const userId = session.metadata?.userId;
        const courseId = session.metadata?.courseId;
        const accessMonths = Number(session.metadata?.accessMonths ?? "6");
        if (!userId || !courseId) break;

        const course = await prisma.course.findUnique({ where: { id: courseId } });
        if (!course) break;

        const email =
          session.customer_email ?? session.customer_details?.email ?? "";
        const name = session.customer_details?.name ?? null;
        const amount = Math.round((session.amount_total ?? course.price * 100) / 100);

        // 1) Záznam objednávky (idempotentně podle session id)
        await prisma.order.upsert({
          where: { stripeSessionId: session.id },
          update: { status: "paid" },
          create: {
            userId,
            courseId,
            email,
            name,
            amount,
            currency: (session.currency ?? course.currency).toLowerCase(),
            status: "paid",
            stripeSessionId: session.id,
            stripePaymentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
          },
        });

        // 2) Přístup ke kurzu na accessMonths měsíců
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + accessMonths);

        await prisma.courseAccess.upsert({
          where: { userId_courseId: { userId, courseId } },
          update: { expiresAt },
          create: { userId, courseId, expiresAt },
        });

        // 3) Z GUEST udělej MEMBER (ADMIN nikdy nedegradujeme)
        await prisma.user.updateMany({
          where: { id: userId, role: "GUEST" },
          data: { role: "MEMBER" },
        });

        break;
      }

      // Vrácení platby → zneplatni přístup
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId =
          typeof charge.payment_intent === "string" ? charge.payment_intent : null;
        if (!paymentIntentId) break;

        const order = await prisma.order.findFirst({
          where: { stripePaymentId: paymentIntentId },
        });
        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: { status: "refunded" },
          });
          await prisma.courseAccess.deleteMany({
            where: { userId: order.userId, courseId: order.courseId },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
