import Link from "next/link";

export default function OfferSection({ banners }: { banners?: any[] }) {
  const defaultBanners = [
    {
      title: "Luxury <br /> Soy Candles",
      subtitle: "Premium Collection",
      linkUrl: "/products",
      linkText: "Shop Now »",
      bgClass: "bg-[#f6efe9]",
      image: "https://images.unsplash.com/photo-1602874801007-bd458fc1d917?auto=format&fit=crop&q=80&w=1000",
      large: true
    },
    {
      title: "Botanical <br />Scents",
      subtitle: "10% OFF",
      linkUrl: "/products?category=scented",
      linkText: "Shop Now »",
      bgClass: "bg-[#eaf1ec]",
      image: "https://images.unsplash.com/photo-1596433809252-260c27459d1a?auto=format&fit=crop&q=80&w=1000"
    },
    {
      title: "Aromatherapy <br />Gift Sets",
      subtitle: "Up to 30% OFF",
      linkUrl: "/collections",
      linkText: "Shop Now »",
      bgClass: "bg-[#f8f9fb]",
      image: "https://images.unsplash.com/photo-1582211594533-5c8c4a16ed71?auto=format&fit=crop&q=80&w=1000"
    }
  ];

  const data = banners && banners.length >= 3 ? banners : defaultBanners;

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          
          {/* Left Large Column (Banner 0) */}
          <div className={`relative ${data[0].bgClass || 'bg-[#f6efe9]'} rounded-3xl overflow-hidden aspect-[4/5] md:aspect-auto md:h-full p-8 md:p-12 flex flex-col justify-start group`}>
            <div className="absolute inset-0 z-0">
              <img 
                src={data[0].image} 
                alt={data[0].title.replace(/<[^>]*>?/gm, '')} 
                className="w-full h-full object-cover object-bottom md:object-[70%_100%] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#f6efe9]/90 to-transparent w-full md:w-2/3" />
            </div>
            <div className="relative z-10 pt-4">
              <span className="text-[#e27d73] font-bold text-[10px] md:text-xs tracking-widest uppercase mb-3 block">{data[0].subtitle}</span>
              <h3 
                className="text-3xl md:text-4xl font-serif text-gray-900 mb-6 leading-tight font-bold" 
                dangerouslySetInnerHTML={{ __html: data[0].title }} 
              />
              <Link href={data[0].linkUrl || '/'} className="text-[11px] font-bold text-gray-900 border-b-[1.5px] border-gray-900 pb-0.5 w-max tracking-wider uppercase transition-colors hover:text-[#e27d73] hover:border-[#e27d73]">
                {data[0].linkText || 'Shop Now'}
              </Link>
            </div>
          </div>

          {/* Right Stacked Columns */}
          <div className="flex flex-col gap-4 md:gap-6">
            
            {/* Top Right Block (Banner 1) */}
            <div className={`relative ${data[1].bgClass || 'bg-[#eaf1ec]'} rounded-3xl overflow-hidden p-8 md:p-10 flex flex-col justify-center min-h-[250px] md:min-h-[280px] group`}>
              <div className="absolute inset-0 z-0">
                <img 
                  src={data[1].image} 
                  alt={data[1].title.replace(/<[^>]*>?/gm, '')} 
                  className="w-full h-full object-cover object-right group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#eaf1ec]/90 to-transparent w-full md:w-1/2" />
              </div>
              <div className="relative z-10 max-w-[200px]">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{data[1].subtitle}</h3>
                <h4 
                  className="text-lg text-gray-700 font-serif mb-5 leading-tight"
                  dangerouslySetInnerHTML={{ __html: data[1].title }}
                />
                <Link href={data[1].linkUrl || '/'} className="text-[11px] font-bold text-gray-900 border-b-[1.5px] border-gray-900 pb-0.5 w-max tracking-wider uppercase transition-colors hover:text-green-700 hover:border-green-700">
                  {data[1].linkText || 'Shop Now'}
                </Link>
              </div>
            </div>

            {/* Bottom Right Block (Banner 2) */}
            <div className={`relative ${data[2].bgClass || 'bg-[#f8f9fb]'} rounded-3xl overflow-hidden p-8 md:p-10 flex flex-col justify-center min-h-[250px] md:min-h-[280px] group`}>
              <div className="absolute inset-0 z-0">
                <img 
                  src={data[2].image} 
                  alt={data[2].title.replace(/<[^>]*>?/gm, '')} 
                  className="w-full h-full object-cover object-right group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 to-transparent w-[70%]" />
              </div>
              <div className="relative z-10 max-w-[200px]">
                <span className="text-[#e27d73] font-bold text-[10px] uppercase tracking-widest mb-2 block">{data[2].subtitle}</span>
                <h4 
                   className="text-xl md:text-2xl text-gray-900 font-serif mb-5 leading-tight font-bold"
                   dangerouslySetInnerHTML={{ __html: data[2].title }}
                />
                <Link href={data[2].linkUrl || '/'} className="text-[11px] font-bold text-gray-900 border-b-[1.5px] border-gray-900 pb-0.5 w-max tracking-wider uppercase transition-colors hover:text-[#e27d73] hover:border-[#e27d73]">
                  {data[2].linkText || 'Shop Now'}
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
