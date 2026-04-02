"use client";

import { useState, useEffect } from "react";
import { Plus, UploadCloud, Loader2, Image as ImageIcon } from "lucide-react";

export default function CategoryForm({ 
  action, 
  initialData, 
  onClear 
}: { 
  action: (formData: FormData) => void, 
  initialData?: any, 
  onClear?: () => void 
}) {
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [icon, setIcon] = useState(initialData?.icon || "");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSlug(initialData.slug);
      setIcon(initialData.icon || "");
    } else {
      setName("");
      setSlug("");
      setIcon("");
    }
  }, [initialData]);

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')     // Replace spaces with -
      .replace(/[^\w-]+/g, '')    // Remove all non-word chars
      .replace(/--+/g, '-');    // Replace multiple - with single -
  };

  useEffect(() => {
    if (!initialData) {
      setSlug(name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-'));
    }
  }, [name, initialData]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setIcon(data.url);
    } catch (err) {
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form action={action} key={initialData?.id || 'new'} className={`bg-white p-8 rounded-[48px] shadow-sm border border-gray-100 flex flex-col gap-8 sticky top-32 transition-all ${initialData ? 'border-amber-200 bg-amber-50/10' : ''}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 tracking-tighter italic uppercase">
          {initialData ? <UploadCloud className="w-6 h-6 text-amber-500" /> : <Plus className="w-6 h-6 text-amber-500" />}
          {initialData ? 'Refine Collection' : 'Catalog New Block'}
        </h2>
        {initialData && (
          <button type="button" onClick={onClear} className="text-[10px] font-bold uppercase text-amber-600 border border-amber-200 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-all tracking-widest">Discard Edit</button>
        )}
      </div>

      {initialData && <input type="hidden" name="id" value={initialData.id} />}
      <div>
        <label className="block text-sm text-gray-700 mb-2 font-medium">Name</label>
        <input 
          required 
          name="name" 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border-gray-200 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none text-sm transition-all" 
          placeholder="Soy Candles" 
        />
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-2 font-medium">Slug (Auto-generated)</label>
        <input 
          required 
          name="slug" 
          type="text" 
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full border-gray-100 bg-gray-50 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none text-sm transition-all font-mono" 
          placeholder="soy-candles" 
        />
        <p className="text-[10px] text-gray-400 mt-2 px-1">Example: <span className="text-gray-600">/your-category-slug</span></p>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2 font-medium font-serif italic">Collection Image (Icon)</label>
        <input type="hidden" name="icon" value={icon} />
        <div className="flex gap-3">
          <div className="flex-1 relative group overflow-hidden rounded-2xl border-2 border-dashed border-gray-100 hover:border-amber-200 transition-all bg-gray-50/50 aspect-video flex flex-col items-center justify-center text-center p-4">
             {icon ? (
               <img src={icon} className="absolute inset-0 w-full h-full object-cover" alt="prev" />
             ) : (
               <>
                 <ImageIcon className="w-8 h-8 text-gray-300 mb-2" />
                 <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No Image Chosen</span>
               </>
             )}
             <input 
               type="file" 
               accept="image/*" 
               onChange={handleUpload} 
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
             />
          </div>
          <button type="button" className={`p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm hover:bg-amber-50 group transition-all self-end ${isUploading ? 'opacity-50' : ''}`}>
             {isUploading ? <Loader2 className="w-5 h-5 animate-spin text-amber-600" /> : <UploadCloud className="w-5 h-5 text-gray-400 group-hover:text-amber-600" />}
          </button>
        </div>
      </div>
      <button 
        type="submit" 
        className="w-full bg-gray-950 hover:bg-black text-white py-4 mt-4 rounded-3xl font-bold uppercase tracking-widest text-[11px] shadow-2xl transition-all active:scale-95 disabled:opacity-50"
        disabled={isUploading}
      >
        {initialData ? 'Update Collection' : 'Save Category'}
      </button>
    </form>
  );
}
