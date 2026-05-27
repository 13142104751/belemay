"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/products", label: "iPhone" },
  { href: "/products?brand=samsung", label: "Samsung" },
  { href: "/products?brand=google", label: "Pixel" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <header className="sticky top-0 z-50 bg-brand-white">
      <div className="container-page">
        <div className="flex items-center justify-between h-[72px]">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-1 -ml-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Link href="/" className="text-[22px] font-bold tracking-tight">
              BELEMAY
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[15px] text-brand-text-secondary hover:text-brand-black transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              className="p-2 hover:opacity-60 transition-opacity relative"
              onClick={() => setCartOpen(true)}
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-brand-black text-brand-white text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems > 99 ? "99" : totalItems}
                </span>
              )}
            </button>
            <SignedIn>
              <div className="ml-1">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-[26px] h-[26px]",
                    },
                  }}
                />
              </div>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-[15px] text-brand-text-secondary hover:text-brand-black transition-colors ml-1">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>

        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            mobileMenuOpen ? "max-h-60 pb-6" : "max-h-0"
          )}
        >
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[15px] text-brand-text-secondary hover:text-brand-black py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
