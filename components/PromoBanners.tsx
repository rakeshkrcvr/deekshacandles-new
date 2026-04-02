import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PromoBanners() {
  const banners = [
    {
      id: 1,
      discount: "25% Discount",
      title: "Luxury Scented \nPerfectly",
      bgClass: "bg-[#f4efe4]",
      image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600",
      link: "/products"
    },
    {
      id: 2,
      discount: "30% Discount",
      title: "Hydrated Soya \nPerfectly",
      bgClass: "bg-[#f5eee3]",
      image: "https://images.unsplash.com/photo-1603006905501-4470fc38ad72?auto=format&fit=crop&q=80&w=600",
      link: "/products?category=scented"
    }
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {banners.map((banner) => (
            <div 
              key={banner.id} 
              className={`relative ${banner.bgClass} flex items-center p-8 md:p-12 overflow-hidden group`}
            >
              {/* Text Content */}
              <div className="relative z-10 max-w-[50%]">
                <span className="text-gray-600 text-sm md:text-base mb-2 md:mb-3 block font-medium">
                  {banner.discount}
                </span>
                <h3 className="text-2xl md:text-3xl font-serif text-gray-900 font-bold leading-tight mb-8 whitespace-pre-line">
                  {banner.title}
                </h3>
                <Link 
                  href={banner.link} 
                  className="bg-[#9e3253] text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all hover:bg-[#832843] shadow-lg shadow-[#9e3253]/20 hover:-translate-y-0.5 inline-block"
                >
                  Shop Now
                </Link>
              </div>

              {/* Image Content */}
              <div className="absolute right-0 top-0 bottom-0 w-[55%] h-full z-0 flex items-center justify-end">
                <img 
                  src={banner.image} 
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.id === 1 ? 'from-[#f4efe4]' : 'from-[#f5eee3]'} via-transparent to-transparent z-10 w-1/2`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
