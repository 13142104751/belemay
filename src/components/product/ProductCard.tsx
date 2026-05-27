import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    compareAtPrice: number | null;
    featuredImageUrl: string;
    avgRating: number;
    reviewCount: number;
    isNew: boolean;
    onSale: boolean;
    variants: Array<{
      id: string;
      colorName: string;
      colorHex: string;
      stock: number;
    }>;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.basePrice;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[4/5] bg-brand-gray overflow-hidden mb-4">
        <img
          src={product.featuredImageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          loading="lazy"
        />
        {/* Color dots — subtle, bottom center */}
        {product.variants.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {product.variants.slice(0, 4).map((v) => (
              <span
                key={v.id}
                className="w-3 h-3 rounded-full border border-black/10"
                style={{ backgroundColor: v.colorHex }}
                title={v.colorName}
              />
            ))}
            {product.variants.length > 4 && (
              <span className="text-[10px] text-brand-text-tertiary self-center ml-0.5">
                +{product.variants.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Text */}
      <h3 className="text-[15px] font-medium text-brand-black group-hover:opacity-60 transition-opacity">
        {product.name}
      </h3>

      {/* Price */}
      <div className="flex items-center gap-2 mt-1">
        <span className="text-[15px] text-brand-black">
          {formatPrice(product.basePrice)}
        </span>
        {hasDiscount && (
          <span className="text-[13px] text-brand-text-tertiary line-through">
            {formatPrice(product.compareAtPrice!)}
          </span>
        )}
      </div>

      {/* Available colors count */}
      <p className="text-[13px] text-brand-text-tertiary mt-0.5">
        {product.variants.length} color{product.variants.length > 1 ? "s" : ""}
      </p>
    </Link>
  );
}
