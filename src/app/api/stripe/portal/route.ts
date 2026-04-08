import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nejste přihlášen" }, { status: 401 });
  }

  const membership = await prisma.membership.findUnique({
    where: { userId: session.user.id },
  });

  if (!membership?.stripeCustomerId) {
    return NextResponse.json({ error: "Nenalezeno předplatné" }, { status: 404 });
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: membership.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/ucet`,
  });

  return NextResponse.json({ url: portalSession.url });
}
