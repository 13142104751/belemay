import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { Prisma } from "@prisma/client";
import type { ProductCardData, ProductFiltersState } from "@/types";
import { Suspense } from "react";

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

async function getProducts(filters: ProductFiltersState): Promise<ProductCardData[]> {
  const where: Prisma.ProductWhereInput = { isActive: true };

  if (filters.brandSlug) {
    where.brand = { slug: filters.brandSlug };
  }
  if (filters.modelSlug) {
    where.compatibleModels = { some: { model: { slug: filters.modelSlug } } };
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  switch (filters.sort) {
    case "price-asc": orderBy = { basePrice: "asc" }; break;
    case "price-desc": orderBy = { basePrice: "desc" }; break;
    case "popular": orderBy = { soldCount: "desc" }; break;
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      variants: {
        where: { isActive: true },
        select: { id: true, colorName: true, colorHex: true, stock: true },
      },
    },
  });

  return products.map((p) => ({
    ...p,
    basePrice: Number(p.basePrice),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
  }));
}

async function getBrands() {
  return prisma.brand.findMany({ select: { id: true, name: true, slug: true } });
}

async function getModels() {
  return prisma.model.findMany({
    select: { id: true, name: true, slug: true, brandId: true },
  });
}

function ProductsContent({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  return (
    <Suspense fallback={<ProductGrid products={[]} isLoading />}>
      <ProductsList searchParams={searchParams} />
    </Suspense>
  );
}

async function ProductsList({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const params = await searchParams;
  const filters: ProductFiltersState = {
    brandSlug: params.brand,
    modelSlug: params.model,
    sort: (params.sort as ProductFiltersState["sort"]) || "newest",
  };

  const products = await getProducts(filters);
  const brands = await getBrands();
  const models = await getModels();

  return (
    <div className="flex flex-col md:flex-row gap-10">
      <aside className="md:w-[200px] shrink-0">
        <ProductFilters brands={brands} models={models} currentFilters={filters} />
      </aside>
      <div className="flex-1">
        <ProductGrid products={products} emptyMessage="No cases found matching your criteria." />
      </div>
    </div>
  );
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <div className="container-page py-10">
      <p className="text-xs font-medium tracking-widest uppercase text-brand-text-tertiary mb-3">
        Products
      </p>
      <h1 className="section-heading mb-10">All Cases</h1>
      <ProductsContent searchParams={searchParams} />
    </div>
  );
}
