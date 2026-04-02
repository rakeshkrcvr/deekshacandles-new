"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  discount: number | null;
  images: any[];
  stock: number;
  categories: any[];
}

export default function TrendingProducts({ products }: { products: Product[] }) {
  const [activeTab, setActiveTab] = useState("New Arrivals");
  
  const tabs = ["New Arrivals", "Bestseller", "Special"];
  
  let displayProducts = [...products];
  if (activeTab === "Bestseller") {
    displayProducts.reverse(); 
  } else if (activeTab === "Special") {
    displayProducts = displayProducts.filter(p => (p.discount || 0) > 0);
  }

  return (
    <section className="py-24 bg-[#faf9f6]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6 font-bold tracking-wide">
            Trending Products
          </h2>
          
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2.5 rounded-full text-[13px] md:text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === tab 
                    ? "bg-[#9e3253] text-white shadow-lg shadow-[#9e3253]/20" 
                    : "bg-white text-gray-600 hover:text-[#9e3253] border border-gray-100 shadow-sm hover:border-[#9e3253]/20"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {displayProducts.slice(0, 12).map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        {displayProducts.length === 0 && (
          <div className="text-center text-gray-400 py-16 font-medium">No products found for this section.</div>
        )}

      </div>
    </section>
  );
}
