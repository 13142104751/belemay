import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/CartPageClient";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <div className="container-page py-16">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      <CartPageClient />
    </div>
  );
}
