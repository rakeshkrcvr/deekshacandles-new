"use client";

import { 
  Settings, Save, Plus, Trash2, Image as ImageIcon, Text as TextIcon,
  LayoutGrid, Info, Heart, Instagram, Mail, HelpCircle, Video, List, Sparkles,
  Phone, Timer, MapPin, Columns, Layers, Megaphone, Stars, PlayCircle, MessageSquare,
  UploadCloud, Loader2
} from "lucide-react";
import { useState } from "react";
// import { uploadAction } from "./actions"; // Replaced by API route for standalone upload reliability

interface Section {
  id: string;
  type: string;
  content: any;
  order: number;
  active?: boolean;
}

export default function SectionEditor({ 
  section, 
  onUpdate, 
  onClose 
}: { 
  section: Section, 
  onUpdate: (content?: any, active?: boolean) => void, 
  onClose: () => void 
}) {
  const t = section.type;

  const ImageUploadField = ({ 
    label, 
    value, 
    onChange 
  }: { 
    label: string, 
    value: string, 
    onChange: (val: string) => void 
  }) => {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Upload failed on server.");
        }

        const data = await res.json();
        
        if (data.url) {
          onChange(data.url);
        } else {
          throw new Error("No URL returned from server.");
        }
      } catch (err: any) {
        console.error("Upload error:", err);
        alert(`Upload failed: ${err.message || 'Unknown error'}`);
      } finally {
        setIsUploading(false);
      }
    };

    return (
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">{label}</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input 
              className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm pr-10 placeholder:text-gray-900" 
              value={value || ''} 
              onChange={(e) => onChange(e.target.value)} 
              placeholder="Image URL..."
            />
            {value && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md overflow-hidden border border-gray-200 shadow-sm">
                <img src={value} className="w-full h-full object-cover" alt="prev" />
              </div>
            )}
          </div>
          <div className="relative group">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleUpload} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              disabled={isUploading}
            />
            <button className={`p-3 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center transition-all ${isUploading ? 'opacity-50' : 'group-hover:bg-amber-50 group-hover:border-amber-200'}`}>
              {isUploading ? <Loader2 className="w-5 h-5 animate-spin text-amber-600" /> : <UploadCloud className="w-5 h-5 text-gray-400 group-hover:text-amber-600" />}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-right-8 duration-500">
      <div className="bg-gray-900 p-8 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center">
               <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
               <h3 className="text-white font-bold text-xl capitalize">{t.replace(/-/g, ' ')} Block</h3>
               <p className="text-white/40 text-sm italic">Shopify-grade UI customization...</p>
            </div>
         </div>
         <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${section.active !== false ? 'text-emerald-400' : 'text-gray-400'}`}>
               {section.active !== false ? 'Active' : 'Hidden'}
            </span>
            <button 
              onClick={() => onUpdate(undefined, !(section.active !== false))}
              className={`w-12 h-6 rounded-full transition-all relative ${section.active !== false ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-gray-700'}`}
            >
               <div className={`absolute top-1 bottom-1 w-4 rounded-full bg-white transition-all ${section.active !== false ? 'right-1' : 'left-1'}`} />
            </button>
         </div>
      </div>

      <div className="p-10 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
        {/* TITLES & HEADINGS */}
        {['about', 'products', 'features', 'testimonials', 'instagram', 'faq', 'categories', 'category-pill', 'newsletter', 'logo-list', 'countdown', 'multi-column', 'video', 'scrolling-banner'].includes(t) && (
           <div className="space-y-4">
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Main Heading</label>
                <input type="text" value={section.content.title || ''} onChange={(e) => onUpdate({ title: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-xl font-bold italic shadow-inner placeholder:text-gray-900" placeholder="E.g. Explore Collections" />
             </div>
             {['features', 'testimonials', 'instagram', 'newsletter', 'faq', 'multi-column'].includes(t) && (
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subtitle / Tagline</label>
                 <textarea value={section.content.subtitle || ''} onChange={(e) => onUpdate({ subtitle: e.target.value })} rows={2} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm shadow-inner placeholder:text-gray-900" placeholder="Brief description..." />
               </div>
             )}
           </div>
        )}

        {/* HERO / SLIDESHOW EDITOR */}
        {t === 'hero' && (
          <div className="space-y-8">
             <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase">Slides ({section.content.items?.length || 0})</h4>
                <button onClick={() => onUpdate({ items: [...(section.content.items || []), { title: "New Drop", subtitle: "Limited", buttonText: "Explore", buttonUrl: "/products", image: "" }] })}
                        className="bg-amber-500 text-white px-4 py-2 rounded-xl text-[10px] font-bold">+ New Slide</button>
             </div>
             <div className="space-y-6">
                {(section.content.items || []).map((item: any, idx: number) => (
                   <div key={idx} className="bg-gray-50 rounded-[32px] p-8 border border-gray-100 group/hero">
                      <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-3">
                            <input className="w-full bg-white rounded-xl px-4 py-3 text-sm font-bold shadow-sm placeholder:text-gray-900" value={item.title} onChange={(e) => { const ni = [...section.content.items]; ni[idx].title = e.target.value; onUpdate({ items: ni }); }} placeholder="Title" />
                            <input className="w-full bg-white rounded-xl px-4 py-3 text-sm shadow-sm placeholder:text-gray-900" value={item.subtitle} onChange={(e) => { const ni = [...section.content.items]; ni[idx].subtitle = e.target.value; onUpdate({ items: ni }); }} placeholder="Subtitle" />
                         </div>
                         <div className="space-y-2">
                            <ImageUploadField 
                              label="Slide Image" 
                              value={item.image} 
                              onChange={(val) => { 
                                const ni = [...section.content.items]; 
                                ni[idx].image = val; 
                                onUpdate({ items: ni }); 
                              }} 
                            />
                         </div>
                      </div>
                      <button onClick={() => { const ni = [...section.content.items]; ni.splice(idx, 1); onUpdate({ items: ni }); }} className="text-red-400 mt-4 text-[10px] font-bold">Remove Slide</button>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* IMAGE WITH TEXT / BRAND STORY HERO */}
        {(t === 'image-with-text' || t === 'about') && (
           <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                  <ImageUploadField 
                    label="Main Image" 
                    value={section.content.image} 
                    onChange={(val) => onUpdate({ image: val })} 
                  />
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Layout</label>
                    <select className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm" value={section.content.layout || 'left'} onChange={(e) => onUpdate({ layout: e.target.value })}>
                       <option value="left">Image Left</option>
                       <option value="right">Image Right</option>
                    </select>
                 </div>
              </div>
              <textarea className="w-full bg-gray-50 rounded-xl px-6 py-4 text-sm shadow-inner placeholder:text-gray-900" rows={6} value={section.content.content} onChange={(e) => onUpdate({ content: e.target.value })} placeholder="Story content..." />
           </div>
        )}

         {/* MULTI COLUMN / FEATURE BLOCKS */}
         {t === 'multi-column' && (
            <div className="space-y-6">
               <div className="flex justify-between border-b pb-4">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Columns ({section.content.columns?.length || 0})</label>
                  <button onClick={() => onUpdate({ columns: [...(section.content.columns || []), { title: "Title", text: "Description", image: "", icon: "" }] })} className="bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold">+ Add Column</button>
               </div>
               <div className="grid grid-cols-2 gap-6">
                  {(section.content.columns || []).map((col: any, i: number) => (
                     <div key={i} className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 space-y-3">
                        <input className="w-full bg-white rounded-xl px-3 py-2 text-xs font-bold placeholder:text-gray-900" value={col.title} onChange={(e) => { const nc = [...section.content.columns]; nc[i].title = e.target.value; onUpdate({ columns: nc }); }} placeholder="Title" />
                        <textarea className="w-full bg-white rounded-xl px-3 py-2 text-[10px] placeholder:text-gray-900" value={col.text} onChange={(e) => { const nc = [...section.content.columns]; nc[i].text = e.target.value; onUpdate({ columns: nc }); }} rows={2} placeholder="Text" />
                        <ImageUploadField 
                           label="Column Image/Icon" 
                           value={col.image} 
                           onChange={(val) => { 
                             const nc = [...section.content.columns]; 
                             nc[i].image = val; 
                             onUpdate({ columns: nc }); 
                           }} 
                         />
                        <button onClick={() => { const nc = [...section.content.columns]; nc.splice(i, 1); onUpdate({ columns: nc }); }} className="text-red-400 text-[10px] font-bold">Delete</button>
                     </div>
                  ))}
               </div>
            </div>
         )}
         
         {/* OFFER SECTION BANNERS */}
         {t === 'offer-section' && (
            <div className="space-y-6">
               <div className="flex justify-between items-center border-b pb-4">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Offer Banners (3 Layout Grid)</label>
                  {(!section.content.banners || section.content.banners.length === 0) && (
                     <button 
                        onClick={() => onUpdate({
                           banners: [
                             { title: "Luxury <br /> Soy Candles", subtitle: "Premium Collection", linkUrl: "/products", linkText: "Shop Now »", bgClass: "bg-[#f6efe9]", image: "" },
                             { title: "Botanical <br />Scents", subtitle: "10% OFF", linkUrl: "/products?category=scented", linkText: "Shop Now »", bgClass: "bg-[#eaf1ec]", image: "" },
                             { title: "Aromatherapy <br />Gift Sets", subtitle: "Up to 30% OFF", linkUrl: "/collections", linkText: "Shop Now »", bgClass: "bg-[#f8f9fb]", image: "" }
                           ]
                        })}
                        className="bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold"
                     >
                        + Initialize Banners
                     </button>
                  )}
               </div>
               
               {section.content.banners && section.content.banners.length > 0 && (
                 <div className="grid gap-6">
                    {section.content.banners.map((banner: any, i: number) => (
                       <div key={i} className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 space-y-3">
                          <div className="flex justify-between items-center mb-2">
                             <span className="text-xs font-bold w-full pb-2 border-b border-gray-200 text-gray-600">
                               Banner {i + 1} {i === 0 ? '(Large Left)' : i === 1 ? '(Top Right)' : '(Bottom Right)'}
                             </span>
                          </div>
                          <ImageUploadField 
                             label="Banner Background Image (Optional)" 
                             value={banner.image} 
                             onChange={(val) => { const nb = [...section.content.banners]; nb[i].image = val; onUpdate({ banners: nb }); }} 
                          />
                          <input className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-bold shadow-sm" value={banner.title} onChange={(e) => { const nb = [...section.content.banners]; nb[i].title = e.target.value; onUpdate({ banners: nb }); }} placeholder="Main Title (Use <br/> for line break)" />
                          <input className="w-full bg-white border-none rounded-xl px-4 py-3 text-xs shadow-sm" value={banner.subtitle} onChange={(e) => { const nb = [...section.content.banners]; nb[i].subtitle = e.target.value; onUpdate({ banners: nb }); }} placeholder="Subtitle / Tag (e.g. 10% OFF)" />
                          <input className="w-full bg-white border-none rounded-xl px-4 py-3 text-xs shadow-sm font-mono" value={banner.bgClass} onChange={(e) => { const nb = [...section.content.banners]; nb[i].bgClass = e.target.value; onUpdate({ banners: nb }); }} placeholder="Background Color Class (e.g. bg-[#f6efe9])" />
                          <div className="grid grid-cols-2 gap-2">
                             <input className="w-full bg-white border-none rounded-xl px-4 py-3 text-[10px] font-bold shadow-sm" value={banner.linkText} onChange={(e) => { const nb = [...section.content.banners]; nb[i].linkText = e.target.value; onUpdate({ banners: nb }); }} placeholder="Link Text" />
                             <input className="w-full bg-white border-none rounded-xl px-4 py-3 text-[10px] shadow-sm" value={banner.linkUrl} onChange={(e) => { const nb = [...section.content.banners]; nb[i].linkUrl = e.target.value; onUpdate({ banners: nb }); }} placeholder="Link URL (e.g. /products)" />
                          </div>
                       </div>
                    ))}
                 </div>
               )}
            </div>
         )}



         {/* DISCOUNT BANNERS */}
         {t === 'discount-banners' && (
            <div className="space-y-6">
               <div className="flex justify-between items-center border-b pb-4">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Discount Banners</label>
                  {(!section.content.banners || section.content.banners.length === 0) && (
                     <button 
                        onClick={() => onUpdate({
                           banners: [
                             { discountText: "25% Discount", title: "Luxury Scented\nPerfectly", buttonText: "Shop Now", linkUrl: "/collections/luxury", bgColorClass: "bg-gradient-to-r from-[#F6F0E9] to-[#EBE2D5]" },
                             { discountText: "30% Discount", title: "Hydrated Soya\nPerfectly", buttonText: "Shop Now", linkUrl: "/collections/soya", bgColorClass: "bg-gradient-to-r from-[#F6F0E9] to-[#EBE2D5]" }
                           ]
                        })}
                        className="bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold"
                     >
                        + Initialize Banners
                     </button>
                  )}
               </div>
               
               {section.content.banners && section.content.banners.length > 0 && (
                 <div className="grid gap-6">
                    {section.content.banners.map((banner: any, i: number) => (
                       <div key={i} className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 space-y-3 relative">
                          <button onClick={() => { const nb = [...section.content.banners]; nb.splice(i, 1); onUpdate({ banners: nb }); }} className="absolute -top-3 -right-3 text-red-500 bg-white shadow rounded-full p-2 z-20 hover:scale-110 transition-transform"><Trash2 className="w-4 h-4" /></button>
                          
                          <div className="flex justify-between items-center mb-2">
                             <span className="text-xs font-bold w-full pb-2 border-b border-gray-200 text-gray-600">
                               Banner {i + 1}
                             </span>
                          </div>
                          
                          <input className="w-full bg-white border-none rounded-xl px-4 py-3 text-xs shadow-sm font-bold" value={banner.discountText} onChange={(e) => { const nb = [...section.content.banners]; nb[i].discountText = e.target.value; onUpdate({ banners: nb }); }} placeholder="Discount Text (e.g. 25% Discount)" />
                          <textarea className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-bold shadow-sm" value={banner.title} onChange={(e) => { const nb = [...section.content.banners]; nb[i].title = e.target.value; onUpdate({ banners: nb }); }} rows={2} placeholder="Main Title (Use \n for line break)" />
                          <input className="w-full bg-white border-none rounded-xl px-4 py-3 text-[10px] uppercase font-bold tracking-widest shadow-sm" value={banner.buttonText} onChange={(e) => { const nb = [...section.content.banners]; nb[i].buttonText = e.target.value; onUpdate({ banners: nb }); }} placeholder="Button Text (e.g. Shop Now)" />
                          <input className="w-full bg-white border-none rounded-xl px-4 py-3 text-[10px] font-mono shadow-sm" value={banner.linkUrl} onChange={(e) => { const nb = [...section.content.banners]; nb[i].linkUrl = e.target.value; onUpdate({ banners: nb }); }} placeholder="Link URL" />
                          <input className="w-full bg-white border-none rounded-xl px-4 py-3 text-[10px] font-mono shadow-sm" value={banner.bgColorClass} onChange={(e) => { const nb = [...section.content.banners]; nb[i].bgColorClass = e.target.value; onUpdate({ banners: nb }); }} placeholder="Tailwind BG classes (e.g. bg-gradient-to-r from-[#F6F0E9] ...)" />
                       </div>
                    ))}
                 </div>
               )}
               <button onClick={() => onUpdate({ banners: [...(section.content.banners || []), { discountText: "", title: "", buttonText: "Shop Now", linkUrl: "/", bgColorClass: "bg-gradient-to-r from-[#F6F0E9] to-[#EBE2D5]" }] })} className="w-full bg-gray-100 py-3 rounded-xl text-xs font-bold text-gray-600">+ Add Banner</button>
            </div>
         )}



        {/* LOGO LIST */}
        {t === 'logo-list' && (
           <div className="space-y-6">
              <button onClick={() => onUpdate({ logos: [...(section.content.logos || []), ""] })} className="w-full bg-gray-900 text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-widest">+ Add Logo URL</button>
              <div className="grid grid-cols-4 gap-4">
                  {(section.content.logos || []).map((l: string, i: number) => (
                     <div key={i} className="bg-gray-50 rounded-2xl p-4 border relative group">
                        <button onClick={() => { const nl = [...section.content.logos]; nl.splice(i, 1); onUpdate({ logos: nl }); }} className="absolute -top-2 -right-2 text-red-500 bg-white shadow rounded-full p-1 z-20"><Trash2 className="w-3 h-3" /></button>
                        <ImageUploadField 
                          label={`Logo ${i+1}`} 
                          value={l} 
                          onChange={(val) => { 
                            const nl = [...section.content.logos]; 
                            nl[i] = val; 
                            onUpdate({ logos: nl }); 
                          }} 
                        />
                        {l && <img src={l} className="max-h-12 mx-auto grayscale group-hover:grayscale-0 mt-2" alt="logo" />}
                     </div>
                  ))}
              </div>
           </div>
        )}

        {/* INSTAGRAM FEED */}
        {t === 'instagram' && (
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">IG Handle</label>
                 <input className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold shadow-inner placeholder:text-gray-900" value={section.content.handle} onChange={(e) => onUpdate({ handle: e.target.value })} placeholder="@deekshacandles" />
              </div>
              <div className="flex justify-between border-b pb-4">
                 <label className="text-[10px] font-bold text-gray-400 uppercase">Gallery Images ({section.content.images?.length || 0})</label>
                 <button onClick={() => onUpdate({ images: [...(section.content.images || []), ""] })} className="bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold">+ Add Image</button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                 {(section.content.images || []).map((img: string, i: number) => (
                    <div key={i} className="bg-gray-50 rounded-2xl p-4 border relative group">
                        <button onClick={() => { const ni = [...section.content.images]; ni.splice(i, 1); onUpdate({ images: ni }); }} className="absolute -top-2 -right-2 text-red-500 bg-white shadow rounded-full p-1 z-20"><Trash2 className="w-3 h-3" /></button>
                        <ImageUploadField 
                          label={`Image ${i+1}`} 
                          value={img} 
                          onChange={(val) => { 
                            const ni = [...section.content.images]; 
                            ni[i] = val; 
                            onUpdate({ images: ni }); 
                          }} 
                        />
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* STORE FEATURES / ICONS */}
        {t === 'features' && (
           <div className="space-y-6">
              <div className="flex justify-between border-b pb-4">
                 <label className="text-[10px] font-bold text-gray-400 uppercase">Feature Items ({section.content.items?.length || 0})</label>
                 <button onClick={() => onUpdate({ items: [...(section.content.items || []), { label: "New Feature", icon: "" }] })} className="bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold">+ Add Feature</button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                 {(section.content.items || []).map((item: any, i: number) => (
                    <div key={i} className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 space-y-3">
                       <input className="w-full bg-white rounded-xl px-3 py-2 text-xs font-bold placeholder:text-gray-900" value={item.label} onChange={(e) => { const ni = [...section.content.items]; ni[i].label = e.target.value; onUpdate({ items: ni }); }} placeholder="Feature Label" />
                       <ImageUploadField 
                          label="Icon/Image" 
                          value={item.icon} 
                          onChange={(val) => { 
                            const ni = [...section.content.items]; 
                            ni[i].icon = val; 
                            onUpdate({ items: ni }); 
                          }} 
                        />
                       <button onClick={() => { const ni = [...section.content.items]; ni.splice(i, 1); onUpdate({ items: ni }); }} className="text-red-400 text-[10px] font-bold">Delete</button>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* TESTIMONIALS */}
        {t === 'testimonials' && (
           <div className="space-y-6">
              <div className="flex justify-between border-b pb-4">
                 <label className="text-[10px] font-bold text-gray-400 uppercase">Testimonials ({section.content.reviews?.length || 0})</label>
                 <button onClick={() => onUpdate({ reviews: [...(section.content.reviews || []), { name: "New User", text: "Write review here...", role: "Customer", rating: 5 }] })} className="bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold">+ Add Review</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {(section.content.reviews || []).map((rev: any, i: number) => (
                    <div key={i} className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 space-y-3 relative group">
                       <button onClick={() => { const nr = [...section.content.reviews]; nr.splice(i, 1); onUpdate({ reviews: nr }); }} className="absolute -top-3 -right-3 text-red-500 bg-white shadow rounded-full p-2 z-20 hover:scale-110 transition-transform"><Trash2 className="w-4 h-4" /></button>
                       <input className="w-full bg-white rounded-xl px-4 py-3 text-xs font-bold shadow-sm placeholder:text-gray-900" value={rev.name || ''} onChange={(e) => { const nr = [...section.content.reviews]; nr[i].name = e.target.value; onUpdate({ reviews: nr }); }} placeholder="Reviewer Name" />
                       <input className="w-full bg-white rounded-xl px-4 py-3 text-[10px] shadow-sm placeholder:text-gray-900" value={rev.role || ''} onChange={(e) => { const nr = [...section.content.reviews]; nr[i].role = e.target.value; onUpdate({ reviews: nr }); }} placeholder="Role (e.g. Verified Buyer)" />
                       <textarea className="w-full bg-white rounded-xl px-4 py-3 text-[10px] shadow-sm placeholder:text-gray-900" rows={3} value={rev.text || ''} onChange={(e) => { const nr = [...section.content.reviews]; nr[i].text = e.target.value; onUpdate({ reviews: nr }); }} placeholder="Review Text" />
                       <div className="flex items-center gap-4 py-2">
                          <label className="text-[10px] font-bold text-gray-400">Rating:</label>
                          <select className="bg-white rounded-xl px-3 py-2 text-xs shadow-sm border-none" value={rev.rating || 5} onChange={(e) => { const nr = [...section.content.reviews]; nr[i].rating = parseInt(e.target.value); onUpdate({ reviews: nr }); }}>
                             <option value={5}>5 Stars</option>
                             <option value={4}>4 Stars</option>
                             <option value={3}>3 Stars</option>
                             <option value={2}>2 Stars</option>
                             <option value={1}>1 Star</option>
                          </select>
                       </div>
                       <ImageUploadField 
                          label="Avatar Image (Optional)" 
                          value={rev.avatar || ''} 
                          onChange={(val) => { 
                            const nr = [...section.content.reviews]; 
                            nr[i].avatar = val; 
                            onUpdate({ reviews: nr }); 
                          }} 
                        />
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* COUNTDOWN TIMER */}
        {t === 'countdown' && (
           <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-400 uppercase">Target Date</label>
                 <input type="datetime-local" className="w-full bg-gray-50 rounded-xl px-6 py-4 text-sm shadow-inner placeholder:text-gray-900" value={section.content.date} onChange={(e) => onUpdate({ date: e.target.value })} />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Accent Theme</label>
                 <select className="w-full bg-gray-50 rounded-xl px-6 py-4 text-sm" value={section.content.theme || 'amber'} onChange={(e) => onUpdate({ theme: e.target.value })}>
                    <option value="amber">Warm Amber</option>
                    <option value="gray">Sleek Gray</option>
                    <option value="rose">Love Rose</option>
                 </select>
              </div>
           </div>
        )}

        {/* TEXT EDITOR / CUSTOM LIQUID */}
        {(t === 'text' || t === 'custom-liquid') && (
           <div className="space-y-4">
              <label className="text-[10px] font-bold text-gray-400 uppercase">{t === 'text' ? 'Rich Text content' : 'Custom HTML/Liquid code'}</label>
              <textarea className="w-full bg-gray-50 border-none rounded-[32px] px-8 py-8 text-sm font-mono leading-relaxed shadow-inner placeholder:text-gray-900" rows={12} value={t === 'text' ? section.content.html : section.content.code} onChange={(e) => onUpdate(t === 'text' ? { html: e.target.value } : { code: e.target.value })} />
           </div>
        )}

        {/* FAQ HEADER / COLLAPSIBLE TABS */}
        {(t === 'faq' || t === 'collapsible') && (
           <div className="space-y-6">
              <button onClick={() => onUpdate({ items: [...(section.content.items || []), { question: "New Question", answer: "Write answer here..." }] })} className="w-full bg-gray-100 py-4 rounded-xl text-xs font-bold uppercase tracking-widest">+ Add FAQ Point</button>
              <div className="space-y-4">
                 {(section.content.items || []).map((faq: any, i: number) => (
                    <div key={i} className="bg-gray-50 p-6 rounded-[32px] border relative space-y-3">
                       <button onClick={() => { const ni = [...section.content.items]; ni.splice(i, 1); onUpdate({ items: ni }); }} className="absolute right-4 top-4 text-red-300"><Trash2 className="w-4 h-4" /></button>
                       <input className="w-full bg-white font-bold text-sm px-4 py-2 rounded-xl shadow-sm placeholder:text-gray-900" value={faq.question} onChange={(e) => { const ni = [...section.content.items]; ni[i].question = e.target.value; onUpdate({ items: ni }); }} placeholder="Question" />
                       <textarea className="w-full bg-white text-xs px-4 py-2 rounded-xl shadow-sm placeholder:text-gray-900" value={faq.answer} onChange={(e) => { const ni = [...section.content.items]; ni[i].answer = e.target.value; onUpdate({ items: ni }); }} rows={3} placeholder="Answer" />
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* BLOG POSTS MOCKUP */}
        {t === 'blog-posts' && (
           <div className="p-10 bg-gray-900 rounded-[40px] text-center border border-white/10">
              <Megaphone className="w-12 h-12 text-amber-500 mx-auto mb-6" />
              <h4 className="text-white font-bold text-xl mb-4 italic">Latest From Journal</h4>
              <p className="text-white/40 text-xs mb-8">This block automatically displays the most recent 3 blog posts from your website journal.</p>
              <button className="bg-white/10 text-white rounded-full px-8 py-3 text-[10px] font-bold uppercase tracking-widest border border-white/20">Manage Blog Posts</button>
           </div>
        )}

        {/* MAP */}
        {t === 'map' && (
           <div className="space-y-6">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Embedding URL (Google Maps)</label>
              <input className="w-full bg-gray-50 rounded-xl px-6 py-4 text-sm font-mono shadow-inner placeholder:text-gray-900" value={section.content.url} onChange={(e) => onUpdate({ url: e.target.value })} placeholder="https://google.com/maps/embed?..." />
              <textarea className="w-full bg-gray-50 rounded-xl px-6 py-4 text-sm shadow-inner placeholder:text-gray-900" rows={3} value={section.content.address} onChange={(e) => onUpdate({ address: e.target.value })} placeholder="Physical address for text label..." />
           </div>
        )}

        {/* VIDEOS */}
        {(t === 'video' || t === 'video-bg') && (
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-400 uppercase">Video URL (MP4 / YouTube / Vimeo)</label>
                 <input className="w-full bg-gray-50 rounded-xl px-6 py-4 text-sm font-mono shadow-inner placeholder:text-gray-900" value={section.content.url} onChange={(e) => onUpdate({ url: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Autoplay</label>
                    <select className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm" value={section.content.autoplay ? 'yes' : 'no'} onChange={(e) => onUpdate({ autoplay: e.target.value === 'yes' })}>
                       <option value="yes">Yes</option>
                       <option value="no">No</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Looped</label>
                    <select className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm" value={section.content.loop ? 'yes' : 'no'} onChange={(e) => onUpdate({ loop: e.target.value === 'yes' })}>
                       <option value="yes">Yes</option>
                       <option value="no">No</option>
                    </select>
                 </div>
              </div>
           </div>
        )}
      </div>

      <div className="p-8 border-t border-gray-50 bg-gray-50/20 flex justify-end">
         <button onClick={onClose} className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl shadow-gray-900/10 active:scale-95 transition-all text-xs uppercase tracking-[0.2em]">Confirm & Close Block</button>
      </div>
    </div>
  );
}
