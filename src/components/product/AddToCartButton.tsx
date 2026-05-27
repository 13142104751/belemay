"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useCartStore } from "@/store/cart-store";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: {
    id: string;
    variants: Array<{
      id: string;
      stock: number;
    }>;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { isSignedIn } = useAuth();
  const { addItem } = useCartStore();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (product.variants.length === 0) return;
    setLoading(true);
    try {
      await addItem(product.variants[0].id, 1);
    } finally {
      setLoading(false);
    }
  };

  const hasStock = product.variants.some((v) => v.stock > 0);

  return (
    <button
      onClick={handleAddToCart}
      disabled={!hasStock || !isSignedIn || loading}
      className={cn(
        "w-full btn-primary py-4 text-[15px] rounded-pill",
        (!hasStock || !isSignedIn) && "opacity-40 cursor-not-allowed"
      )}
    >
      {loading && <Loader2 size={18} className="animate-spin mr-2" />}
      {!hasStock ? "Out of Stock" : !isSignedIn ? "Sign in to Add to Cart" : "Add to Cart"}
    </button>
  );
}
