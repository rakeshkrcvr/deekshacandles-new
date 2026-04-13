"use client";

import { useCartStore } from "@/store/cart";
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2, Ticket, ChevronRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CartDrawer() {
  const { items, isDrawerOpen, setDrawerOpen, updateQuantity, removeFromCart } = useCartStore();
  const router = useRouter();
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(3 * 60 + 19); // 3m 19s from image

  // Mock cross-sell products
  const [crossSellProducts, setCrossSellProducts] = useState<any[]>([]);

  useEffect(() => {
    if (isDrawerOpen && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isDrawerOpen, timeLeft]);

  // Fetch cross-sell products (for demo purposes)
  useEffect(() => {
    if (isDrawerOpen) {
      setCrossSellProducts([
        {
          id: '1',
          title: "Women High-Waist Flare Pants",
          price: 1399,
          originalPrice: 1949,
          discount: "28% off",
          image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=200"
        },
        {
          id: '2',
          title: "Women High-Waist Regular Pants",
          price: 1399,
          originalPrice: 3599,
          discount: "61% off",
          image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=200"
        }
      ]);
    }
  }, [isDrawerOpen]);

  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Offer progress bar logic
  const nextTarget = 1799;
  const progress = Math.min((cartTotal / nextTarget) * 100, 100);
  const amountToNext = Math.max(nextTarget - cartTotal, 0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return { mins, secs };
  };

  const { mins, secs } = formatTime(timeLeft);

  if (!isDrawerOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60] transition-opacity duration-300"
        onClick={() => setDrawerOpen(false)}
      />
      
      <div className="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-[#F8F9FA] shadow-2xl z-[70] animate-in slide-in-from-right-full duration-500 ease-out flex flex-col font-sans">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-white border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">
            Your Cart ({cartItemCount} items)
          </h2>
          <button 
            onClick={() => setDrawerOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-full transition-all group"
          >
            <X className="w-6 h-6 text-gray-900 group-hover:scale-110" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold text-gray-800">Your cart is empty</p>
                <p className="text-gray-500">Looks like you haven't added anything to your cart yet.</p>
              </div>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all shadow-lg shadow-black/10"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-5">
              {/* Timer & Offer Banner */}
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-[15px] font-medium text-gray-800">
                  <span>Hurry! Your Offer will expire in</span>
                  <div className="flex gap-1.5 items-center">
                    <span className="bg-[#5C6E5C] text-white px-2 py-0.5 rounded text-sm font-bold min-w-[32px] text-center">{mins}m</span>
                    <span className="font-bold">:</span>
                    <span className="bg-[#5C6E5C] text-white px-2 py-0.5 rounded text-sm font-bold min-w-[32px] text-center">{secs.toString().padStart(2, '0')}s</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                  <p className="text-center font-bold text-gray-800 text-[15px]">
                    You're Rs.₹{amountToNext.toFixed(2)} away from 15% Off !
                  </p>
                  
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-[#3FB8AF] transition-all duration-1000 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 left-[33%] w-4 h-4 rounded-full bg-white border-2 border-[#3FB8AF] z-10 flex items-center justify-center">
                       <CheckCircle2 className="w-3 h-3 text-[#3FB8AF] fill-white" />
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 left-[63%] w-4 h-4 rounded-full bg-white border-2 border-gray-300 z-10 flex items-center justify-center">
                       <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 right-0 w-4 h-4 rounded-full bg-white border-2 border-gray-300 z-10 flex items-center justify-center">
                       <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-[11px] font-bold text-gray-500 uppercase tracking-wider px-1">
                    <div className="flex flex-col items-center">
                      <span>₹999.00</span>
                      <span className="text-gray-400 mt-1">Extra 12%</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>₹1,799.00</span>
                      <span className="text-gray-400 mt-1">Extra 15%</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span>₹3,999.00</span>
                      <span className="text-gray-400 mt-1">Extra 20%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 relative group">
                    <div className="w-24 h-28 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-bold text-gray-800 text-[15px] leading-tight line-clamp-2">{item.title}</h3>
                          <div className="flex flex-col items-end">
                            <span className="text-gray-400 line-through text-xs font-medium">₹{(item.price * 1.3).toFixed(0)}</span>
                            <span className="font-extrabold text-[#111827] text-lg">₹{item.price.toFixed(0)}</span>
                            <span className="text-[#10B981] text-[11px] font-bold">(24% OFF)</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-gray-50 rounded-lg text-[11px] font-bold text-gray-600 border border-gray-100 uppercase">Black</span>
                          <span className="px-3 py-1 bg-gray-50 rounded-lg text-[11px] font-bold text-gray-600 border border-gray-100 uppercase">XS</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-[#F3F4F6] rounded-lg p-1 gap-4">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md transition-all text-gray-500"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-extrabold text-gray-900 w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md transition-all text-gray-500"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupons Section */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 flex items-center justify-between border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#E8F5E9] rounded-xl flex items-center justify-center">
                      <Ticket className="w-5 h-5 text-[#2E7D32] rotate-45" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                         <span className="font-extrabold text-gray-900 tracking-wider">SUMMER12</span>
                         <span className="bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#2E7D32]/10 capitalize">Applied</span>
                      </div>
                      <p className="text-[11px] font-bold text-[#2E7D32]">You save ₹203.88</p>
                    </div>
                  </div>
                  <button className="text-[#3FB8AF] font-bold text-sm hover:underline">Apply</button>
                </div>
                <button className="w-full p-4 flex items-center justify-between text-gray-700 hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-bold flex items-center gap-2">
                    <span className="text-gray-900 font-extrabold">3</span> coupons available
                  </span>
                  <div className="flex items-center text-gray-400 font-bold text-xs uppercase tracking-widest">
                    View Coupons <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </button>
              </div>

              {/* Cross-sell Section */}
              <div className="space-y-4 pb-4">
                <h3 className="text-lg font-bold text-gray-900 px-1">Pairs Up Perfectly With......</h3>
                <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
                  {crossSellProducts.map((product) => (
                    <div key={product.id} className="min-w-[180px] bg-white p-3 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-50">
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 left-2 right-2 flex justify-center">
                           <span className="bg-[#3FB8AF] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                             {product.discount}
                           </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-[12px] font-bold text-gray-800 line-clamp-1 leading-tight">{product.title}</h4>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 line-through">₹{product.originalPrice}</span>
                            <span className="text-sm font-extrabold text-gray-900">₹{product.price}</span>
                          </div>
                          <button className="bg-white border-2 border-gray-900 text-gray-900 font-bold px-3 py-1 rounded-lg text-xs hover:bg-gray-900 hover:text-white transition-all flex items-center gap-1">
                            <Plus className="w-3 h-3" /> Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="bg-white border-t border-gray-100 p-4 space-y-4 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
            <div className="w-full bg-[#3FB8AF]/10 border border-[#3FB8AF]/20 rounded-xl py-2 flex items-center justify-center gap-2 overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
               <span className="text-[#0D8A82] font-black text-xs uppercase tracking-widest">₹550.00 Saved so far!</span>
            </div>

            <div className="space-y-3 px-1">
              <div className="flex items-center justify-between">
                <button className="flex items-center gap-2 text-gray-900 font-extrabold group">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-gray-100">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  Estimated Total
                  <ChevronRight className="w-4 h-4 rotate-90 text-gray-400" />
                </button>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-gray-300 line-through text-lg font-medium">₹{(cartTotal * 1.3).toFixed(0)}</span>
                    <span className="text-2xl font-black text-gray-900 italic">₹{cartTotal.toFixed(0)}</span>
                  </div>
                  <p className="text-[#10B981] text-[11px] font-black uppercase tracking-wider">(24% OFF)</p>
                </div>
              </div>

              <button 
                onClick={() => {
                  setDrawerOpen(false);
                  router.push('/checkout');
                }}
                className="w-full bg-[#111827] text-white py-5 rounded-2xl flex flex-col items-center justify-center gap-1 hover:bg-black transition-all group relative overflow-hidden active:scale-[0.98]"
              >
                <div className="flex items-center gap-3 font-black uppercase tracking-[0.2em] text-sm">
                  Proceed to Checkout <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100">Extra 3% Discount On Prepaid Payment</span>
                
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-20 group-hover:opacity-100 transition-all duration-300">
                   <div className="bg-white p-1 rounded-md shadow-sm">
                     <img src="/payment-icons/upi.svg" className="w-5 h-3 object-contain" alt="UPI" />
                   </div>
                   <div className="bg-white p-1 rounded-md shadow-sm flex items-center justify-center">
                     <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-4 h-4" alt="WA" />
                   </div>
                   <div className="bg-[#002E6E] p-1 rounded-md shadow-sm flex items-center justify-center">
                      <span className="text-[8px] text-white font-bold">Pay</span>
                   </div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ddd;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ccc;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  );
}
