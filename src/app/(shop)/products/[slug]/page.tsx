import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { ProductVariantSelector } from "@/components/product/ProductVariantSelector";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      images: { orderBy: { order: "asc" } },
      variants: { where: { isActive: true } },
      compatibleModels: {
        include: { model: true },
      },
    },
  });

  if (!product || !product.isActive) notFound();

  return {
    ...product,
    basePrice: Number(product.basePrice),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    variants: product.variants.map((v) => ({
      ...v,
      price: v.price ? Number(v.price) : null,
    })),
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, metaTitle: true, metaDescription: true, featuredImageUrl: true },
  });

  if (!product) return { title: "Not Found" };

  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || `Buy ${product.name} online at Belemay.`,
    openGraph: { images: [product.featuredImageUrl] },
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <div className="container-page py-8 md:py-12">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductContent params={params} />
      </Suspense>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse grid md:grid-cols-2 gap-8 lg:gap-16">
      <div className="aspect-[4/5] bg-brand-gray" />
      <div className="space-y-4 pt-4">
        <div className="h-4 bg-brand-gray w-1/4" />
        <div className="h-8 bg-brand-gray w-2/3" />
        <div className="h-6 bg-brand-gray w-1/3" />
        <div className="h-24 bg-brand-gray mt-6" />
      </div>
    </div>
  );
}

async function ProductContent({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  const allImages = [
    product.featuredImageUrl,
    ...product.images.map((img) => img.url),
  ];

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.basePrice;

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
      {/* Image Gallery */}
      <ProductImageGallery images={allImages} productName={product.name} />

      {/* Product Info */}
      <div className="md:pt-4">
        {/* Brand */}
        <p className="text-xs font-medium tracking-widest uppercase text-brand-text-tertiary mb-4">
          {product.brand.name}
        </p>

        <h1 className="text-2xl md:text-[32px] font-bold tracking-tight leading-[1.15] mb-4">
          {product.name}
        </h1>

        {/* Price */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-xl font-semibold">{formatPrice(product.basePrice)}</span>
          {hasDiscount && (
            <span className="text-lg text-brand-text-tertiary line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-[15px] text-brand-text-secondary leading-relaxed mb-8">
          {product.description}
        </p>

        {/* Variant Selector */}
        <ProductVariantSelector
          variants={product.variants.map((v) => ({
            id: v.id,
            colorName: v.colorName,
            colorHex: v.colorHex,
            colorSwatchUrl: v.colorSwatchUrl,
            price: v.price,
            stock: v.stock,
            imageUrl: v.imageUrl,
            sku: v.sku,
          }))}
        />

        {/* Add to Cart */}
        <div className="mt-8">
          <AddToCartButton product={product} />
        </div>

        {/* Compatible models */}
        {product.compatibleModels.length > 0 && (
          <div className="mt-10 pt-8 border-t border-brand-border">
            <h3 className="text-sm font-semibold mb-3">Compatible with</h3>
            <div className="flex flex-wrap gap-2">
              {product.compatibleModels.map(({ model }) => (
                <Link
                  key={model.id}
                  href={`/products?brand=${product.brand.slug}&model=${model.slug}`}
                  className="text-xs border border-brand-border rounded-pill px-4 py-1.5 hover:border-brand-black transition-colors"
                >
                  {model.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Meta */}
        <div className="mt-6 flex gap-6 text-xs text-brand-text-tertiary">
          <span>SKU: {product.variants[0]?.sku || "N/A"}</span>
          <span className={product.totalStock > 0 ? "text-green-700" : "text-red-500"}>
            {product.totalStock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>
    </div>
  );
}
