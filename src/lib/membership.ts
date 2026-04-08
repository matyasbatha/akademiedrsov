import { prisma } from "@/lib/prisma";
import { isActiveMembership } from "@/lib/stripe";
import { MembershipStatus } from "@prisma/client";

export async function getUserMembership(userId: string) {
  return prisma.membership.findUnique({
    where: { userId },
  });
}

export async function hasActiveMembership(userId: string): Promise<boolean> {
  const membership = await getUserMembership(userId);
  if (!membership) return false;
  return isActiveMembership(membership.status);
}

export async function updateMembershipFromStripe(
  stripeCustomerId: string,
  data: {
    stripeSubscriptionId?: string;
    stripePriceId?: string;
    status: MembershipStatus;
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
  }
) {
  const membership = await prisma.membership.findUnique({
    where: { stripeCustomerId },
  });

  if (!membership) return null;

  return prisma.membership.update({
    where: { stripeCustomerId },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
}
