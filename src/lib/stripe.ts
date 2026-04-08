import Stripe from "stripe";

// Lazy init – prevents "apiKey not provided" crash during Next.js build
let _stripe: Stripe | undefined;

function getInstance(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_: Stripe, prop: string | symbol) {
    return Reflect.get(getInstance(), prop);
  },
});

export const PLANS = {
  monthly: {
    name: "Měsíční členství",
    description: "Neomezený přístup ke všem kurzům a materiálům",
    price: 999,
    interval: "month" as const,
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID!,
  },
  yearly: {
    name: "Roční členství",
    description: "Neomezený přístup ke všem kurzům a materiálům – ušetříte 2 000 Kč",
    price: 9990,
    interval: "year" as const,
    priceId: process.env.STRIPE_YEARLY_PRICE_ID!,
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export function isActiveMembership(status: string | null | undefined): boolean {
  return status === "active" || status === "trialing";
}
