import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { MembershipStatus } from "@prisma/client";
import Stripe from "stripe";

function getPeriodEnd(subscription: Stripe.Subscription): Date | undefined {
  // In Stripe API 2025+, current_period_end is deprecated.
  // Use cancel_at or trial_end as the end date reference.
  const legacySub = subscription as unknown as { current_period_end?: number };
  if (legacySub.current_period_end) {
    return new Date(legacySub.current_period_end * 1000);
  }
  if (subscription.cancel_at) {
    return new Date(subscription.cancel_at * 1000);
  }
  if (subscription.trial_end) {
    return new Date(subscription.trial_end * 1000);
  }
  // Fallback: 30 days from now for monthly, 365 for yearly
  const now = new Date();
  now.setDate(now.getDate() + 30);
  return now;
}

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
    console.error("   STRIPE_WEBHOOK_SECRET prefix:", process.env.STRIPE_WEBHOOK_SECRET?.slice(0, 20));
    return NextResponse.json({ error: "Invalid signature", detail: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        const userId = session.metadata?.userId;

        if (!userId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        await prisma.membership.upsert({
          where: { userId },
          update: {
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: subscription.items.data[0]?.price.id,
            status: subscription.status as MembershipStatus,
            currentPeriodEnd: getPeriodEnd(subscription),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
          create: {
            userId,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: subscription.items.data[0]?.price.id,
            status: subscription.status as MembershipStatus,
            currentPeriodEnd: getPeriodEnd(subscription),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });

        await prisma.user.update({
          where: { id: userId },
          data: { role: "MEMBER" },
        });

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await prisma.membership.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            status: subscription.status as MembershipStatus,
            stripePriceId: subscription.items.data[0]?.price.id,
            currentPeriodEnd: getPeriodEnd(subscription),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });

        const isActive =
          subscription.status === "active" || subscription.status === "trialing";

        const membership = await prisma.membership.findUnique({
          where: { stripeCustomerId: customerId },
          select: { userId: true },
        });

        if (membership) {
          await prisma.user.update({
            where: { id: membership.userId },
            data: { role: isActive ? "MEMBER" : "GUEST" },
          });
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await prisma.membership.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            status: "canceled",
            cancelAtPeriodEnd: false,
          },
        });

        const membership = await prisma.membership.findUnique({
          where: { stripeCustomerId: customerId },
          select: { userId: true },
        });

        if (membership) {
          await prisma.user.update({
            where: { id: membership.userId },
            data: { role: "GUEST" },
          });
        }

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        await prisma.membership.updateMany({
          where: { stripeCustomerId: customerId },
          data: { status: "past_due" },
        });

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
