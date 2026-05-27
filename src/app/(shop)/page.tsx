import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { ProductCardData } from "@/types";

async function getFeaturedProducts(): Promise<ProductCardData[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: {
      variants: {
        where: { isActive: true },
        select: { id: true, colorName: true, colorHex: true, stock: true },
      },
    },
    take: 8,
  });
  return products.map((p) => ({
    ...p,
    basePrice: Number(p.basePrice),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
  }));
}

async function getBrands() {
  return prisma.brand.findMany({
    include: { models: { select: { id: true, name: true, slug: true } } },
  });
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  const brands = await getBrands();

  return (
    <div>
      {/* Hero — large minimal typography */}
      <section className="container-page pt-20 pb-16 md:pt-32 md:pb-24 text-center">
        <h1 className="text-hero-mobile md:text-hero font-bold max-w-[800px] mx-auto animate-fade-in">
          Protection,{" "}
          <span className="text-brand-text-tertiary">elevated</span>
        </h1>
        <p className="mt-6 text-[17px] text-brand-text-secondary max-w-md mx-auto leading-relaxed">
          Premium cases crafted for iPhone, Samsung, and Pixel. Minimal design, maximum protection.
        </p>
        <div className="flex items-center justify-center gap-4 mt-10">
          <Link href="/products" className="btn-primary min-w-[160px]">
            Shop Cases
          </Link>
          <Link href="/about" className="btn-outline min-w-[160px]">
            Our Story
          </Link>
        </div>
      </section>

      {/* Shop by brand — clean text cards */}
      {brands.length > 0 && (
        <section className="container-page pb-20 md:pb-28">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[1px] bg-brand-border">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/products?brand=${brand.slug}`}
                className="group bg-brand-white p-8 md:p-12 hover:bg-brand-gray transition-colors duration-300"
              >
                <p className="text-xs font-medium tracking-widest uppercase text-brand-text-tertiary mb-4">
                  {brand.models.length} models
                </p>
                <h3 className="text-2xl font-bold tracking-tight group-hover:opacity-70 transition-opacity">
                  {brand.name}
                </h3>
                <p className="mt-2 text-sm text-brand-text-secondary">
                  Shop {brand.name.toLowerCase()} cases
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      {featuredProducts.length > 0 && (
        <section className="container-page pb-20 md:pb-28">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-brand-text-tertiary mb-3">
                Featured
              </p>
              <h2 className="section-heading">Best Sellers</h2>
            </div>
            <Link
              href="/products"
              className="text-sm text-brand-text-secondary hover:text-brand-black transition-colors hidden sm:block"
            >
              View All &rarr;
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
          <div className="mt-10 text-center sm:hidden">
            <Link href="/products" className="btn-outline">
              View All Cases
            </Link>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="bg-brand-gray">
        <div className="container-page py-20 md:py-28 text-center">
          <h2 className="text-hero-mobile md:text-hero font-bold max-w-[700px] mx-auto">
            Ready for an upgrade?
          </h2>
          <p className="mt-5 text-[17px] text-brand-text-secondary max-w-sm mx-auto leading-relaxed">
            Free shipping on orders over $35. 30-day returns, no questions asked.
          </p>
          <Link href="/products" className="btn-primary mt-10 inline-flex min-w-[160px]">
            Browse All
          </Link>
        </div>
      </section>
    </div>
  );
}
