"use client";

import { useRef } from "react";
import Link from "next/link";
import { Play, VolumeX, Instagram, ChevronLeft, ChevronRight } from "lucide-react";

export default function ReelsSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Mock Reel Data
  const reels = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1603006905393-3b10b6d214c7?auto=format&fit=crop&q=80&w=400&h=700",
      title: "Colorful Scented Candle",
      link: "https://instagram.com/deekshacandles",
      hasProductOverlay: true,
      price: "₹599.00",
      originalPrice: "₹999.00"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1596433809252-260c27459d1a?auto=format&fit=crop&q=80&w=400&h=700",
      title: "Curl up and unwind with our comfy sweater \uD83E\uDD7A",
      link: "https://instagram.com/deekshacandles"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1582211594533-5c8c4a16ed71?auto=format&fit=crop&q=80&w=400&h=700",
      title: "Replenish your energy with Coffee \u2764\uFE0F",
      link: "https://instagram.com/deekshacandles"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1602874801007-bd458fc1d917?auto=format&fit=crop&q=80&w=400&h=700",
      title: "Elevate your everyday style \u2764\uFE0F",
      link: "https://instagram.com/deekshacandles"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1626071465997-df0db9b2dca8?auto=format&fit=crop&q=80&w=400&h=700",
      title: "Turn Up The Activity With Drinks",
      link: "https://instagram.com/deekshacandles"
    }
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-5 md:px-8 relative">
        
        {/* Top Follow Button */}
        <div className="flex justify-center mb-10">
          <Link 
            href="https://instagram.com/deekshacandles" 
            target="_blank"
            className="flex items-center gap-2 bg-[#a67c00] hover:bg-[#866300] text-white px-8 py-3 rounded-full font-bold text-sm tracking-widest transition-colors shadow-lg shadow-[#a67c00]/20"
          >
            <Instagram className="w-4 h-4" /> FOLLOW @DEEKSHACANDLES
          </Link>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          
          {/* Scroll Buttons (Desktop only overlap) */}
          <button 
            onClick={scrollLeft}
            className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-gray-600/80 hover:bg-gray-800 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow-md opacity-0 group-hover:opacity-100 hidden md:flex"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 ml-[-2px]" />
          </button>

          {/* Slider */}
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 md:gap-5 pb-8 pt-4 snap-x snap-mandatory hide-scrollbars scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Inline styles mapped for hiding scrollbar completely globally or locally */}
            <style dangerouslySetInnerHTML={{__html: `
              .hide-scrollbars::-webkit-scrollbar { display: none; }
            `}} />

            {reels.map((reel) => (
              <a 
                key={reel.id} 
                href={reel.link}
                target="_blank"
                rel="noreferrer"
                className="relative flex-shrink-0 w-[240px] md:w-[280px] lg:w-[300px] aspect-[9/16] rounded-[32px] overflow-hidden group/card snap-center cursor-pointer shadow-lg shadow-black/5"
              >
                {/* Image */}
                <img 
                  src={reel.image} 
                  alt={reel.title} 
                  className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700"
                />

                {/* Dark Overlays */}
                <div className="absolute inset-0 bg-black/10 transition-colors group-hover/card:bg-black/20" />
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />

                {/* Mute Icon */}
                <div className="absolute top-6 right-6 text-white/90 drop-shadow-md">
                  <VolumeX className="w-5 h-5" />
                </div>

                {/* Center Play Icon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all border border-white/50 text-white shadow-lg">
                  <Play className="w-4 h-4 fill-white ml-[3px]" />
                </div>

                {/* Bottom Content Space */}
                <div className="absolute bottom-0 left-0 right-0 p-6 pt-10 text-center flex flex-col items-center justify-end h-full">
                  {!reel.hasProductOverlay && (
                     <div className="mb-2 w-max mx-auto px-4 py-1 text-white/50 font-serif text-[11px] italic border-b border-white/20 tracking-wide">
                        Www.deekshacandles.in
                     </div>
                  )}

                  <h3 className="text-white text-[13px] leading-snug font-medium line-clamp-2 px-2 drop-shadow-md">
                    {reel.title}
                  </h3>
                </div>

                {/* Product Overlay (if valid) like Image 1 in slider */}
                {reel.hasProductOverlay && (
                  <div className="absolute bottom-5 left-5 right-5 bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex gap-3 text-left">
                    <img 
                      src={reel.image} 
                      className="w-14 h-14 object-cover rounded-xl" 
                      alt="Product thumnail" 
                    />
                    <div className="flex flex-col justify-center">
                      <h4 className="text-white text-[11px] font-bold leading-tight line-clamp-2 mb-1">
                        {reel.title}
                      </h4>
                      <p className="text-white/90 text-[10px] font-bold">
                        <span className="line-through text-white/60 font-normal mr-1">{reel.originalPrice}</span>
                        {reel.price}
                      </p>
                    </div>
                  </div>
                )}
                
              </a>
            ))}
          </div>

          {/* Right Arrow (Desktop) */}
          <button 
            onClick={scrollRight}
            className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-gray-600/80 hover:bg-gray-800 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow-md opacity-0 group-hover:opacity-100 hidden md:flex"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 ml-[2px]" />
          </button>

        </div>
      </div>
    </section>
  );
}
