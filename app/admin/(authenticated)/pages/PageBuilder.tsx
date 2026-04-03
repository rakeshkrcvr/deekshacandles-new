"use client";

import { useState } from "react";
import { 
  Plus, Trash2, GripVertical, Image as ImageIcon, Text as TextIcon, 
  LayoutGrid, Info, Settings, Save, ArrowLeft, Eye, CheckCircle2, ChevronDown, ChevronUp,
  Heart, Instagram, Mail, HelpCircle, List, Sparkles, Phone, Timer, MapPin, Columns,
  Layers, Megaphone, Stars, PlayCircle, MessageSquare
} from "lucide-react";
import Link from "next/link";

// DND Kit Imports
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { savePageAction } from "./actions";
import SectionEditor from "./SectionEditor";

interface Section {
  id: string;
  type: string;
  content: any;
  order: number;
  active?: boolean;
}

const CATEGORIES = [
  { id: 'all', label: 'All Blocks', icon: Layers },
  { id: 'banners', label: 'Banners & Hero', icon: ImageIcon },
  { id: 'products', label: 'Product & Shop', icon: LayoutGrid },
  { id: 'content', label: 'Text & Content', icon: TextIcon },
  { id: 'social', label: 'Trust & Social', icon: Heart },
  { id: 'interactive', label: 'Interactions', icon: Megaphone },
];

const BLOCKS = [
  { type: 'hero', label: 'Slideshow', icon: ImageIcon, cat: 'banners', color: 'amber' },
  { type: 'video-bg', label: 'Video Hero', icon: PlayCircle, cat: 'banners', color: 'indigo' },
  { type: 'about', label: 'Brand Story', icon: Info, cat: 'content', color: 'blue' },
  { type: 'image-with-text', label: 'Image w/ Text', icon: Columns, cat: 'content', color: 'sky' },
  { type: 'products', label: 'Featured Grid', icon: LayoutGrid, cat: 'products', color: 'emerald' },
  { type: 'categories', label: 'Collection List', icon: List, cat: 'products', color: 'indigo' },
  { type: 'category-pill', label: 'Collection Pills', icon: List, cat: 'products', color: 'amber' },
  { type: 'text', label: 'Rich Text', icon: TextIcon, cat: 'content', color: 'slate' },
  { type: 'features', label: 'Store Features', icon: Sparkles, cat: 'social', color: 'amber' },
  { type: 'testimonials', label: 'Reviews', icon: Heart, cat: 'social', color: 'rose' },
  { type: 'instagram', label: 'IG Feed', icon: Instagram, cat: 'social', color: 'pink' },
  { type: 'logo-list', label: 'Brands & Logs', icon: Stars, cat: 'social', color: 'gray' },
  { type: 'offer-section', label: 'Offer Grid', icon: LayoutGrid, cat: 'banners', color: 'rose' },
  { type: 'reels-slider', label: 'Reels Slider', icon: PlayCircle, cat: 'social', color: 'pink' },
  { type: 'newsletter', label: 'Newsletter', icon: Mail, cat: 'interactive', color: 'orange' },
  { type: 'contact-form', label: 'Contact Form', icon: Phone, cat: 'interactive', color: 'blue' },
  { type: 'faq', label: 'FAQ Custom', icon: HelpCircle, cat: 'interactive', color: 'cyan' },
  { type: 'countdown', label: 'Timer', icon: Timer, cat: 'interactive', color: 'red' },
  { type: 'blog-posts', label: 'Blog Feed', icon: MessageSquare, cat: 'content', color: 'emerald' },
  { type: 'map', label: 'Location Map', icon: MapPin, cat: 'interactive', color: 'gray' },
  { type: 'discount-banners', label: 'Twin Offers', icon: Megaphone, cat: 'banners', color: 'rose' },
  { type: 'custom-liquid', label: 'Custom Code', icon: Settings, cat: 'content', color: 'slate' },
];

