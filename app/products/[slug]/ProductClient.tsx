"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Star, Truck, ShieldCheck, Heart, Share2, 
  Leaf, Info, ChevronDown, ChevronUp, ShoppingBag, Clock
} from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import ProductReviews from "./ProductReviews";
import ProductCard from "@/components/ProductCard";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";

export default function ProductClient({ product, relatedProducts = [] }: { product: any, relatedProducts?: any[] }) {
  const router = useRouter();
  const { addToCart } = useCartStore();
  const [mainImage, setMainImage] = useState(
    product.imageUrls?.[0] || 
    product.images?.[0]?.url || 
    "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&q=80&w=1000"
  );
  const [selectedSpec, setSelectedSpec] = useState<string | null>(null);

  const imagesList = product.imageUrls?.length > 0 
    ? product.imageUrls 
    : product.images?.map((i: any) => i.url) || [];

  const finalImages = imagesList.length > 0 
    ? imagesList 
    : [
        mainImage,
        "https://images.unsplash.com/photo-1603006905393-3b10b6d214c7?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1000"
      ];

  const reviewCount = product.reviews?.length || 0;
  const avgRating = reviewCount > 0 
    ? Number((product.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviewCount).toFixed(1))
    : 0;
  const finalPrice = product.price - (product.discount ? (product.price * product.discount) / 100 : 0);

  let specs: any = {
    "Net Weight": "350gm",
    "Burn Time": "60hrs",
    "Wax Type": "Soy + Gel",
    "Fragrance": "Coffee & Oud",
    "Glass Dimensions": "3x2 inch"
  };

  if (product.specifications) {
    if (typeof product.specifications === 'string') {
      try {
        specs = JSON.parse(product.specifications);
      } catch (e) {}
    } else {
      specs = product.specifications;
    }
  }

  return (
    <>
      <main className="max-w-7xl mx-auto md:px-8 md:py-12 flex flex-col md:flex-row gap-8 lg:gap-16 relative">
        {/* Gallery Section */}
        <section className="md:w-1/2 flex flex-col gap-4">
          <div className="relative aspect-square md:aspect-[4/5] bg-gray-100 overflow-hidden md:rounded-3xl shadow-sm border border-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={mainImage} 
              alt={product.title} 
              className="object-cover w-full h-full object-center hover:scale-105 transition-transform duration-700 ease-in-out"
            />
            {product.offerTag && (
              <div className="absolute top-4 right-4 h-6 flex items-center bg-gradient-to-r from-rose-50/95 to-orange-50/95 backdrop-blur-md text-rose-600 px-3 text-[9px] font-bold rounded shadow-sm uppercase tracking-widest border border-rose-100 z-10">
                {product.offerTag}
              </div>
            )}
            {product.discount > 0 && (
              <div className="absolute top-4 left-4 h-6 flex items-center bg-[#ff2a40] text-white text-[9px] font-bold px-3 rounded shadow-sm tracking-widest uppercase z-10">
                {product.discount}% OFF
              </div>
            )}
            <button className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur shadow-sm rounded-full text-gray-700 hover:text-red-500 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
          
          {/* Thumbnails */}
          <div className="flex gap-4 px-4 md:px-0 overflow-x-auto snap-x hide-scrollbar pb-2">
            {finalImages.map((img: string, idx: number) => (
              <div 
                key={idx} 
                onClick={() => setMainImage(img)}
                className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${mainImage === img ? 'border-amber-500 shadow-md scale-105' : 'border-gray-100 hover:border-gray-300'}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`${product.title} ${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>

        {/* Product Info Section */}
        <section className="md:w-1/2 px-5 md:px-0 flex flex-col py-2 lg:py-6">
          {product.categories && product.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {product.categories.map((c: any) => (
                <span key={c.id} className="text-amber-600 text-[11px] font-bold uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-lg">
                  {c.name}
                </span>
              ))}
            </div>
          )}
          
          <h1 className="text-lg lg:text-xl font-serif text-gray-900 mb-2 leading-tight font-bold">
            {product.title}
          </h1>
          
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(avgRating) ? 'fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm text-gray-700 font-medium">{reviewCount} Reviews</span>
          </div>

          {/* Trust Badges Section (Moved to top as requested) */}
          <div className="flex flex-wrap items-center gap-4 mb-4 border-b border-gray-50 pb-4">
             <div className="flex items-center gap-1.5 group">
                <div className="bg-gray-50/50 p-1.5 rounded-full border border-gray-100 group-hover:bg-amber-50 group-hover:border-amber-100 transition-colors">
                   <Star className="w-3 h-3 text-amber-500" />
                </div>
                <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest leading-none">Money-Back</span>
             </div>
             <div className="flex items-center gap-1.5 group">
                <div className="bg-gray-50/50 p-1.5 rounded-full border border-gray-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
                   <ShieldCheck className="w-3 h-3 text-emerald-500" />
                </div>
                <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest leading-none">Secure Payment</span>
             </div>
             <div className="flex items-center gap-1.5 group">
                <div className="bg-gray-50/50 p-1.5 rounded-full border border-gray-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                   <Truck className="w-3 h-3 text-blue-500" />
                </div>
                <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest leading-none">Free Returns</span>
             </div>
             <div className="flex items-center gap-1.5 group">
                <div className="bg-gray-50/50 p-1.5 rounded-full border border-gray-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
                   <ShoppingBag className="w-3 h-3 text-orange-500" />
                </div>
                <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest leading-none">COD Available</span>
             </div>
          </div>

          <div className="flex items-end gap-3 mb-5">
            <span className="text-lg lg:text-xl font-black text-gray-900 tracking-tighter">
              ₹{finalPrice}
            </span>
            {product.discount > 0 && (
              <span className="text-sm text-gray-400 line-through mb-0.5 font-light">
                ₹{product.price}
              </span>
            )}
          </div>

          {/* Triple Treat Alert */}
          {product.tripleTreatAlert && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-2.5 flex gap-2.5 items-start mb-5">
              <span className="text-lg mt-0.5">🎁</span>
              <div className="leading-tight">
                <h4 className="font-bold text-red-800 text-[7px] tracking-widest uppercase mb-0.5">Triple Treat Alert</h4>
                <p className="text-red-700/90 text-[9px] font-medium">
                  {product.tripleTreatAlert}
                </p>
              </div>
            </div>
          )}

          {/* Countdown timer */}
          {product.countdownExpiry && (
             <div className="flex items-center gap-2 text-red-600 bg-red-50/50 px-4 py-3 rounded-xl border border-red-100 mb-6 font-medium text-xs">
               <Clock className="w-4 h-4" />
               Ends Soon! Offer expires in 04:23:45
             </div>
          )}

          {/* Short Description Rendering */}
          <div className="text-gray-600 leading-snug mb-6 text-xs lg:text-sm font-light">
            {product.description ? (
              product.description.split('\n').map((line: string, i: number) => {
                const parts = line.split('**');
                return (
                  <div key={i} className={line.trim() ? "mb-1.5 flex items-start" : "mb-1.5"}>
                    <p className="leading-snug">
                      {parts.map((segment, j) => {
                        if (j % 2 !== 0) {
                          return <strong key={j} className="font-semibold text-gray-900">{segment}</strong>;
                        }
                        return <span key={j}>{segment}</span>;
                      })}
                    </p>
                  </div>
                );
              })
            ) : (
              <p>Indulge in the calming aura of our hand-poured artisan candles. Crafted thoughtfully with premium soy wax and infused with rich botanical fragrances to elevate your space and soothe your mind.</p>
            )}
          </div>


          {/* Icon Badges */}
          <div className="flex flex-wrap gap-2 mb-8">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50/50 border border-amber-100 rounded-full text-amber-900 text-[9px] font-bold shadow-sm uppercase tracking-wider">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                100% Pure Soy
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-slate-800 text-[9px] font-bold shadow-sm uppercase tracking-wider">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                Handmade in India
             </div>
          </div>

          {/* Quantity & Actions (Desktop) - Hidden on mobile, sticky below */}
          <div className="hidden md:block mb-8">
            <AddToCartButton 
              product={{
                id: product.id,
                title: product.title,
                price: finalPrice,
                image: mainImage,
                stock: product.stock,
              }}
            />
          </div>

          {/* Features badge buttons (Delivery / Quality) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            <div className="flex items-center gap-3 p-3 rounded-sm bg-orange-50/50 text-orange-900 border border-orange-100/30">
              <Truck className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-bold text-[7px] uppercase tracking-widest text-orange-800/80">Delivery Estimate</p>
                <p className="text-[9px] text-orange-700/70 font-medium">4 to 7 Business Days</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-sm bg-emerald-50/50 text-emerald-900 border border-emerald-100/30">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="font-bold text-[7px] uppercase tracking-widest text-emerald-800/80">Quality Promise</p>
                <p className="text-[9px] text-emerald-700/70 font-medium">Hassle-Free Returns</p>
              </div>
            </div>
          </div>

          {/* Product Specifics Table */}
          <div className="mb-10 bg-gray-50/30 border border-gray-100 rounded-sm p-4 overflow-hidden">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
               <div className="w-1 h-4 bg-gray-900 rounded-full" />
               <h3 className="text-[8px] uppercase tracking-[0.2em] font-black text-gray-900">Product Specifics</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
              {Object.entries(specs).map(([key, val]) => (
                <div key={key} className="flex justify-between items-center text-[9px] py-1 border-b border-gray-50/50 last:border-0 sm:even:border-b sm:nth-last-2:border-0">
                  <span className="text-gray-400 font-bold uppercase tracking-wider">{key}</span>
                  <span className="text-gray-900 font-black text-right ml-4">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Full Width Tabs Section */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pb-12">
        <div className="border-t border-gray-100 pt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <ProductTabs product={product} specs={specs} />
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section id="reviews" className="border-t border-gray-100 bg-white">
        <ProductReviews productId={product.id} reviews={product.reviews || []} />
      </section>

      {/* Related Products Section (Requested) */}
      {relatedProducts.length > 0 && (
        <section className="bg-[#faf9f6]/30 py-24 border-t border-gray-100">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6">
            
            {/* Header */}
            <div className="text-center mb-16">
              <span className="text-[#9e3253] font-bold tracking-[0.2em] uppercase mb-4 block text-xs">Handpicked for you</span>
              <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6 font-bold tracking-wide leading-tight">
                Related Products
              </h2>
              <div className="w-16 h-1 bg-[#9e3253] mx-auto rounded-full"></div>
            </div>
            
            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {relatedProducts.map((p: any) => (
                <div key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* Sticky Mobile Buy Now Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 pb-8 z-50 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
         <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium">Total Price</span>
            <span className="text-xl font-bold text-gray-900">₹{finalPrice}</span>
         </div>
         <button 
           onClick={() => {
             addToCart({
               id: product.id,
               title: product.title,
               price: finalPrice,
               quantity: 1,
               image: mainImage,
             });
             router.push("/checkout");
           }} 
           className="bg-gray-900 text-white px-8 py-3.5 rounded-full font-bold shadow-xl shadow-gray-900/20 active:scale-95 transition-all flex items-center gap-2"
         >
            <ShoppingBag className="w-5 h-5" /> Buy Now
         </button>
      </div>
    </>
  );
}

function ProductTabs({ product, specs }: { product: any, specs: any }) {
  const [activeTab, setActiveTab] = useState('Details');
  
  const tabs = ['Details', 'Terms', 'Returns', 'Guarantee'];
  
  const getDetailByLabel = (labelPattern: string) => {
    return product.details?.find((d: any) => 
      d.label.toLowerCase().includes(labelPattern.toLowerCase())
    )?.value;
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'Details':
        // Only show items from "Content Sections (Tabs)" that are NOT Return, Terms, or Guarantee
        const tabKeywords = ['terms', 'return', 'guarantee'];
        const additionalDetails = product.details?.filter((d: any) => 
          !tabKeywords.some(kw => d.label.toLowerCase().includes(kw))
        ) || [];

        return (
          <div className="animate-in fade-in duration-300">
            {additionalDetails.length > 0 ? (
              <div className="grid grid-cols-1 gap-8">
                {additionalDetails.map((detail: any) => (
                  <div key={detail.id} className="border-b border-gray-100 pb-8 last:border-0">
                    <h4 className="text-[8px] uppercase tracking-[0.2em] font-black text-gray-400 mb-4">{detail.label}</h4>
                    <div className="text-gray-900 text-[12px] font-bold leading-[1.8] whitespace-pre-line max-w-4xl">
                      {detail.value}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No additional details available.</p>
            )}
          </div>
        );
      case 'Terms':
        const termsContent = getDetailByLabel('Terms');
        return (
          <div className="text-[11px] text-gray-600 leading-relaxed font-light animate-in fade-in duration-300">
            {termsContent ? (
              <div className="whitespace-pre-line bg-gray-50/50 p-4 rounded-sm border border-gray-100">{termsContent}</div>
            ) : (
              <ul className="space-y-3 list-disc pl-4">
                <li>Prices are inclusive of all taxes.</li>
                <li>Offers cannot be clubbed with other coupon codes unless explicitly mentioned.</li>
                <li>Estimated delivery time is 4-7 business days depending on your location.</li>
                <li>All candles are handcrafted, hence minor variations in texture or color may occur.</li>
              </ul>
            )}
          </div>
        );
      case 'Returns':
        const returnsContent = getDetailByLabel('Return');
        return (
          <div className="text-[11px] text-gray-600 leading-relaxed font-light animate-in fade-in duration-300">
            {returnsContent ? (
              <div className="whitespace-pre-line bg-gray-50/50 p-4 rounded-sm border border-gray-100">{returnsContent}</div>
            ) : (
              <ul className="space-y-3 list-disc pl-4">
                <li>We offer a 7-day easy return policy for damaged or defective products.</li>
                <li>To be eligible for a return, the item must be unused and in the same condition that you received it.</li>
                <li>Please capture an unboxing video of the product for easier processing of damage claims.</li>
                <li>Refunds are processed within 5-7 working days after quality check.</li>
              </ul>
            )}
          </div>
        );
      case 'Guarantee':
        const guaranteeContent = getDetailByLabel('Guarantee');
        return (
          <div className="text-[11px] text-gray-600 leading-relaxed font-light animate-in fade-in duration-300">
            {guaranteeContent ? (
              <div className="whitespace-pre-line bg-gray-50/50 p-4 rounded-sm border border-gray-100">{guaranteeContent}</div>
            ) : (
              <div className="space-y-4">
                <p className="font-bold text-gray-900 mb-1">Premium Quality Assurance</p>
                <p>We use 100% pure soy wax and lead-free cotton wicks for a clean, non-toxic burn. Our fragrances are IFRA certified and safe for indoor use.</p>
                <p className="font-bold text-gray-900 mt-4 mb-1">Safe Transit Guarantee</p>
                <p>If your candle reaches you in a broken or unusable condition, we will ship a replacement immediately at no extra cost.</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-4 md:gap-10 border-b border-gray-100 mb-8 overflow-x-auto hide-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 animate-in slide-in-from-left-2" />
            )}
          </button>
        ))}
      </div>
      
      <div className="min-h-[200px]">
        {renderTabContent()}
      </div>
    </div>
  );
}
