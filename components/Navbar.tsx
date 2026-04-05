"use client";

import Link from 'next/link';
import { Search, ShoppingBag, User, Phone, Mail, X, Menu, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";

export default function Navbar({ theme }: { theme: any }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { items, setDrawerOpen } = useCartStore();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <div className="bg-gray-900 text-white/90 text-xs font-medium py-2 px-4 flex flex-col sm:flex-row justify-between items-center z-50 relative gap-2 sm:gap-0">
        <div className="flex items-center gap-4">
          <a href={`tel:${theme?.contact?.phone || ""}`} className="flex items-center gap-1.5 hover:text-white transition">
            <Phone className="w-3.5 h-3.5" /> {theme?.contact?.phone || "+91-9971459984"}
          </a>
          <a href={`mailto:${theme?.contact?.email || ""}`} className="hidden sm:flex items-center gap-1.5 hover:text-white transition">
            <Mail className="w-3.5 h-3.5" /> {theme?.contact?.email || "deekshachauhancandles@gmail.com"}
          </a>
        </div>
        <div className="tracking-wide">
           {theme?.contact?.announcement || "✨ FREE SHIPPING ON PREPAID ORDERS"}
        </div>
      </div>

      <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-100 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Hamburger + Logo */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden text-gray-900 p-1 -ml-2 transition"
              >
                <Menu className="w-6 h-6" />
              </button>
              <Link href="/" className="flex-shrink-0">
                {theme?.logo ? (
                  <img 
                    src={theme.logo} 
                    alt="Logo" 
                    className="h-10 md:h-12 w-auto object-contain" 
                  />
                ) : (
                  <span className="text-xl md:text-2xl font-bold tracking-tighter text-gray-900 uppercase">
                    {theme?.logoText || "DEEKSHA CANDLES"}
                  </span>
                )}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex gap-8 text-[10px] font-bold text-gray-700 uppercase tracking-widest relative">
              {theme?.navbar?.map((link: any) => (
                link.submenu && link.submenu.length > 0 ? (
                  <div key={link.id} className="group relative">
                    <Link href={link.url} className="hover:text-amber-700 transition py-2 inline-flex items-center gap-1">
                      {link.label}
                      <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                    </Link>
                    <div className="absolute top-full left-0 bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 min-w-[200px] z-50 rounded-xl p-2 transform translate-y-2 group-hover:translate-y-0">
                      {link.submenu.map((sub: any) => (
                        <Link key={sub.id} href={sub.url} className="block px-4 py-2.5 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition text-xs font-bold text-gray-600 uppercase tracking-wider">
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link key={link.id} href={link.url} className="hover:text-amber-700 transition py-2 inline-block">
                    {link.label}
                  </Link>
                )
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-5 flex-shrink-0">
              <div className="flex items-center">
                {isSearchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 animate-in slide-in-from-right-4 fade-in duration-300">
                    <input 
                      ref={inputRef}
                      type="text" 
                      placeholder="Search candles..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent text-sm text-gray-900 outline-none w-32 md:w-48 placeholder:text-gray-400"
                    />
                    <button type="submit" className="text-amber-600 hover:text-amber-700 ml-2">
                       <Search className="w-4 h-4" />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setIsSearchOpen(false)}
                      className="text-gray-400 hover:text-gray-600 ml-2"
                    >
                       <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="text-gray-700 hover:text-amber-700 transition p-1"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <button className="text-gray-700 hover:text-amber-700 transition p-1 hidden sm:block">
                <User className="w-5 h-5" />
              </button>
              
              <button onClick={() => setDrawerOpen(true)} className="text-gray-700 hover:text-amber-700 transition p-1 relative flex items-center">
                <ShoppingBag className="w-[22px] h-[22px]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-600 border border-white text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <span className="font-bold tracking-widest uppercase text-sm">Main Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-3 space-y-1">
              {theme?.navbar?.map((link: any) => (
                <div key={link.id} className="border-b border-gray-50 last:border-0 rounded-lg">
                  {link.submenu && link.submenu.length > 0 ? (
                    <>
                      <div 
                        className="flex justify-between items-center w-full p-4 font-bold uppercase text-xs tracking-wider text-gray-800 cursor-pointer hover:bg-gray-50 rounded-lg transition"
                        onClick={() => setExpandedMobileMenu(expandedMobileMenu === link.id ? null : link.id)}
                      >
                        <Link href={link.url} onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-600 transition">
                          {link.label}
                        </Link>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedMobileMenu === link.id ? 'rotate-180 text-amber-500' : ''}`} />
                      </div>
                      {expandedMobileMenu === link.id && (
                        <div className="pl-6 pb-3 space-y-1 bg-amber-50/50 rounded-b-lg">
                          {link.submenu.map((sub: any) => (
                            <Link 
                              key={sub.id} 
                              href={sub.url} 
                              className="block p-3 text-gray-600 hover:text-amber-700 hover:bg-white text-xs font-bold uppercase tracking-wider rounded-lg transition"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <span className="opacity-50 mr-2">↳</span> {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link 
                      href={link.url} 
                      className="block p-4 font-bold uppercase text-xs tracking-wider text-gray-800 hover:text-amber-600 hover:bg-gray-50 rounded-lg transition"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
