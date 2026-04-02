import prisma from "@/lib/prisma";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function CategorySlider() {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        take: 1
      }
    }
  });

  if (categories.length === 0) return null;

  const getGridLayout = (i: number) => {
    const patterns = [
      "md:col-span-2 md:row-span-1 min-h-[250px] md:min-h-[300px]", 
      "md:col-span-1 md:row-span-2 min-h-[250px] md:min-h-[600px]", 
      "md:col-span-1 md:row-span-2 min-h-[250px] md:min-h-[600px]", 
      "md:col-span-1 md:row-span-2 min-h-[250px] md:min-h-[600px]", 
      "md:col-span-1 md:row-span-2 min-h-[250px] md:min-h-[600px]", 
      "md:col-span-2 md:row-span-1 min-h-[250px] md:min-h-[300px]", 
    ];
    return patterns[i % patterns.length];
  };

  const getColorOverlay = (i: number) => {
    const overlays = [
      "from-[#629d9e]/90 via-[#629d9e]/40 to-transparent", 
      "from-[#1c2c3b]/90 via-[#1c2c3b]/40 to-transparent", 
      "from-[#d09164]/90 via-[#d09164]/40 to-transparent", 
      "from-[#3b93c4]/90 via-[#3b93c4]/40 to-transparent", 
      "from-[#f38a90]/90 via-[#f38a90]/40 to-transparent", 
      "from-[#5c9ae6]/90 via-[#5c9ae6]/40 to-transparent", 
    ];
    return overlays[i % overlays.length];
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 md:mb-12 gap-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Collection List</h2>
          <Link href="/products" className="mb-2 text-[11px] font-bold text-amber-600 uppercase tracking-widest hover:text-amber-700 transition-all hidden md:flex items-center gap-2 group">
              ALL COLLECTIONS <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {/* Masonry Grid Setup */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-flow-row-dense gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <Link 
              href={`/category/${cat.slug}`} 
              key={cat.id} 
              className={`group relative rounded-[20px] overflow-hidden flex flex-col p-6 md:p-8 bg-gray-100 ${getGridLayout(i)}`}
            >
              {/* Image */}
              <img 
                src={cat.icon || "https://images.unsplash.com/photo-1603006905501-4470fc38ad72?auto=format&fit=crop&q=80&w=1000"} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1500ms] ease-out" 
                alt={cat.name} 
              />
              
              {/* Dynamic Gradients */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getColorOverlay(i)} opacity-90 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-100`} />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/10" />

              {/* Content Top */}
              <div className="relative z-10 w-full md:w-4/5 lg:w-3/4">
                <span className="text-[9px] md:text-[10px] font-bold text-white/80 uppercase tracking-widest mb-3 block">
                  COLLECTION
                </span>
                <h3 className="text-2xl md:text-[32px] font-bold text-white leading-[1.15] drop-shadow-md group-hover:text-white transition-colors">
                  {cat.name}
                </h3>
              </div>

              {/* Content Bottom Button */}
              <div className="relative z-10 mt-auto pt-8">
                <div className="inline-flex items-center bg-white text-gray-900 px-5 py-2.5 rounded-lg text-[11px] font-bold shadow-xl shadow-black/10 group-hover:-translate-y-1 transition-transform duration-300">
                    Browse Collection
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Mobile Button */}
        <div className="mt-8 text-center md:hidden">
          <Link href="/products" className="inline-flex items-center gap-2 text-[11px] font-bold text-amber-600 uppercase tracking-widest border border-amber-600/20 px-6 py-3 rounded-full">
              ALL COLLECTIONS <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
