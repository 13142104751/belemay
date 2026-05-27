export const SITE_NAME = "Belemay";
export const SITE_DESCRIPTION = "Premium phone cases designed to protect and style your device.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const SHIPPING_COST = 4.99;
export const FREE_SHIPPING_THRESHOLD = 35;
export const TAX_RATE = 0.08;

export const PHONE_BRANDS = [
  { name: "Apple", slug: "apple" },
  { name: "Samsung", slug: "samsung" },
  { name: "Google", slug: "google" },
] as const;
