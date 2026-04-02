import Link from "next/link";
import { 
  ArrowRight, ShoppingBag, Sparkles, Mail, HelpCircle, Heart, 
  Instagram as IGIcon, Video, ChevronRight, Play, Clock, MapPin, 
  ChevronDown, Phone, Send, Info, MessageSquare
} from "lucide-react";
import prisma from "@/lib/prisma";
import HeroSlider from "@/components/HeroSlider";
import ProductQuickActions from "@/components/ProductQuickActions";
import CategoryPillSlider from "@/components/CategoryPillSlider";
import OfferSection from "@/components/OfferSection";
import PromoBanners from "@/components/PromoBanners";
import ReelsSlider from "@/components/ReelsSlider";
import DiscountBanners from "@/components/DiscountBanners";
import ProductCard from "@/components/ProductCard";

interface Props {
  section: any;
}

export default async function SectionRenderer({ section }: Props) {
  const { type, content } = section;

  switch (type) {
    case 'hero':
      return <HeroSlider items={content.items || []} />;

    case 'video-bg':
      return (
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-black group">
           {content.url ? (
             <video 
              src={content.url} 
              autoPlay={content.autoplay !== false} 
              loop={content.loop !== false} 
              muted 
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2000ms]"
             />
           ) : (
             <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-80" />
           )}
           <div className="relative z-10 text-center px-6 max-w-4xl mx-auto text-white">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.4em] mb-4 block italic">Cinematic Moment</span>
              <h1 className="text-3xl md:text-5xl font-bold mb-6 drop-shadow-2xl leading-tight">
                {content.title || 'Experience Luxury'}
              </h1>
              <div className="flex justify-center gap-4">
                <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-amber-50 active:scale-95 transition-all shadow-2xl">
                   Shop Experience
                </button>
              </div>
           </div>
        </section>
      );

    case 'about':
    case 'image-with-text':
      return (
        <section className={`py-24 px-5 md:px-8 max-w-7xl mx-auto flex flex-col ${content.layout === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-16`}>
          <div className="flex-1 space-y-6">
             <span className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em]">{type === 'about' ? 'Our Legacy' : 'Craftsmanship'}</span>
             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
               {content.title}
             </h2>
             <div className="w-12 h-1 bg-amber-600 rounded-full" />
             <p className="text-sm md:text-base text-gray-600 leading-relaxed font-medium opacity-80">
               {content.content}
             </p>
             <Link href="/products" className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-900 group border-b border-gray-100 pb-1 hover:border-amber-600 transition-all">
                Explore Story <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>
          <div className="flex-1 w-full aspect-square bg-gray-50 rounded-none transition-transform duration-1000">
             <img 
              src={content.image || "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=1000"} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" 
              alt="Context" 
             />
          </div>
        </section>
      );

    case 'features':
      return (
        <section className="py-24 px-5 md:px-8 bg-[#FAF9F6]">
          <div className="max-w-7xl mx-auto text-center">
             <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                {content.title}
             </h2>
             <p className="text-gray-500 max-w-2xl mx-auto mb-12 text-sm leading-relaxed opacity-60">
                {content.subtitle}
             </p>
             <div className="grid grid-cols-2 lg:grid-cols-6 gap-8">
                {(content.items || []).map((item: any, idx: number) => (
                   <div key={idx} className="flex flex-col items-center gap-4 group">
                      <div className="w-20 h-20 bg-white rounded-none overflow-hidden bg-gray-50 border border-gray-100 group relative shadow-lg">
                        {item.icon ? <img src={item.icon} className="w-full h-full object-contain" alt={item.label} /> : <Sparkles className="w-8 h-8 text-amber-500/20" />}
                      </div>
                      <span className="text-[9px] font-bold text-gray-900 uppercase tracking-widest">
                        {item.label}
                      </span>
                   </div>
                ))}
             </div>
          </div>
        </section>
      );

    case 'logo-list':
       return (
         <section className="py-24 px-5 md:px-8 bg-white">
            <div className="max-w-7xl mx-auto text-center">
               <h2 className="text-xs font-bold text-gray-300 uppercase tracking-[0.5em] mb-16 italic">{content.title || 'Trusted By'}</h2>
               <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-1000">
                  {(content.logos || []).map((l: string, i: number) => (
                    l ? <img key={i} src={l} className="h-8 md:h-12 w-auto object-contain hover:scale-110 transition-transform" alt="brand" /> : null
                  ))}
               </div>
            </div>
         </section>
       );

    case 'countdown':
       return (
         <section className="py-24 px-5 md:px-8">
            <div className={`max-w-7xl mx-auto rounded-[60px] p-24 text-center relative overflow-hidden shadow-2xl ${content.theme === 'amber' ? 'bg-amber-600' : 'bg-gray-900'}`}>
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
               <div className="relative z-10 text-white">
                  <span className="text-xs font-bold uppercase tracking-[0.5em] mb-8 block italic opacity-60">{content.title}</span>
                  <div className="flex flex-wrap items-center justify-center gap-16 md:gap-24">
                     {['Days', 'Hours', 'Minutes', 'Secs'].map(u => (
                        <div key={u} className="flex flex-col items-center">
                           <span className="text-6xl md:text-9xl font-serif font-bold italic mb-2 tracking-tighter">00</span>
                           <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{u}</span>
                        </div>
                     ))}
                  </div>
                  <button className="mt-16 bg-white text-gray-900 px-12 py-5 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
                     Shop The Event
                  </button>
               </div>
            </div>
         </section>
       );

    case 'newsletter':
      return (
        <section className="py-24 px-5 md:px-8">
          <div className="max-w-7xl mx-auto rounded-none bg-gray-950 p-12 md:p-20 text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
             <Mail className="w-12 h-12 text-amber-500 mx-auto mb-6" />
             <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-[1.2] max-w-3xl mx-auto">{content.title}</h2>
             <p className="text-white/30 font-bold uppercase tracking-[0.2em] mb-10 text-[10px]">{content.subtitle}</p>
             <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4 p-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-3xl">
                <input type="email" placeholder={content.placeholder} className="flex-1 bg-transparent border-none rounded-none px-6 py-3 text-white placeholder:text-white/20 focus:outline-none text-base" />
                <button className="bg-amber-600 text-white px-10 py-4 rounded-none font-bold uppercase tracking-widest text-[10px] hover:bg-amber-500 transition-all shadow-xl">
                   {content.buttonText}
                </button>
             </div>
          </div>
        </section>
      );

    case 'faq':
    case 'collapsible':
       return (
         <section className="py-24 px-5 md:px-8 bg-white">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col items-center mb-16 space-y-4">
                 {content.subtitle && (
                   <span className="inline-block px-4 py-1.5 rounded-full bg-[#f0eefc] text-[#5b40cf] text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase">
                     {content.subtitle}
                   </span>
                 )}
                 <h2 className="text-[28px] sm:text-[36px] md:text-[44px] font-semibold text-[#1e1a4f] tracking-tight">{content.title || 'Frequently Asked Questions'}</h2>
              </div>
              <div className="space-y-4">
                 {(content.items || []).map((faq: any, i: number) => (
                    <details key={i} className="group bg-[#f8f7fa] rounded-[16px] overflow-hidden cursor-pointer border-l-[6px] border-[#5b40cf] shadow-sm transition-all duration-300" open={i === 0}>
                       <summary className="w-full px-5 sm:px-8 py-5 text-left flex items-center justify-between list-none focus:outline-none">
                          <span className="font-semibold text-[#1e1a4f] text-[15px] sm:text-[17px] pr-8">{faq.question}</span>
                          <div className="w-[30px] h-[30px] shrink-0 rounded-full bg-[#5b40cf] flex items-center justify-center transition-transform duration-300 group-open:rotate-180">
                             <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                       </summary>
                       <div className="px-5 sm:px-8 pb-6 pt-0 text-[#6B7280] text-[14px] sm:text-[15px] leading-relaxed w-full sm:w-[90%]">
                          {faq.answer}
                       </div>
                    </details>
                 ))}
                 <style dangerouslySetInnerHTML={{__html: `details > summary::-webkit-details-marker { display: none; } details > summary { list-style: none; }`}} />
              </div>
           </div>
         </section>
       );

    case 'map':
       return (
         <section className="py-24 px-5 md:px-8 max-w-7xl mx-auto">
            <div className="bg-gray-50 rounded-none overflow-hidden border border-gray-100 shadow-2xl flex flex-col md:flex-row">
               <div className="flex-1 min-h-[500px]">
                  <iframe src={content.url} width="100%" height="100%" loading="lazy" className="grayscale opacity-80 hover:grayscale-0 transition-all duration-1000" />
               </div>
               <div className="w-full md:w-[450px] p-16 flex flex-col justify-center bg-white border-l">
                  <MapPin className="w-12 h-12 text-amber-600 mb-8" />
                  <h2 className="text-4xl font-serif font-bold text-gray-900 italic mb-6 leading-tight">{content.title}</h2>
                  <p className="text-lg text-gray-500 font-serif italic leading-relaxed mb-10 opacity-70">{content.address}</p>
                  <button className="bg-gray-900 text-white px-10 py-5 rounded-none font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl">Get Directions</button>
               </div>
            </div>
         </section>
       );

    case 'contact-form':
       return (
         <section className="py-24 px-5 md:px-8 bg-[#FAF9F6]">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-24 items-center">
               <div className="flex-1 space-y-8">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-[0.5em] italic">Contact Us</span>
                  <h2 className="text-5xl md:text-8xl font-serif font-bold text-gray-900 italic tracking-tighter leading-[0.9]">{content.title || 'Start Conversations'}</h2>
                  <p className="text-gray-500 text-xl font-serif italic max-w-lg opacity-60">We value every voice. Reach out for bulk inquiries, collaborations, or just a virtual candle talk.</p>
                  <div className="space-y-6 pt-10">
                     <div className="flex items-center gap-6 group"><div className="w-14 h-14 rounded-none bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"><Phone className="w-6 h-6 text-amber-600" /></div><span className="font-bold text-gray-900 italic">+91-9876543210</span></div>
                     <div className="flex items-center gap-6 group"><div className="w-14 h-14 rounded-none bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"><Mail className="w-6 h-6 text-amber-600" /></div><span className="font-bold text-gray-900 italic">hello@deekshacandles.com</span></div>
                  </div>
               </div>
               <div className="flex-1 w-full bg-white p-12 md:p-16 rounded-none shadow-2xl shadow-gray-200 border border-gray-100 space-y-8 animate-in slide-in-from-right-12 duration-1000">
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-2">Your Name</label>
                     <input type="text" className="w-full bg-gray-50 border-none rounded-none px-8 py-5 text-gray-900 shadow-inner focus:ring-2 focus:ring-amber-500/20" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-2">Email Address</label>
                     <input type="email" className="w-full bg-gray-50 border-none rounded-none px-8 py-5 text-gray-900 shadow-inner focus:ring-2 focus:ring-amber-500/20" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-2">Message</label>
                     <textarea rows={5} className="w-full bg-gray-50 border-none rounded-none px-8 py-5 text-gray-900 shadow-inner focus:ring-2 focus:ring-amber-500/20" />
                  </div>
                  <button className="w-full bg-gray-900 text-white flex items-center justify-center gap-4 py-6 rounded-none font-bold uppercase tracking-widest text-xs hover:bg-black transition-all active:scale-95 shadow-2xl">
                     Send Message <Send className="w-4 h-4" />
                  </button>
               </div>
            </div>
         </section>
       );

    case 'category-pill':
       return <CategoryPillSlider title={content.title || 'Our Collections'} />;

    case 'discount-banners':
       return <DiscountBanners banners={content.banners} />;

    case 'offer-section':
       return <OfferSection banners={content.banners} /> ;

    case 'promo-banners':
       return <PromoBanners />;

    case 'reels-slider':
       return <ReelsSlider />;

    case 'categories':
       const cats = await prisma.category.findMany({ include: { products: { take: 1 } } });
       
       const getGridLayout = (i: number) => {
          const patterns = [
            "md:col-span-2 md:row-span-1 min-h-[250px] md:min-h-[300px]", // 0 - Wide top-left
            "md:col-span-1 md:row-span-2 min-h-[250px] md:min-h-[600px]", // 1 - Tall top-right 1
            "md:col-span-1 md:row-span-2 min-h-[250px] md:min-h-[600px]", // 2 - Tall top-right 2
            "md:col-span-1 md:row-span-2 min-h-[250px] md:min-h-[600px]", // 3 - Tall bottom-left 1
            "md:col-span-1 md:row-span-2 min-h-[250px] md:min-h-[600px]", // 4 - Tall bottom-left 2
            "md:col-span-2 md:row-span-1 min-h-[250px] md:min-h-[300px]", // 5 - Wide bottom-right
          ];
          return patterns[i % patterns.length];
       };

       const getColorOverlay = (i: number) => {
          const overlays = [
            "from-[#629d9e]/90 via-[#629d9e]/40 to-transparent", // Teal
            "from-[#1c2c3b]/90 via-[#1c2c3b]/40 to-transparent", // Dark/Navy
            "from-[#d09164]/90 via-[#d09164]/40 to-transparent", // Warm Sand
            "from-[#3b93c4]/90 via-[#3b93c4]/40 to-transparent", // Blue
            "from-[#f38a90]/90 via-[#f38a90]/40 to-transparent", // Pink
            "from-[#5c9ae6]/90 via-[#5c9ae6]/40 to-transparent", // Light Blue
          ];
          return overlays[i % overlays.length];
       };

       return (
         <section className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
               <div className="flex items-end justify-between mb-10 gap-8">
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Collection List</h2>
                  <Link href="/products" className="mb-2 text-[11px] font-bold text-amber-600 uppercase tracking-widest hover:text-amber-700 transition-all hidden md:block">
                     ALL COLLECTIONS &rarr;
                  </Link>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-4 grid-flow-row-dense gap-4 md:gap-6">
                  {cats.map((cat: any, i: number) => (
                    <Link 
                      href={`/category/${cat.slug}`} 
                      key={cat.id} 
                      className={`group relative rounded-[24px] overflow-hidden flex flex-col p-6 md:p-8 bg-gray-100 ${getGridLayout(i)}`}
                    >
                       {/* Background Image */}
                       <img 
                         src={cat.icon || "https://images.unsplash.com/photo-1603006905501-4470fc38ad72?auto=format&fit=crop&q=80&w=1000"} 
                         className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1500ms] ease-out" 
                         alt={cat.name} 
                       />
                       
                       {/* Colored Gradient Overlay to match design */}
                       <div className={`absolute inset-0 bg-gradient-to-br ${getColorOverlay(i)} opacity-80 mix-blend-multiply`} />
                       {/* Secondary subtle black gradient for text readability */}
                       <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/10" />

                       {/* Content Content top block */}
                       <div className="relative z-10 w-full md:w-4/5 lg:w-3/4">
                          <span className="text-[9px] md:text-[10px] font-bold text-white/80 uppercase tracking-widest mb-3 block">
                            COLLECTION
                          </span>
                          <h3 className="text-2xl md:text-[32px] font-bold text-white leading-[1.15] drop-shadow-md">
                            {cat.name}
                          </h3>
                       </div>

                       {/* Content Content bottom block */}
                       <div className="relative z-10 mt-auto pt-8">
                          <div className="inline-flex items-center bg-white text-gray-900 px-5 py-2.5 rounded-lg text-[11px] font-bold shadow-xl shadow-black/10 group-hover:-translate-y-1 transition-transform duration-300">
                             Browse Gallery
                          </div>
                       </div>
                    </Link>
                  ))}
               </div>
               
               {/* Mobile Only All Collections button */}
               <div className="mt-8 text-center md:hidden">
                  <Link href="/products" className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">
                     ALL COLLECTIONS &rarr;
                  </Link>
               </div>
            </div>
         </section>
       );

    case 'products':
      const prods = await prisma.product.findMany({
        take: content.limit || 8,
        include: { categories: true, images: true }
      });
      return (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em] block">Luxe Collection</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">{content.title}</h2>
                </div>
                <Link href="/products" className="bg-gray-50 hover:bg-black hover:text-white px-8 py-3 rounded-none overflow-hidden transition-all shadow-sm flex items-center gap-2 group">
                  Full Storefront <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
               {prods.map((p: any) => (
                 <div key={p.id}>
                   <ProductCard product={p} />
                 </div>
               ))}
             </div>
          </div>
        </section>
      );

    case 'custom-liquid':
      return (
        <section className="py-24 px-5 md:px-8 max-w-7xl mx-auto">
           <div className="bg-white p-12 rounded-none border border-gray-100 shadow-xl overflow-hidden" dangerouslySetInnerHTML={{ __html: content.code || '' }} />
        </section>
      );

    case 'blog-posts':
       return (
         <section className="py-24 px-5 md:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
               <h2 className="text-5xl font-serif font-bold text-gray-900 italic mb-20 text-center">{content.title || 'From The Journal'}</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                  {[1,2,3].map(i => (
                    <div key={i} className="group cursor-pointer">
                       <div className="aspect-video rounded-none overflow-hidden bg-gray-50 mb-8 border border-gray-100 shadow-md relative">
                          <img src={`https://images.unsplash.com/photo-1603006905501-4470fc38ad72?auto=format&fit=crop&q=80&w=800&i=${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="blog" />
                       </div>
                       <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-600 block mb-4 italic">Art of Living • March 2024</span>
                       <h3 className="text-2xl font-serif font-bold italic text-gray-900 mb-4 group-hover:text-amber-600 transition-colors leading-tight">The Secret to Long Lasting Candle Scent</h3>
                       <p className="text-gray-500 font-serif italic text-lg opacity-60 line-clamp-2">Discover how we process our essential oils to ensure your home stays fragrant for hours...</p>
                    </div>
                  ))}
               </div>
            </div>
         </section>
       );

    case 'testimonials':
      return (
        <section className="py-24 bg-[#faf9f6]">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
             <div className="flex flex-col items-center mb-16">
                <div className="flex items-center gap-1 mb-4">
                   {[1,2,3,4,5].map(s => <svg key={s} className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                </div>
                <h2 className="text-3xl md:text-[40px] font-bold text-gray-900 text-center leading-tight tracking-tight mb-2">{content.title || 'What Our Customers Say'}</h2>
                {content.subtitle && <p className="text-gray-500 font-medium text-lg text-center max-w-2xl">{content.subtitle}</p>}
             </div>
             <div className="flex items-center justify-between mb-8 w-full border-b border-gray-100 pb-2">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Swipe or Drag to view more</p>
                 <div className="flex gap-2">
                     <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50">&larr;</button>
                     <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50">&rarr;</button>
                 </div>
             </div>
             
             <div className="flex flex-nowrap overflow-x-auto gap-6 lg:gap-8 pb-8 snap-x snap-mandatory scrollbar-hide">
                {(content.reviews || []).map((rev: any, i: number) => {
                   const rating = rev.rating || 5;
                   return (
                     <div key={i} className="snap-start shrink-0 w-[85%] sm:w-[50%] md:w-[30%] lg:w-[23%] bg-white p-8 md:p-10 rounded-[32px] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 relative group transition-all duration-300 hover:shadow-[0_15px_50px_-15px_rgba(0,0,0,0.08)] flex flex-col items-start h-auto">
                        {/* Huge Quote Icon */}
                        <div className="absolute top-8 right-8 text-purple-100 opacity-60">
                           <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                        </div>
                        
                        {/* Stars */}
                        <div className="flex gap-1 mb-6">
                           {[1,2,3,4,5].map(s => (
                              <svg key={s} className={`w-5 h-5 ${s <= rating ? 'text-[#8a4af3]' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                           ))}
                        </div>
                        
                        {/* Review Text */}
                        <div className="text-gray-800 font-medium text-[15px] md:text-base leading-relaxed flex-1 mb-8 z-10 w-full relative">
                           {rev.text}
                        </div>
                        
                        {/* Divider */}
                        <div className="w-full h-px bg-gray-100 mb-6 mt-auto" />
                        
                        {/* Reviewer Info */}
                        <div className="flex items-center gap-4 w-full">
                           {rev.avatar ? (
                             <img src={rev.avatar} className="w-12 h-12 rounded-full object-cover shrink-0 bg-gray-50 border border-gray-100" alt={rev.name} />
                           ) : (
                             <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-400 shrink-0">
                                {rev.name?.[0] || 'U'}
                             </div>
                           )}
                           <div className="flex flex-col">
                              <span className="font-bold text-gray-900 text-[15px]">{rev.name}</span>
                              <span className="text-xs font-semibold text-gray-400">{rev.role || 'Verified Buyer'}</span>
                           </div>
                        </div>
                     </div>
                   );
                })}
             </div>
             <style dangerouslySetInnerHTML={{__html: `
               .scrollbar-hide::-webkit-scrollbar { display: none; }
               .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
             `}} />
          </div>
        </section>
      );

    case 'instagram':
       return (
         <section className="py-24 px-5 md:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
               <div className="flex flex-col items-center text-center mb-12 gap-4">
                  <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight leading-none">{content.title}</h2>
                  <p className="text-amber-600 font-bold tracking-widest uppercase text-[10px]">{content.handle}</p>
               </div>
               <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {(content.images || []).map((img: string, i: number) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group relative">
                       <img src={img || `https://images.unsplash.com/photo-1603006905501-4470fc38ad72?auto=format&fit=crop&q=80&w=600&ig=${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="ig" />
                       <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                          <IGIcon className="w-8 h-8 text-white" />
                       </div>
                    </div>
                  ))}
               </div>
               <div className="mt-12 text-center">
                  <Link href={`https://instagram.com/`} className="inline-flex items-center gap-4 bg-gray-900 text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95">
                     Connect With Us <IGIcon className="w-4 h-4" />
                  </Link>
               </div>
            </div>
         </section>
       );

    case 'text':
      return (
        <section className="py-16 px-6 max-w-4xl mx-auto">
           <div className="prose prose-amber prose-lg max-w-none text-gray-900 font-medium leading-relaxed text-center opacity-90" dangerouslySetInnerHTML={{ __html: content.html }} />
        </section>
      );

    default:
      return null;
  }
}
