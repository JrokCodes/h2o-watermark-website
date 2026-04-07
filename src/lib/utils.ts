import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, type: "sale" | "rent" = "rent"): string {
  if (type === "sale") {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(2)}M`;
    if (price >= 1000) return `$${(price / 1000).toFixed(0)}K`;
    return `$${price}`;
  }
  return `$${price.toLocaleString()}/mo`;
}
