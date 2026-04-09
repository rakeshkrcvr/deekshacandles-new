"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Star, Truck, ShieldCheck, Heart, Share2, 
  Leaf, Info, ChevronDown, ChevronUp, ShoppingBag, Clock,
  Ruler, X
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
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showSizeChart, setShowSizeChart] = useState(false);

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

  let specs: any = {};
  let template: string = 'candles';
  let sliderOffers: { id: string, title: string, code: string }[] = [];

  if (product.specifications) {
    const rawSpecs = typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications;
    if (rawSpecs && typeof rawSpecs === 'object') {
      sliderOffers = (rawSpecs as any)._sliderOffers || [];
      if (rawSpecs._template) {
        template = rawSpecs._template;
        // Filter out internal fields
        const { _template, _sliderOffers, ...rest } = rawSpecs;
        specs = rest;
      } else {
        specs = rawSpecs;
      }
    }
  } else {
    // Default fallback for old products
    specs = {
      "Net Weight": "350gm",
      "Burn Time": "60hrs",
      "Wax Type": "Soy + Gel",
      "Fragrance": "Coffee & Oud",
      "Glass Dimensions": "3x2 inch"
    };
  }

  const availableColors = specs["Color Hex Codes"] ? specs["Color Hex Codes"].split(',').map((c: string) => c.trim()) : [];
  
  let availableSizesList = specs["Available Sizes"] ? specs["Available Sizes"].split(',').map((s: string) => s.trim()) : [];
  if (availableSizesList.length === 0) {
    if (template === 'apparel') availableSizesList = ['S', 'M', 'L', 'XL', 'XXL'];
    if (template === 'footwear') availableSizesList = ['6', '7', '8', '9', '10', '11'];
  }

  useEffect(() => {
    if (availableSizesList.length > 0 && !availableSizesList.includes(selectedSize)) {
      setSelectedSize(availableSizesList[0]);
    }
  }, [availableSizesList, selectedSize]);

  const dispatchTime = specs["Dispatch Time"] || "4 to 7 Business Days";
  const returnPolicyNote = specs["Return Policy Note"] || "Hassle-Free Returns";

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

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tighter">
              ₹{Math.round(finalPrice)}
            </span>
            {product.discount > 0 && (
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-base lg:text-lg text-gray-400 line-through font-medium">
                  ₹{product.price}
                </span>
                <span className="bg-[#032e2c] text-white text-[11px] lg:text-[12px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tight">
                  {Math.round(((product.price - finalPrice) / product.price) * 100)}% off
                </span>
              </div>
            )}
          </div>

          {/* Slider Offers */}
          {sliderOffers.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-[#032e2c] text-[15px] mb-3 leading-none tracking-tight">Save Extra With Exclusive Offers</h3>
              <div className="flex gap-3 overflow-x-auto snap-x hide-scrollbar pb-2">
                {sliderOffers.map((offer) => {
                  if (!offer || !offer.id) return null;
                  return (
                    <div key={offer.id} className="snap-start flex-shrink-0 w-64 bg-[#f0e4db] border border-[#032e2c] rounded-xl p-4 flex flex-col items-center text-center justify-between">
                      <p className="text-[#032e2c] font-black text-[14px] leading-snug mb-4">{offer.title}</p>
                      <div className="border border-[#032e2c] rounded-lg text-[11px] font-black text-[#032e2c] px-4 py-2 uppercase tracking-widest bg-transparent">
                        {offer.code?.toLowerCase().startsWith('code:') ? offer.code.substring(5).trim() : offer.code}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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




           {/* Template Specific UI Elements */}
           {template === 'apparel' && (
             <div className="mb-8 space-y-6">
               {/* Size Selection */}
               <div>
                 <div className="flex justify-between items-center mb-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-900">Select Size</label>
                   <button 
                     type="button"
                     onClick={() => setShowSizeChart(true)}
                     className="text-[10px] font-bold text-amber-600 uppercase border-b border-amber-600/30 flex items-center gap-1 hover:text-amber-700 transition-colors"
                   >
                     <Ruler className="w-3 h-3" /> Size Guide
                   </button>
                 </div>
                 <div className="flex flex-wrap gap-2">
                   {availableSizesList.map((size: string) => (
                     <button
                       key={size}
                       onClick={() => setSelectedSize(size)}
                       className={`h-12 min-w-[3rem] px-3 flex items-center justify-center rounded-xl border-2 transition-all font-bold text-sm ${
                         selectedSize === size 
                           ? 'border-gray-900 bg-gray-900 text-white shadow-lg' 
                           : 'border-gray-100 text-gray-600 hover:border-gray-300'
                       }`}
                     >
                       {size}
                     </button>
                   ))}
                 </div>
               </div>

               {/* Color Swatches */}
               {availableColors.length > 0 && (
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-900 mb-3">Available Colors</label>
                    <div className="flex gap-3">
                      {availableColors.map((color: string, i: number) => (
                        <button 
                          key={i}
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? 'border-amber-500 scale-110 shadow-md' : 'border-gray-100 shadow-sm'}`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                 </div>
               )}
             </div>
           )}

           {template === 'footwear' && availableSizesList.length > 0 && (
              <div className="mb-8 space-y-6">
               {/* Size Selection */}
               <div>
                 <div className="flex justify-between items-center mb-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-900">Select Size</label>
                 </div>
                 <div className="flex flex-wrap gap-2">
                   {availableSizesList.map((size: string) => (
                     <button
                       key={size}
                       onClick={() => setSelectedSize(size)}
                       className={`h-12 min-w-[3rem] px-3 flex items-center justify-center rounded-xl border-2 transition-all font-bold text-sm ${
                         selectedSize === size 
                           ? 'border-gray-900 bg-gray-900 text-white shadow-lg' 
                           : 'border-gray-100 text-gray-600 hover:border-gray-300'
                       }`}
                     >
                       {size}
                     </button>
                   ))}
                 </div>
               </div>
              </div>
           )}

           {template === 'accessories' && availableColors.length > 0 && (
              <div className="mb-8">
                 <label className="block text-[10px] font-black uppercase tracking-widest text-gray-900 mb-3">Select Color</label>
                 <div className="flex gap-3">
                   {availableColors.map((color: string, i: number) => (
                     <button 
                       key={i}
                       onClick={() => setSelectedColor(color)}
                       className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? 'border-amber-500 scale-110 shadow-md' : 'border-gray-100 shadow-sm'}`}
                       style={{ backgroundColor: color }}
                       title={color}
                     />
                   ))}
                 </div>
              </div>
           )}

           {template === 'candles' && (
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
           )}

          {/* Quantity & Actions (Desktop) - Hidden on mobile, sticky below */}
          <div className="hidden md:block mb-8">
            <AddToCartButton 
              product={{
                id: product.id + (selectedSize ? `-${selectedSize}` : "") + (selectedColor ? `-${selectedColor.replace('#', '')}` : ""),
                title: product.title + ((template === 'apparel' || template === 'footwear') ? ` (${selectedSize})` : "") + (selectedColor ? ` - ${selectedColor}` : ""),
                price: finalPrice,
                image: mainImage,
                stock: product.stock,
              }}
            />
          </div>
        </section>
      </main>

      {/* Full Width Info Section */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 mb-12">
        {/* Short Description Rendering */}
        <div className="text-gray-600 leading-snug mb-10 text-xs lg:text-sm font-light">
          {product.description ? (
            product.description.split('\n').map((line: string, i: number) => {
              if (!line.trim()) return <div key={i} className="mb-1.5" />;
              return (
                <div key={i} className="mb-1.5 flex items-start text-[14px]">
                  <div 
                    className="leading-snug html-content-area"
                    dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                  />
                </div>
              );
            })
          ) : (
            <p>Indulge in the calming aura of our hand-poured artisan candles. Crafted thoughtfully with premium soy wax and infused with rich botanical fragrances to elevate your space and soothe your mind.</p>
          )}
        </div>

        {/* Features badge buttons (Delivery / Quality) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-orange-50/50 text-orange-900 border border-orange-100/30 shadow-sm">
            <Truck className="w-6 h-6 text-orange-600" />
            <div>
              <p className="font-bold text-[10px] uppercase tracking-widest text-orange-800/80 mb-0.5">Delivery Estimate</p>
              <p className="text-xs text-orange-700/70 font-bold">{dispatchTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50/50 text-emerald-900 border border-emerald-100/30 shadow-sm">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <div>
              <p className="font-bold text-[10px] uppercase tracking-widest text-emerald-800/80 mb-0.5">Quality Promise</p>
              <p className="text-xs text-emerald-700/70 font-bold">{returnPolicyNote}</p>
            </div>
          </div>
        </div>

        {/* Product Specifics Table */}
        <div className="mb-12 bg-gray-50/30 border border-gray-100 rounded-2xl p-6 md:p-8 overflow-hidden">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
             <div className="w-1.5 h-6 bg-gray-900 rounded-full" />
             <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-900 font-serif">Product Specifications</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-5">
            {Object.entries(specs).map(([key, val]) => (
              <div key={key} className="flex justify-between items-center text-[11px] py-2.5 border-b border-gray-100/50 last:border-0">
                <span className="text-gray-400 font-bold uppercase tracking-widest">{key}</span>
                <span className="text-gray-900 font-black text-right ml-4">{String(val)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <ProductAccordion product={product} />
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
               id: product.id + (selectedSize ? `-${selectedSize}` : "") + (selectedColor ? `-${selectedColor.replace('#', '')}` : ""),
               title: product.title + ((template === 'apparel' || template === 'footwear') ? ` (${selectedSize})` : "") + (selectedColor ? ` - ${selectedColor}` : ""),
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
      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSizeChart(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                  <Ruler className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tighter text-gray-900">Standard Size Guide</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">All measurements are in inches</p>
                </div>
              </div>
              <button onClick={() => setShowSizeChart(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-900">
                    <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Size</th>
                    <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Chest</th>
                    <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Waist</th>
                    <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Shoulder</th>
                    <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { s: 'S', c: '38', w: '32', sh: '17', l: '27' },
                    { s: 'M', c: '40', w: '34', sh: '18', l: '28' },
                    { s: 'L', c: '42', w: '36', sh: '19', l: '29' },
                    { s: 'XL', c: '44', w: '38', sh: '20', l: '30' },
                    { s: 'XXL', c: '46', w: '40', sh: '21', l: '31' },
                  ].map((row) => (
                    <tr key={row.s} className={selectedSize === row.s ? 'bg-amber-50/50' : ''}>
                      <td className="py-4 px-4 font-black text-gray-900">{row.s}</td>
                      <td className="py-4 px-4 font-bold text-gray-600">{row.c}"</td>
                      <td className="py-4 px-4 font-bold text-gray-600">{row.w}"</td>
                      <td className="py-4 px-4 font-bold text-gray-600">{row.sh}"</td>
                      <td className="py-4 px-4 font-bold text-gray-600">{row.l}"</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-8 bg-amber-50 rounded-2xl p-4 border border-amber-100">
                <p className="text-xs text-amber-800 font-medium leading-relaxed">
                  <strong>Pro Tip:</strong> For an oversized streetwear look, we recommend going one size up. If you prefer a regular fit, stick to your standard size.
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setShowSizeChart(false)}
                className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ProductAccordion({ product }: { product: any }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const details = product.details || [];

  const renderDetailValue = (text: string) => {
    if (!text) return null;
    
    // Check if it's a Q&A block
    if (typeof text === 'string' && text.includes("Q:") && text.includes("A:")) {
      const parts = text.split(/(?=Q:)/).filter(p => p.trim() !== '');
      return (
        <div className="space-y-4">
          {parts.map((part, idx) => {
            if (part.startsWith('Q:')) {
              const [q, a] = part.split(/A:/);
              return (
                <div key={idx} className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100/50">
                   <h5 className="font-black text-gray-900 text-[11px] mb-2 uppercase tracking-tight leading-snug">{q.replace('Q:', '').trim()}</h5>
                   {a && <p className="text-gray-600 text-xs leading-relaxed font-medium">{a.trim()}</p>}
                </div>
              );
            }
            return <div key={idx} className="whitespace-pre-line text-xs font-medium leading-[1.8] text-gray-800">{part}</div>;
          })}
        </div>
      );
    }

    return (
      <div className="text-gray-600 text-[13px] font-medium leading-[1.8] whitespace-pre-line max-w-4xl">
        {String(text)}
      </div>
    );
  };

  if (details.length === 0) return null;

  return (
    <div className="w-full divide-y divide-gray-100 border-t border-gray-100 mt-8">
      {details.map((detail: any, idx: number) => (
        <div key={detail.id || idx} className="group overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full py-6 flex items-center justify-between text-left hover:bg-gray-50/30 transition-all rounded-xl px-2"
          >
            <span className={`text-[13px] md:text-sm font-black uppercase tracking-tight transition-colors ${openIndex === idx ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-900'}`}>
              {detail.label}
            </span>
            <div className={`p-1 rounded-full transition-all duration-300 ${openIndex === idx ? 'bg-gray-100 rotate-180' : 'bg-transparent'}`}>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-colors ${openIndex === idx ? 'text-gray-900' : ''}`} />
            </div>
          </button>
          
          <div 
            className={`transition-all duration-300 ease-in-out ${
              openIndex === idx 
                ? 'max-h-[2000px] opacity-100 pb-8 px-2' 
                : 'max-h-0 opacity-0 pointer-events-none'
            }`}
          >
            <div className="animate-in fade-in slide-in-from-top-1 duration-500">
              {renderDetailValue(detail.value)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
