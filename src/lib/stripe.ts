import Stripe from "stripe";

// Lazy init – zabrání pádu "apiKey not provided" během buildu Next.js
let _stripe: Stripe | undefined;

function getInstance(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
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
