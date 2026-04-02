import Link from "next/link";

interface Banner {
  discountText: string;
  title: string;
  buttonText: string;
  linkUrl: string;
  bgColorClass?: string;
}

export default function DiscountBanners({ banners }: { banners: Banner[] }) {
  if (!banners || banners.length === 0) return null;

  return (
    <section className="py-12 px-6">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-start justify-center p-12 md:p-16 rounded-[4px] relative overflow-hidden group min-h-[300px] ${
              banner.bgColorClass || "bg-gradient-to-r from-[#F6F0E9] to-[#EBE2D5]"
            }`}
          >
            {/* Soft glowing overlay to match the image gradient feeling */}
            <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="relative z-10 space-y-4 max-w-sm">
              <span className="text-[12px] font-bold text-gray-500 uppercase tracking-widest block">
                {banner.discountText}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1e2a38] leading-tight mb-6">
                <span dangerouslySetInnerHTML={{ __html: banner.title.replace(/\n/g, "<br/>") }} />
              </h2>
              <Link
                href={banner.linkUrl}
                className="inline-block mt-4 bg-[#A33959] text-white px-8 py-3 rounded-full text-[12px] font-bold tracking-widest transition-transform hover:scale-105 shadow-md active:scale-95"
              >
                {banner.buttonText}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
