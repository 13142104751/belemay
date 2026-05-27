"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface VariantOption {
  id: string;
  colorName: string;
  colorHex: string;
  colorSwatchUrl: string | null;
  price: number | null;
  stock: number;
  imageUrl: string | null;
  sku: string;
}

interface ProductVariantSelectorProps {
  variants: VariantOption[];
}

export function ProductVariantSelector({ variants }: ProductVariantSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (variants.length === 0) return null;

  const selected = variants.find((v) => v.id === selectedId);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">
          Color{selected ? `: ${selected.colorName}` : ""}
        </span>
        {selected && selected.price && (
          <span className="text-sm text-brand-text-secondary">
            +${selected.price.toFixed(2)}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5">
        {variants.map((variant) => {
          const isSelected = variant.id === selectedId;
          const isOutOfStock = variant.stock === 0;

          return (
            <button
              key={variant.id}
              onClick={() => !isOutOfStock && setSelectedId(variant.id)}
              disabled={isOutOfStock}
              className={cn(
                "w-9 h-9 rounded-full transition-all duration-200 relative",
                isSelected
                  ? "ring-1 ring-brand-black ring-offset-1 scale-110"
                  : "hover:scale-105",
                isOutOfStock && "opacity-30 cursor-not-allowed"
              )}
              title={`${variant.colorName}${isOutOfStock ? " (Out of Stock)" : ""}`}
              aria-label={variant.colorName}
            >
              <span
                className="absolute inset-1 rounded-full"
                style={{ backgroundColor: variant.colorHex }}
              />
              {isOutOfStock && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-px h-4 bg-brand-text-tertiary rotate-45" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <input type="hidden" name="variantId" value={selectedId || ""} />
    </div>
  );
}
