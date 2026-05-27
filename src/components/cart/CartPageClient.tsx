"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

export function CartPageClient() {
  const { isSignedIn } = useAuth();
  const { items, isLoading, syncCart, updateItemQuantity, removeItem, subtotal } = useCartStore();

  useEffect(() => {
    if (isSignedIn) syncCart();
  }, [isSignedIn, syncCart]);

  const subtotalValue = subtotal();

  if (!isSignedIn) {
    return (
      <div className="text-center py-20">
        <ShoppingBag size={40} className="mx-auto text-brand-text-tertiary mb-4" />
        <p className="text-brand-text-secondary mb-6">Sign in to view your cart</p>
        <Link href="/sign-in" className="btn-primary">
          Sign In
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse flex gap-6 p-5 border border-brand-border">
            <div className="w-24 h-28 bg-brand-gray" />
            <div className="flex-1 space-y-2 py-2">
              <div className="h-4 bg-brand-gray w-1/2" />
              <div className="h-3 bg-brand-gray w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag size={40} className="mx-auto text-brand-text-tertiary mb-4" />
        <p className="text-brand-text-secondary mb-6">Your cart is empty</p>
        <Link href="/products" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      {/* Items */}
      <div className="flex-1 divide-y divide-brand-border">
        {items.map((item) => {
          const price = item.variant.price ?? item.variant.product.basePrice;
          return (
            <div key={item.id} className="py-6 flex gap-5">
              <img
                src={item.variant.product.featuredImageUrl}
                alt={item.variant.product.name}
                className="w-24 h-28 object-cover bg-brand-gray shrink-0"
              />
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.variant.product.slug}`}
                  className="text-[15px] font-medium hover:opacity-60 transition-opacity"
                >
                  {item.variant.product.name}
                </Link>
                <p className="text-sm text-brand-text-secondary mt-0.5">
                  {item.variant.colorName}
                </p>
                <p className="text-sm mt-1">{formatPrice(Number(price))}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-brand-border rounded-pill">
                    <button
                      className="p-2 pl-3 hover:opacity-60"
                      onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 text-sm min-w-[28px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      className="p-2 pr-3 hover:opacity-60"
                      onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    className="p-2 text-brand-text-tertiary hover:text-red-500 transition-colors"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold">
                  {formatPrice(Number(price) * item.quantity)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary sidebar */}
      <div className="lg:w-[340px]">
        <div className="bg-brand-gray/50 p-6 sticky top-24">
          <h2 className="font-semibold mb-5">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">Subtotal</span>
              <span>{formatPrice(subtotalValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-text-secondary">Shipping</span>
              <span className="text-brand-text-tertiary">Calculated at checkout</span>
            </div>
          </div>
          <div className="flex justify-between font-semibold pt-4 mt-4 border-t border-brand-border">
            <span>Total</span>
            <span>{formatPrice(subtotalValue)}</span>
          </div>
          <Link href="/checkout" className="btn-primary w-full text-center mt-6 rounded-pill">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
