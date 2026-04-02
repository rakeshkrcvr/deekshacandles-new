import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface AppliedCoupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  appliedCoupon: AppliedCoupon | null;
  affiliateId: string | null;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setDrawerOpen: (isOpen: boolean) => void;
  setAppliedCoupon: (coupon: AppliedCoupon | null) => void;
  setAffiliateId: (id: string | null) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      appliedCoupon: null,
      affiliateId: null,
      addToCart: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === item.id);
        
        if (existingItem) {
          set({
            items: currentItems.map((i) => 
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          });
        } else {
          set({ items: [...currentItems, item] });
        }
      },
      removeFromCart: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },
      clearCart: () => set({ items: [], appliedCoupon: null, affiliateId: null }),
      setDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),
      setAppliedCoupon: (coupon) => set({ appliedCoupon: coupon }),
      setAffiliateId: (id) => set({ affiliateId: id }),
    }),
    {
      name: 'deekshacandles-cart',
      partialize: (state) => ({ items: state.items, appliedCoupon: state.appliedCoupon, affiliateId: state.affiliateId }), // Only persist items, coupons, and affiliateId
    }
  )
);
