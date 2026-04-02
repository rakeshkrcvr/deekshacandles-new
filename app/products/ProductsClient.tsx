"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { Filter, X, ChevronDown, LayoutGrid, List, SlidersHorizontal, ShoppingBag, ArrowRight, Star } from "lucide-react";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  discount: number | null;
  stock: number;
  imageUrls: string[];
  categories: { id: string; name: string }[];
  offerTag?: string | null;
}

interface Category {
  id: string;
  name: string;
}

export default function ProductsClient({ 
  initialProducts, 
  categories,
  initialSelectedCategoryIds = []
}: { 
  initialProducts: any[], 
  categories: Category[],
  initialSelectedCategoryIds?: string[];
}) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialSelectedCategoryIds);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const router = useRouter();
  const { addToCart, setDrawerOpen } = useCartStore();

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter by category
    if (selectedCategories.length > 0) {
      result = result.filter(p => 
        p.categories.some((c: any) => selectedCategories.includes(c.id))
      );
    }

    // Filter by price
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [initialProducts, selectedCategories, priceRange, sortBy]);

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header and Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <nav className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest mb-4">
              <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">Collections</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-serif text-gray-900 font-bold mb-2">Our Collections</h1>
            <p className="text-gray-500 font-light text-xs uppercase tracking-wider">{filteredProducts.length} Artisan Candles Found</p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-sm hover:bg-gray-50 transition-all font-medium text-sm text-gray-900"
            >
              <Filter className="w-4 h-4" /> Filters
            </button>

            <div className="hidden md:flex items-center bg-white border border-gray-100 rounded-sm p-1 shadow-sm">
                <button 
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
            </div>

            <div className="relative group min-w-[200px]">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-sm px-5 py-3 text-sm font-medium text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-gray-600" />
            </div>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0 space-y-10 sticky top-32 self-start h-fit">
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-600" /> Categories
              </h3>
              <div className="space-y-4">
                {categories.map(category => (
                  <label key={category.id} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                        className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-lg checked:bg-amber-600 checked:border-amber-600 transition-all"
                      />
                      <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600 group-hover:text-gray-900 transition-colors font-medium text-sm">
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6">Price Range</h3>
              <div className="space-y-6">
                <input 
                  type="range" 
                  min="0" 
                  max="5000" 
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full accent-amber-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="bg-gray-100 px-3 py-1.5 rounded-lg text-gray-600">₹0</span>
                  <span className="bg-amber-100 px-3 py-1.5 rounded-lg text-amber-700">₹{priceRange[1]}</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100/50">
               <h4 className="font-serif text-amber-900 font-bold mb-2">Sustainable Luxury</h4>
               <p className="text-amber-800/70 text-sm leading-relaxed mb-4">Every candle is hand-poured with natural soy wax and botanicals.</p>
               <Link href="/about" className="text-amber-700 text-xs font-bold flex items-center gap-1 group uppercase tracking-widest">
                 Learn more <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
          </aside>

          {/* Main Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-sm py-32 text-center border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Filter className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No matching candles</h3>
                <p className="text-gray-500 mb-8">Try adjusting your filters to find what you are looking for.</p>
                <button 
                  onClick={() => {setSelectedCategories([]); setPriceRange([0, 5000]);}}
                  className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className={`${viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12' : 'flex flex-col gap-8'}`}>
                {filteredProducts.map(product => (
                  <div key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 z-[100] transition-visibility ${isFilterOpen ? 'visible' : 'invisible'}`}>
        <div 
          className={`absolute inset-0 bg-gray-900/60 transition-opacity duration-300 ${isFilterOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsFilterOpen(false)}
        />
        <aside className={`absolute right-0 top-0 h-full w-[85%] sm:w-96 bg-white shadow-2xl transition-transform duration-500 transform ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          <div className="flex items-center justify-between p-8 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">Filters</h2>
            <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 space-y-12">
            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Collections</h3>
              <div className="grid grid-cols-1 gap-4">
                {categories.map(category => (
                  <button 
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className={`flex items-center justify-between p-4 rounded-sm border transition-all font-medium text-sm ${selectedCategories.includes(category.id) ? 'bg-amber-50 border-amber-600 text-amber-900' : 'bg-white border-gray-100 text-gray-600'}`}
                  >
                    {category.name}
                    <div className={`w-2 h-2 rounded-full ${selectedCategories.includes(category.id) ? 'bg-amber-600' : 'bg-transparent'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Price Range</h3>
              <div className="space-y-6">
                <input 
                  type="range" 
                  min="0" 
                  max="5000" 
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-400">₹0</span>
                  <span className="text-amber-600 font-serif text-2xl">₹{priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 border-t border-gray-100 bg-gray-50/50">
            <button 
              onClick={() => setIsFilterOpen(false)}
              className="w-full bg-gray-900 text-white font-bold py-5 rounded-sm shadow-xl shadow-gray-900/10 active:scale-95 transition-all"
            >
              Show {filteredProducts.length} Results
            </button>
          </div>
        </aside>
      </div>

    </div>
  );
}
