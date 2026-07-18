import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";

// Jednorázový nákup přístupu ke konkrétnímu kurzu
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nejste přihlášen" }, { status: 401 });
  }

  const { courseId } = (await req.json()) as { courseId?: string };
  if (!courseId) {
    return NextResponse.json({ error: "Chybí kurz" }, { status: 400 });
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId, isPublished: true },
  });
  if (!course) {
    return NextResponse.json({ error: "Kurz nenalezen" }, { status: 404 });
  }
  if (course.isFree || course.price <= 0) {
    return NextResponse.json({ error: "Tento kurz je zdarma" }, { status: 400 });
  }

  // Už ho vlastní (platný přístup)?
  const existing = await prisma.courseAccess.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
  });
  if (existing && existing.expiresAt > new Date()) {
    return NextResponse.json({ url: `${APP_URL}/kurzy/${course.slug}` });
  }

  const images =
    course.coverImage && course.coverImage.startsWith("http")
      ? [course.coverImage]
      : undefined;

  // Předprodej „Připravujeme" = sleva 50 %
  const unitPriceCzk = course.isComingSoon ? Math.round(course.price / 2) : course.price;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: session.user.email ?? undefined,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: course.currency.toLowerCase(),
          unit_amount: unitPriceCzk * 100, // Kč → haléře
          product_data: {
            name: course.isComingSoon ? `${course.title} (předprodej −50 %)` : course.title,
            ...(course.description ? { description: course.description.slice(0, 300) } : {}),
            ...(images ? { images } : {}),
          },
        },
      },
    ],
    metadata: {
      userId: session.user.id,
      courseId: course.id,
      accessMonths: String(course.accessMonths),
    },
    payment_intent_data: {
      metadata: { userId: session.user.id, courseId: course.id },
    },
    locale: "cs",
    success_url: `${APP_URL}/kurzy/${course.slug}?success=true`,
    cancel_url: `${APP_URL}/kurzy/${course.slug}?canceled=true`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
