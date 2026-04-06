"use client";

import { useCartStore } from "@/store/cart";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { items, isDrawerOpen, setDrawerOpen, updateQuantity, removeFromCart } = useCartStore();
  const router = useRouter();

  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  if (!isDrawerOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setDrawerOpen(false)}
      />
      
      <div className="fixed right-0 top-0 h-full w-[90%] sm:w-96 bg-white shadow-2xl z-50 animate-in slide-in-from-right-full duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gray-900" />
            <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
          </div>
          <button 
            onClick={() => setDrawerOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-500">
              <ShoppingBag className="w-12 h-12 text-gray-300" />
              <p>Your cart is empty.</p>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="text-amber-600 font-bold uppercase tracking-widest text-xs hover:text-amber-700"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-100 relative group">
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="absolute -top-2 -right-2 bg-white border border-gray-200 text-gray-500 p-1.5 rounded-full shadow-sm hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white flex-shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm font-medium">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="bg-white border border-gray-200 p-1 rounded-md text-gray-500 hover:text-gray-900"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-white border border-gray-200 p-1 rounded-md text-gray-500 hover:text-gray-900"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
            <div className="flex items-center justify-between text-base font-bold">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <p className="text-xs text-gray-500 text-center mb-4">Shipping and taxes calculated at checkout.</p>
            <button 
              onClick={() => {
                setDrawerOpen(false);
                router.push('/checkout');
              }}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 tracking-widest uppercase text-xs transition-colors"
            >
              Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
