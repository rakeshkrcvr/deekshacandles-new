"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";

interface Slide {
  topText?: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonUrl: string;
}

export default function HeroSlider({ items }: { items: Slide[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-gray-900 group">
      {items.map((slide, idx) => (
        <div 
          key={idx}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === current ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 z-10" />
          
          {/* Background Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={slide.image || "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&q=80&w=1920"} 
            className="absolute inset-0 w-full h-full object-cover" 
            alt={slide.title} 
          />

          {/* Content */}
          <div className="relative z-20 h-full flex items-center justify-center text-center px-6">
            <div className={`max-w-4xl transition-all duration-1000 delay-300 ${idx === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h2 className="text-white text-[10px] font-bold uppercase tracking-[0.4em] mb-4">
                 {slide.topText || 'Handcrafted Luxury'}
              </h2>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight uppercase">
                 {slide.title}
              </h1>
              <div className="w-12 h-1 bg-white/20 mx-auto mb-6 rounded-full" />
              <p className="text-sm md:text-base text-white/80 mb-10 max-w-2xl mx-auto drop-shadow-lg font-medium">
                 {slide.subtitle}
              </p>
              
              {slide.buttonText && (
                 <Link 
                   href={slide.buttonUrl || "/products"} 
                   className="inline-flex items-center gap-3 bg-white text-gray-900 font-bold px-8 py-3 rounded-none hover:bg-amber-100 transition-all shadow-xl hover:scale-105 active:scale-95 text-[10px] uppercase tracking-widest"
                 >
                   {slide.buttonText} <ShoppingBag className="w-4 h-4" />
                 </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {items.length > 1 && (
        <>
          <button 
            onClick={() => setCurrent((prev) => (prev - 1 + items.length) % items.length)}
            className="absolute left-10 top-1/2 -translate-y-1/2 z-30 p-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-none hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 -translate-x-10 group-hover:translate-x-0"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setCurrent((prev) => (prev + 1) % items.length)}
            className="absolute right-10 top-1/2 -translate-y-1/2 z-30 p-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-none hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0"
          >
            <ArrowRight className="w-6 h-6" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
             {items.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`transition-all duration-500 rounded-none ${idx === current ? 'w-10 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/60'}`}
                />
             ))}
          </div>
        </>
      )}
    </section>
  );
}
