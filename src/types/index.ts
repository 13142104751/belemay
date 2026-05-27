export interface ProductCardData {
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
}

export interface CartItemData {
  id: string;
  quantity: number;
  variant: {
    id: string;
    colorName: string;
    colorHex: string;
    sku: string;
    product: {
      id: string;
      name: string;
      slug: string;
      featuredImageUrl: string;
      basePrice: number;
    };
    price: number | null;
  };
}

export interface ProductFiltersState {
  brandSlug?: string;
  modelSlug?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "popular";
}

export interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    productName: string;
    productSlug: string;
    productImageUrl: string;
    variantName: string;
    unitPrice: number;
    totalPrice: number;
  }>;
}
