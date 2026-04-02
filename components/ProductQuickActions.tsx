"use client";

import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";

export default function ProductQuickActions({ product }: { product: any }) {
  const router = useRouter();
  const { addToCart, setDrawerOpen } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const finalPrice = product.price - (product.discount ? (product.price * product.discount) / 100 : 0);
    addToCart({
      id: product.id,
      title: product.title,
      price: finalPrice,
      quantity: 1,
      image: product.imageUrls?.[0] || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1603006905393-3b10b6d214c7?auto=format&fit=crop&q=80&w=600'
    });
    setDrawerOpen(true);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const finalPrice = product.price - (product.discount ? (product.price * product.discount) / 100 : 0);
    addToCart({
      id: product.id,
      title: product.title,
      price: finalPrice,
      quantity: 1,
      image: product.imageUrls?.[0] || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1603006905393-3b10b6d214c7?auto=format&fit=crop&q=80&w=600'
    });
    setDrawerOpen(false);
    router.push('/checkout');
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <button 
        onClick={handleAddToCart}
        className="flex-1 bg-white border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1"
      >
        <ShoppingBag className="w-3 h-3" /> Add
      </button>
      <button 
        onClick={handleBuyNow}
        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1"
      >
        Buy Now
      </button>
    </div>
  );
}