// Sortable Item Component
function SortableSectionItem({ 
  section, 
  isActive, 
  onClick, 
  onRemove,
  moveSection,
  idx
}: { 
  section: Section, 
  isActive: boolean, 
  onClick: () => void,
  onRemove: () => void,
  moveSection: (i: number, d: 'up' | 'down') => void,
  idx: number
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 'auto',
    opacity: isDragging ? 0.3 : 1
  };

  const blockInfo = BLOCKS.find(b => b.type === section.type);
  const Icon = blockInfo?.icon || LayoutGrid;

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      onClick={onClick}
      className={`group flex items-center gap-4 p-4 rounded-3xl border transition-all cursor-pointer relative ${isActive ? 'bg-amber-50 border-amber-200 ring-4 ring-amber-500/5 translate-x-1' : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'}`}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-gray-100 rounded-lg text-gray-300 hover:text-gray-600 transition-colors"
      >
        <GripVertical className="w-5 h-5" />
      </div>

      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isActive ? 'bg-white shadow-sm' : 'bg-gray-50'}`}>
        <Icon className={`w-6 h-6 ${isActive ? 'text-amber-600' : 'text-gray-400'}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-xs font-bold capitalize truncate tracking-tight italic ${isActive ? 'text-amber-900' : 'text-gray-900'}`}>{section.type.replace(/-/g, ' ')}</p>
        <p className="text-[10px] text-gray-400 mt-1 truncate font-bold uppercase tracking-widest">{section.active === false ? 'Hidden' : 'Visible'}</p>
      </div>

      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
         <button onClick={(e) => {e.stopPropagation(); onRemove();}} className="p-1 text-red-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

export default function PageBuilder({ 
  pageId, 
  initialTitle, 
  initialSlug, 
  initialSections = [],
  migratedFromId
}: { 
  pageId?: string; 
  initialTitle?: string; 
  initialSlug?: string; 
  initialSections?: Section[];
  migratedFromId?: string;
}) {
  const [title, setTitle] = useState(initialTitle || "");
  const [slug, setSlug] = useState(initialSlug || "");
  const [sections, setSections] = useState<Section[]>(initialSections.map(s => ({ ...s, active: s.active ?? true })));
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeCat, setActiveCat] = useState('all');
  const [isSaving, setIsSaving] = useState(false);

  // DND Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
       setSections((items) => {
          const oldIndex = items.findIndex((i) => i.id === active.id);
          const newIndex = items.findIndex((i) => i.id === over?.id);
          return arrayMove(items, oldIndex, newIndex).map((s, i) => ({ ...s, order: i }));
       });
    }
  };

  const addSection = (type: string) => {
    const newId = `new-${Date.now()}`;
    const newSection = {
      id: newId,
      type,
      order: sections.length,
      active: true,
      content: getInitialContent(type)
    };
    setSections([...sections, newSection]);
    setActiveSection(newId);
  };

  const getInitialContent = (type: string) => {
    switch (type) {
      case 'hero': return { items: [{ title: "New Drop", subtitle: "Hand-poured luxury", buttonText: "Shop Now", buttonUrl: "/products", image: "" }] };
      case 'video-bg': return { url: "", title: "Cinematic Experience", loop: true, autoplay: true };
      case 'about': return { title: "Our Story", content: "Born from passion...", image: "", layout: 'left' };
      case 'image-with-text': return { title: "Craftsmanship", content: "Every detail matters...", image: "", layout: 'right' };
      case 'text': return { html: "<h2>Title</h2><p>Body copy here...</p>" };
      case 'products': return { title: "Shop Latest", limit: 4 };
      case 'categories': return { title: "Collection List" };
      case 'category-pill': return { title: "Our Collections" };
      case 'features': return { title: "Why Us", items: [{ label: "Safe", icon: "" }] };
      case 'testimonials': return { title: "Reviews", reviews: [{ name: "User", text: "Great!", role: "Buyer" }] };
      case 'instagram': return { title: "Instagram", handle: "@handle", images: ["", ""] };
      case 'logo-list': return { title: "As Seen On", logos: ["", ""] };
      case 'offer-section': return { 
        banners: [
          { title: "Luxury <br /> Soy Candles", subtitle: "Premium Collection", linkUrl: "/products", linkText: "Shop Now »", bgClass: "bg-[#f6efe9]", image: "https://images.unsplash.com/photo-1602874801007-bd458fc1d917?auto=format&fit=crop&q=80&w=1000" },
          { title: "Botanical <br />Scents", subtitle: "10% OFF", linkUrl: "/products?category=scented", linkText: "Shop Now »", bgClass: "bg-[#eaf1ec]", image: "https://images.unsplash.com/photo-1596433809252-260c27459d1a?auto=format&fit=crop&q=80&w=1000" },
          { title: "Aromatherapy <br />Gift Sets", subtitle: "Up to 30% OFF", linkUrl: "/collections", linkText: "Shop Now »", bgClass: "bg-[#f8f9fb]", image: "https://images.unsplash.com/photo-1582211594533-5c8c4a16ed71?auto=format&fit=crop&q=80&w=1000" }
        ]
      };
      case 'discount-banners': return {
        banners: [
          { discountText: "25% Discount", title: "Luxury Scented\nPerfectly", buttonText: "Shop Now", linkUrl: "/collections/luxury", bgColorClass: "bg-gradient-to-r from-[#F6F0E9] to-[#EBE2D5]" },
          { discountText: "30% Discount", title: "Hydrated Soya\nPerfectly", buttonText: "Shop Now", linkUrl: "/collections/soya", bgColorClass: "bg-gradient-to-r from-[#F6F0E9] to-[#EBE2D5]" }
        ]
      };
      case 'reels-slider': return {};
      case 'newsletter': return { title: "Join Us", subtitle: "Stay updated", placeholder: "Email", buttonText: "Join" };
      case 'faq':
      case 'collapsible': return { title: "FAQ", items: [{ question: "Q?", answer: "A!" }] };
      case 'countdown': return { title: "Flash Sale Ends In", date: new Date(Date.now() + 86400000).toISOString().slice(0, 16), theme: 'amber' };
      case 'blog-posts': return { title: "Our Journal" };
      case 'map': return { title: "Store Location", url: "", address: "Visit us at..." };
      case 'contact-form': return { title: "Get in Touch", email: "support@deals.com" };
      case 'custom-liquid': return { code: "<!-- Custom HTML here -->" };
      default: return {};
    }
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
    if (activeSection === id) setActiveSection(null);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    setSections(newSections.map((s, i) => ({ ...s, order: i })));
  };

  const updateSectionContent = (id: string, newContent: any) => {
    setSections(sections.map(s => s.id === id ? { ...s, content: { ...s.content, ...newContent } } : s));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await savePageAction({
        id: pageId,
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sections: sections.map(s => ({ ...s, active: s.active !== false })),
        migratedFromId
      });
      if (migratedFromId) {
        window.location.href = '/admin/pages';
      } else {
        alert("Page builder updated!");
      }
    } catch (e: any) {
      console.error("Save Page Builder Error:", e);
      alert(`Error saving builder: ${e.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredBlocks = activeCat === 'all' ? BLOCKS : BLOCKS.filter(b => b.cat === activeCat);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-[60] px-6 py-4">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/pages" className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-900"><ArrowLeft className="w-5 h-5" /></Link>
            <div>
               <h1 className="text-xl font-bold text-gray-900 tracking-tight italic">Theme Architect</h1>
               <div className="flex items-center gap-2 mt-0.5"><span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-widest border border-amber-100">Drag & Drop Editor</span></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-3 px-8 py-3.5 bg-gray-900 text-white font-bold rounded-2xl shadow-2xl shadow-gray-900/10 hover:bg-black transition-all disabled:opacity-50 text-xs uppercase tracking-widest">
                <Save className="w-4 h-4" /> {isSaving ? "Saving Masterpiece..." : "Save Template"}
             </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex max-w-[1440px] mx-auto w-full p-6 gap-8 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-[400px] flex flex-col gap-6 shrink-0 h-[calc(100vh-140px)] overflow-y-auto no-scrollbar pr-2 pt-2 pb-10">
           {/* Structure List */}
          <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2 italic"><Layers className="w-4 h-4 text-amber-500" /> Page Structure</h3>
              <span className="text-[10px] font-bold bg-gray-900 text-white px-3 py-1 rounded-full">{sections.length} Layers</span>
            </div>
            
            <div className="space-y-3 mb-10">
              {sections.length === 0 && <div className="text-center py-10 text-gray-300 text-xs font-bold italic border-2 border-dashed border-gray-50 rounded-3xl">Empty canvas...</div>}
              
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={sections.map(s => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-3">
                    {sections.map((s, idx) => (
                      <SortableSectionItem 
                        key={s.id} 
                        section={s} 
                        idx={idx}
                        isActive={activeSection === s.id}
                        onClick={() => setActiveSection(s.id)}
                        onRemove={() => removeSection(s.id)}
                        moveSection={moveSection}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            {/* General Settings */}
            <div className="border-t border-gray-50 pt-8 space-y-4">
               <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Internal Name</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold shadow-inner placeholder:text-gray-900" placeholder="E.g. Homepage Template" />
               </div>
               <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Route Path</label>
                  <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-[10px] font-mono shadow-inner placeholder:text-gray-900" placeholder="home" />
               </div>
            </div>
          </div>

          {/* Block Library */}
          <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] italic">Section Library</h3>
               <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
             </div>

             <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
                {CATEGORIES.map(cat => (
                   <button key={cat.id} onClick={() => setActiveCat(cat.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${activeCat === cat.id ? 'bg-amber-600 text-white border-amber-600 shadow-lg shadow-amber-600/20' : 'bg-gray-50 text-gray-400 border-transparent hover:border-gray-200'}`}>
                      <cat.icon className="w-3.5 h-3.5" /> {cat.label}
                   </button>
                ))}
             </div>

             <div className="grid grid-cols-2 gap-4">
                {filteredBlocks.map(block => (
                  <button key={block.type} onClick={() => addSection(block.type)} className="flex flex-col items-center gap-4 p-6 bg-gray-50/50 border border-transparent rounded-[32px] hover:bg-white hover:border-amber-200 hover:shadow-xl hover:shadow-amber-900/5 transition-all group text-center">
                    <div className={`w-14 h-14 rounded-[20px] bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform group-hover:rotate-6`}>
                      <block.icon className={`w-7 h-7 text-${block.color}-600`} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest line-clamp-1">{block.label}</span>
                  </button>
                ))}
             </div>
          </div>
        </aside>

        {/* Live Config Space */}
        <main className="flex-1 flex flex-col pt-2 pb-10">
           {activeSection ? (
             <div className="sticky top-2 h-full">
               <SectionEditor 
                  section={sections.find(s => s.id === activeSection)!} 
                  onUpdate={(content, active) => {
                     if (active !== undefined) setSections(sections.map(s => s.id === activeSection ? { ...s, active } : s));
                     if (content) updateSectionContent(activeSection, content);
                  }} 
                  onClose={() => setActiveSection(null)}
               />
             </div>
           ) : (
             <div className="bg-white rounded-[60px] p-24 text-center border-2 border-dashed border-gray-100 flex flex-col items-center justify-center flex-1 transition-all">
                <div className="w-32 h-32 bg-amber-50 rounded-[48px] flex items-center justify-center mb-10 rotate-12 animate-pulse">
                   <Plus className="w-12 h-12 text-amber-600" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight italic">Drag, Drop & Design</h2>
                <p className="text-gray-400 max-w-sm mx-auto mb-12 text-lg leading-relaxed font-bold italic">Grab the handle on your layers to reorder them, or click to configure their high-end details.</p>
             </div>
           )}
        </main>
      </div>
    </div>
  );
}
