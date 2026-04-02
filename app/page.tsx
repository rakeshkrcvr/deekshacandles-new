import Link from "next/link";
import { ArrowRight, Leaf, Sparkles, Flame, ShoppingBag } from "lucide-react";
import prisma from "@/lib/prisma";
import HeroSlider from "@/components/HeroSlider";
import SectionRenderer from "@/components/SectionRenderer";
import CategorySlider from "@/components/CategorySlider";
import OfferSection from "@/components/OfferSection";
import TrendingProducts from "@/components/TrendingProducts";
import ProductCard from "@/components/ProductCard";
import FAQSection from "@/components/FAQSection";
import PromoBanners from "@/components/PromoBanners";
import ReelsSlider from "@/components/ReelsSlider";
import CategoryPillSlider from "@/components/CategoryPillSlider";

export default async function Home() {
  // Try to find a page named 'home'
  const homePage = await prisma.page.findUnique({
    where: { slug: 'home' },
    include: { sections: { orderBy: { order: 'asc' } } }
  });

  const trendingProducts = await prisma.product.findMany({
    take: 12,
    orderBy: { createdAt: 'desc' },
    include: { categories: true, images: true }
  });

  if (homePage) {
    return (
      <div className="min-h-screen bg-white">
        {homePage.sections.filter((s: any) => s.active).map((section: any, idx: number) => (
          <div key={section.id}>
            <SectionRenderer section={section} />
            {idx === 0 && (
              <>
                {!homePage.sections.some((s: any) => s.type === 'category-pill') && <CategoryPillSlider />}
                {!homePage.sections.some((s: any) => s.type === 'categories') && <CategorySlider />}
                {!homePage.sections.some((s: any) => s.type === 'offer-section') && <OfferSection />}
                {!homePage.sections.some((s: any) => s.type === 'promo-banners' || s.type === 'discount-banners') && <PromoBanners />}
                {!homePage.sections.some((s: any) => s.type === 'products') && <TrendingProducts products={trendingProducts} />}
                {!homePage.sections.some((s: any) => s.type === 'reels-slider') && <ReelsSlider />}
                {!homePage.sections.some((s: any) => s.type === 'faq' || s.type === 'collapsible') && <FAQSection />}
              </>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Fallback to current hardcoded layout
  const products = trendingProducts.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#faf9f6]">


      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=2000" 
              alt="Beautiful candles" 
              className="w-full h-full object-cover brightness-[0.85]"
            />
          </div>
          
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto text-white">
            <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight drop-shadow-lg">
              Illuminate Your Senses
            </h1>
            <p className="text-lg md:text-2xl mb-10 text-white/90 font-light max-w-2xl mx-auto drop-shadow-md">
              Hand-poured artisan candles crafted with premium soy wax and pure botanical fragrances.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/products/lavender-dreams" 
                className="bg-white text-gray-900 hover:bg-amber-50 px-8 py-4 rounded-full font-semibold transition-all flex items-center gap-2 transform hover:scale-105"
              >
                Shop Collection <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/admin" 
                className="bg-gray-900/60 hover:bg-gray-900 backdrop-blur text-white px-8 py-4 rounded-full font-semibold transition-all border border-white/20 transform hover:scale-105"
              >
                Go to Admin
              </Link>
            </div>
          </div>
        </section>

        <CategoryPillSlider />
        <CategorySlider />
        <OfferSection />
        <PromoBanners />
        <TrendingProducts products={trendingProducts} />
        <ReelsSlider />
        <FAQSection />

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
              <div className="text-left">
                <span className="text-[#ea7500] font-bold tracking-[0.2em] uppercase mb-4 block text-[11px]">LUXE COLLECTION</span>
                <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-0 font-bold tracking-tight leading-tight">
                  Shop Latest
                </h2>
              </div>
              <Link href="/products" className="inline-flex items-center justify-center bg-gray-50/80 hover:bg-white border border-gray-100 text-gray-900 px-8 py-3.5 rounded-sm font-bold text-[13px] transition-all shadow-sm hover:shadow-md group whitespace-nowrap">
                Full Storefront <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {products.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-3xl border border-gray-100">
                <Leaf className="w-10 h-10 mx-auto text-gray-300 mb-4" />
                <p>No products available yet. Check back soon!</p>
              </div>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-amber-50 rounded-sm mx-4 mb-10">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">Why Deeksha Candles?</h2>
              <div className="w-16 h-1 bg-amber-500 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center flex flex-col items-center group">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-amber-100 transition-colors">
                  <Leaf className="w-8 h-8 text-amber-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">100% Natural Soy</h3>
                <p className="text-gray-600 leading-relaxed">
                  Eco-friendly, biodegradable, and burns cleaner than traditional paraffin wax.
                </p>
              </div>
              <div className="text-center flex flex-col items-center group">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-amber-100 transition-colors">
                  <Sparkles className="w-8 h-8 text-amber-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Fragrances</h3>
                <p className="text-gray-600 leading-relaxed">
                  Infused with pure essential oils and high-quality fragrance blends.
                </p>
              </div>
              <div className="text-center flex flex-col items-center group">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-amber-100 transition-colors">
                  <Flame className="w-8 h-8 text-amber-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Long Lasting Burn</h3>
                <p className="text-gray-600 leading-relaxed">
                  Carefully selected wicks ensure an even, slow burn that lasts hours.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
