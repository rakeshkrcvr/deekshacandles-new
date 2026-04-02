"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { ShoppingCart, Plus, Minus, CheckCircle } from "lucide-react";

export default function AddToCartButton({ 
  product 
}: { 
  product: { id: string; title: string; price: number; image: string; stock: number } 
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAdd = () => {
    addToCart({ ...product, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000); // Reset after 2s
  };

  return (
    <div className="flex flex-row gap-3 mb-6">
      <div className="flex items-center justify-between border border-gray-200 rounded-sm px-4 py-2 w-32 bg-white shadow-sm">
        <button 
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="text-gray-400 hover:text-gray-900 transition-colors p-1"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="text-base font-bold text-gray-900 min-w-[20px] text-center">{quantity}</span>
        <button 
          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
          className="text-gray-400 hover:text-gray-900 transition-colors p-1"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <button 
        onClick={handleAdd}
        disabled={product.stock < 1}
        className={`flex-1 ${product.stock < 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : added ? 'bg-emerald-600' : 'bg-[#0F172A] hover:bg-[#1E293B]'} text-white rounded-sm flex items-center justify-center gap-3 py-3.5 font-bold text-sm uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-slate-900/10`}
      >
        {product.stock < 1 ? (
          "Out of Stock"
        ) : added ? (
          <>
             <CheckCircle className="w-4 h-4" />
             Added!
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
