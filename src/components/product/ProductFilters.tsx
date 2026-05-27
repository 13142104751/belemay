"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ProductFiltersState } from "@/types";

interface ProductFiltersProps {
  brands: Array<{ id: string; name: string; slug: string }>;
  models: Array<{ id: string; name: string; slug: string; brandId: string }>;
  currentFilters: ProductFiltersState;
}

export function ProductFilters({
  brands,
  models,
  currentFilters,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: keyof ProductFiltersState, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  const resetFilters = () => router.push("/products");

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium tracking-widest uppercase text-brand-text-tertiary">
          Filters
        </h3>
        <button
          onClick={resetFilters}
          className="text-xs text-brand-text-secondary hover:text-brand-black transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Brand */}
      <div>
        <label className="text-sm font-medium mb-2 block">Brand</label>
        <select
          value={currentFilters.brandSlug || ""}
          onChange={(e) => updateFilter("brandSlug", e.target.value || undefined)}
          className="input-field"
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.slug}>{brand.name}</option>
          ))}
        </select>
      </div>

      {/* Model */}
      <div>
        <label className="text-sm font-medium mb-2 block">Model</label>
        <select
          value={currentFilters.modelSlug || ""}
          onChange={(e) => updateFilter("modelSlug", e.target.value || undefined)}
          className="input-field"
        >
          <option value="">All Models</option>
          {models
            .filter((m) =>
              !currentFilters.brandSlug ||
              m.brandId === brands.find((b) => b.slug === currentFilters.brandSlug)?.id
            )
            .map((model) => (
              <option key={model.id} value={model.slug}>{model.name}</option>
            ))}
        </select>
      </div>

      {/* Sort */}
      <div>
        <label className="text-sm font-medium mb-2 block">Sort</label>
        <select
          value={currentFilters.sort || "newest"}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="input-field"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>
    </div>
  );
}
