"use client";

import Link from "next/link";

import { useCartStore } from "@/store/cart";
import { ShoppingBag, Star } from "lucide-react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  discount: number | null;
  images?: any[];
  imageUrls?: string[];
  stock: number;
  categories?: any[];
  offerTag?: string | null;
}

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, setDrawerOpen } = useCartStore();

  const finalPrice = product.price - (product.discount ? (product.price * product.discount) / 100 : 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productImage = product.images?.[0]?.url || product.imageUrls?.[0] || 'https://images.unsplash.com/photo-1603006905393-3b10b6d214c7?auto=format&fit=crop&q=80&w=600';
    addToCart({
      id: product.id,
      title: product.title,
      price: finalPrice,
      quantity: 1,
      image: productImage
    });
    setDrawerOpen(true);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productImage = product.images?.[0]?.url || product.imageUrls?.[0] || 'https://images.unsplash.com/photo-1603006905393-3b10b6d214c7?auto=format&fit=crop&q=80&w=600';
    addToCart({
      id: product.id,
      title: product.title,
      price: finalPrice,
      quantity: 1,
      image: productImage
    });
    setDrawerOpen(false);
    router.push('/checkout');
  };

  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col text-left h-full">
      {/* Image Container */}
      <div className="relative w-full aspect-square md:aspect-[4/5] bg-[#fdfaf6] rounded-[28px] overflow-hidden mb-3">
        {(product.discount ?? 0) > 0 && product.stock > 0 && (
          <div className="absolute top-3 left-3 h-5 flex items-center bg-[#ff2a40] text-white text-[8px] md:text-[9px] font-bold px-2 rounded-sm tracking-widest uppercase z-10 shadow-sm border border-transparent">
            {product.discount}% OFF
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-3 left-3 h-5 flex items-center bg-gray-900 text-white text-[8px] md:text-[9px] font-bold px-2 rounded-sm tracking-widest uppercase z-10 shadow-sm border border-transparent">
            SOLD OUT
          </div>
        )}
        {product.offerTag && (
          <div className="absolute top-3 right-3 h-5 flex items-center bg-gradient-to-r from-rose-50/95 to-orange-50/95 backdrop-blur-md text-rose-600 px-2 text-[8px] md:text-[9px] font-bold rounded-sm shadow-sm uppercase tracking-widest border border-rose-100 z-10">
            {product.offerTag}
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={product.images?.[0]?.url || product.imageUrls?.[0] || "https://images.unsplash.com/photo-1603006905393-3b10b6d214c7?auto=format&fit=crop&q=80&w=600"} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>

      {/* Tags & Offers */}
      <div className="flex flex-col gap-1.5 mb-1.5 items-start">
        <span className="bg-[#fff7e5] text-[#e67300] px-2.5 py-1 text-[9px] rounded-full uppercase font-bold tracking-widest border border-orange-100/50">
          {product.categories?.[0]?.name || "CANDLES"}
        </span>
      </div>

      {/* Reviews */}
      <div className="flex items-center gap-[2px] mb-1.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
        ))}
        <span className="text-[10px] text-gray-400 font-medium ml-1">(12)</span>
      </div>
      
      {/* Title */}
      <h3 className="!text-[10px] md:!text-[11px] font-medium text-slate-900 group-hover:text-[#e67300] transition-colors line-clamp-1 mb-0.5 leading-tight" style={{ fontSize: '10px' }}>
        {product.title}
      </h3>
      
      {/* Price */}
      <div className="flex items-end gap-1 mb-2.5">
         <span className="!text-[12px] md:!text-[13px] font-medium text-slate-900 leading-none" style={{ fontSize: '12px' }}>
           ₹{Math.round(finalPrice)}
         </span>
         {(product.discount ?? 0) > 0 && (
           <span className="text-gray-400 line-through !text-[8.5px] md:!text-[9.5px] font-medium mb-[0.2px]" style={{ fontSize: '8.5px' }}>
             ₹{Math.round(product.price)}
           </span>
         )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 w-full mt-auto">
         <button 
           onClick={handleAddToCart}
           className="flex items-center justify-center gap-1.5 flex-1 border-[1.5px] border-slate-900 text-slate-900 rounded-full py-2.5 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-900 hover:text-white transition-colors active:scale-95"
         >
           <ShoppingBag className="w-3.5 h-3.5" strokeWidth={2.5}/> Add
         </button>
         <button 
           onClick={handleBuyNow}
           className="flex-1 bg-[#ea7500] hover:bg-[#cc6600] text-white rounded-full py-2.5 text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-[#ea7500]/20 transition-all active:scale-95 border-[1.5px] border-transparent"
         >
           Buy Now
         </button>
      </div>
    </Link>
  );
}
