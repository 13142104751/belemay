"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const displayImages = images.length > 0 ? images : ["/placeholder.svg"];

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-[4/5] bg-brand-gray overflow-hidden">
        <img
          src={displayImages[selectedIndex]}
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail row */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "w-[72px] h-[72px] shrink-0 bg-brand-gray overflow-hidden transition-all duration-200",
                i === selectedIndex
                  ? "ring-1 ring-brand-black ring-offset-1"
                  : "opacity-60 hover:opacity-100"
              )}
            >
              <img
                src={img}
                alt={`${productName} view ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
