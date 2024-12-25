// store/cart-store.ts
import { create } from "zustand";
import { ICart } from "@/lib/db/models/cart.model";
import { IOrderItem } from "@/lib/db/models/order-item.model";

interface CartState {
  cart: ICart | null;
  items: IOrderItem[] | null;
  loading: boolean;
  error: string | null;
  setCart: (cart: ICart | null) => void;
  setItems: (items: IOrderItem[] | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  items: null,
  loading: false,
  error: null,
  setCart: (cart) => set({ cart }),
  setItems: (items) => set({ items }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearCart: () => set({ cart: null, items: null }),
}));
