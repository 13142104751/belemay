"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice, cn } from "@/lib/utils";
import { useAuth, SignInButton } from "@clerk/nextjs";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, isLoading, syncCart, updateItemQuantity, removeItem, subtotal, totalItems } =
    useCartStore();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isOpen && isSignedIn) {
      syncCart();
    }
  }, [isOpen, isSignedIn, syncCart]);

  const subtotalValue = subtotal();

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/30 z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-[420px] bg-brand-white z-50 shadow-2xl",
          "transform transition-transform duration-300 ease-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-lg font-semibold">Cart ({totalItems()})</h2>
          <button onClick={onClose} className="p-1 hover:opacity-60 transition-opacity">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6">
          {!isSignedIn ? (
            <div className="text-center py-20">
              <ShoppingBag size={40} className="mx-auto text-brand-text-tertiary mb-4" />
              <p className="text-sm text-brand-text-secondary mb-6">Sign in to view your cart</p>
              <SignInButton mode="modal">
                <button className="btn-primary text-sm">Sign In</button>
              </SignInButton>
            </div>
          ) : isLoading ? (
            <div className="space-y-5 pt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex gap-4">
                  <div className="w-20 h-24 bg-brand-gray" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-brand-gray w-3/4" />
                    <div className="h-3 bg-brand-gray w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={40} className="mx-auto text-brand-text-tertiary mb-4" />
              <p className="text-sm text-brand-text-secondary">Your cart is empty</p>
            </div>
          ) : (
            <ul className="divide-y divide-brand-border">
              {items.map((item) => {
                const price = item.variant.price ?? item.variant.product.basePrice;
                return (
                  <li key={item.id} className="py-5 flex gap-4">
                    <img
                      src={item.variant.product.featuredImageUrl}
                      alt={item.variant.product.name}
                      className="w-20 h-24 object-cover bg-brand-gray shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.variant.product.slug}`}
                        className="text-[15px] font-medium hover:opacity-60 transition-opacity line-clamp-1"
                        onClick={onClose}
                      >
                        {item.variant.product.name}
                      </Link>
                      <p className="text-[13px] text-brand-text-secondary mt-0.5">
                        {item.variant.colorName}
                      </p>
                      <p className="text-[15px] mt-1">{formatPrice(Number(price))}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-brand-border rounded-pill">
                          <button
                            className="p-1.5 pl-3 hover:opacity-60"
                            onClick={() =>
                              updateItemQuantity(item.id, Math.max(1, item.quantity - 1))
                            }
                          >
                            <Minus size={13} />
                          </button>
                          <span className="px-2 text-sm min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            className="p-1.5 pr-3 hover:opacity-60"
                            onClick={() =>
                              updateItemQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <button
                          className="p-1.5 text-brand-text-tertiary hover:text-red-500 transition-colors"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-brand-border px-6 py-5 space-y-4">
            <div className="flex justify-between text-[15px]">
              <span className="text-brand-text-secondary">Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotalValue)}</span>
            </div>
            <p className="text-xs text-brand-text-tertiary">
              Shipping &amp; tax calculated at checkout
            </p>
            <Link
              href="/checkout"
              className="btn-primary w-full text-center rounded-pill"
              onClick={onClose}
            >
              Checkout
            </Link>
            <Link
              href="/cart"
              className="btn-outline w-full text-center text-sm rounded-pill"
              onClick={onClose}
            >
              View Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
