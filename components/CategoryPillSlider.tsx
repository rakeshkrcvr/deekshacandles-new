import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function CategoryPillSlider({ title = "Our Collections" }: { title?: string }) {
  const categories = await prisma.category.findMany({
    take: 10,
    orderBy: { createdAt: "asc" }
  });

  if (categories.length === 0) return null;

  return (
    <section className="py-24 bg-[#faf9f6] w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8 mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 tracking-tight">{title}</h2>
      </div>
      
      {/* Slider Wrapper */}
      <div className="w-full flex overflow-x-auto hide-scrollbar px-4 md:px-8 snap-x snap-mandatory gap-4 md:gap-6 pb-6">
        {categories.map((category) => (
          <div key={category.id} className="snap-start shrink-0 w-[85%] sm:w-[45%] md:w-[calc(33.33%-1.2rem)] lg:w-[calc(20%-1.2rem)] xl:w-[calc(20%-1.2rem)] flex-none">
            <Link
              href={`/category/${category.slug}`}
              className="flex items-center bg-white border border-gray-200 rounded-full pr-4 md:pr-6 p-1.5 gap-3 md:gap-4 hover:border-[#9c7b94]/50 hover:shadow-lg transition-all w-full group"
            >
              {/* Category Image Circle */}
              <div className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-full overflow-hidden shrink-0 border border-gray-100">
                <img
                  src={category.icon || "https://images.unsplash.com/photo-1603006905501-4470fc38ad72?auto=format&fit=crop&q=80&w=200"}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              
              {/* Text & Button */}
              <div className="flex flex-col items-start gap-1 py-1.5 overflow-hidden flex-1">
                <h3 className="font-serif font-bold text-gray-900 text-sm md:text-base leading-tight truncate w-full group-hover:text-[#9c7b94] transition-colors">
                  {category.name}
                </h3>
                <span className="bg-[#9c7b94] text-white text-[9px] md:text-[10px] font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full tracking-widest uppercase shadow-sm group-hover:bg-[#86687f] transition-colors whitespace-nowrap">
                  View
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
}
