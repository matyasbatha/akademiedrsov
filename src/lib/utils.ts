import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null): string {
  if (!date) return "–";
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Cena kurzu s ohledem na předprodej („Připravujeme" = −50 %).
export function coursePricing(course: {
  price: number;
  originalPrice?: number | null;
  isComingSoon?: boolean;
}) {
  const isPresale = !!course.isComingSoon;
  const effective = isPresale ? Math.round(course.price / 2) : course.price;
  // Cena, kterou proškrtneme: v předprodeji plná cena kurzu, jinak původní cena
  const strike = isPresale ? course.price : course.originalPrice ?? null;
  return { isPresale, effective, strike, full: course.price };
}

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
