import { create } from "zustand";

interface CartVariant {
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
}

interface CartItemDisplay {
  id: string;
  quantity: number;
  variant: CartVariant;
}

interface CartState {
  isOpen: boolean;
  items: CartItemDisplay[];
  isLoading: boolean;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  syncCart: () => Promise<void>;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  isOpen: false,
  items: [],
  isLoading: false,

  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  syncCart: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        set({ items: data.items || [], isLoading: false });
      } else {
        set({ items: [], isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (variantId, quantity) => {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productVariantId: variantId, quantity }),
    });
    if (res.ok) {
      const data = await res.json();
      set({ items: data.items });
      get().openCart();
    }
  },

  updateItemQuantity: async (itemId, quantity) => {
    const res = await fetch(`/api/cart/items/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    if (res.ok) {
      const data = await res.json();
      set({ items: data.items });
    }
  },

  removeItem: async (itemId) => {
    const res = await fetch(`/api/cart/items/${itemId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      const data = await res.json();
      set({ items: data.items });
    }
  },

  clearCart: async () => {
    await fetch("/api/cart", { method: "DELETE" });
    set({ items: [] });
  },

  totalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  subtotal: () => {
    return get().items.reduce((sum, item) => {
      const price = item.variant.price ?? item.variant.product.basePrice;
      return sum + Number(price) * item.quantity;
    }, 0);
  },
}));
