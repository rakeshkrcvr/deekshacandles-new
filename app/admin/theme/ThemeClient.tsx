"use client";

import { useState } from "react";
import { saveThemeSettings } from "./actions";
import { Plus, Trash2, Save, Loader2, Link as LinkIcon, Phone, Mail, Megaphone, GripVertical } from "lucide-react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableLinkItem({ id, item, idx, sectionKey, updateLink, removeLink, updateSubmenuLink, addSubmenuLink, removeSubmenuLink, availablePages, availableCategories }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleQuickAdd = (value: string, isSubmenu: boolean, subIdx?: number) => {
    const [type, slug, name] = value.split('|');
    const url = type === 'page' ? `/pages/${slug}` : type === 'category' ? `/category/${slug}` : slug;
    if (isSubmenu && subIdx !== undefined) {
      updateSubmenuLink(idx, subIdx, 'label', name);
      updateSubmenuLink(idx, subIdx, 'url', url);
    } else {
      updateLink(sectionKey, idx, 'label', name);
      updateLink(sectionKey, idx, 'url', url);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-gray-100 p-3 rounded-xl group hover:shadow-sm relative z-[1]">
      <div className="flex gap-3 items-center">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-amber-500 transition-colors">
          <GripVertical className="w-5 h-5" />
        </div>
        <select 
          onChange={(e) => { handleQuickAdd(e.target.value, false); e.target.value = ""; }}
          className="border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-amber-500 outline-none w-32 cursor-pointer text-gray-600"
        >
          <option value="">Quick Add</option>
          <optgroup label="Categories">
            {availableCategories?.map((c: any) => <option key={`cat-${c.slug}`} value={`category|${c.slug}|${c.name}`}>{c.name}</option>)}
          </optgroup>
          <optgroup label="Pages">
            {availablePages?.map((p: any) => <option key={`page-${p.slug}`} value={`page|${p.slug}|${p.title}`}>{p.title}</option>)}
          </optgroup>
          <optgroup label="Partnerships">
            <option value="special|/affiliate/apply|Create Affiliate account">Create Affiliate account</option>
          </optgroup>
        </select>
        <input 
          type="text" 
          value={item.label} 
          onChange={e => updateLink(sectionKey, idx, "label", e.target.value)}
          className="flex-[0.8] w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:ring-2 focus:ring-amber-500 outline-none"
          placeholder="Label (e.g. Terms)"
        />
        <input 
          type="text" 
          value={item.url} 
          onChange={e => updateLink(sectionKey, idx, "url", e.target.value)}
          className="flex-1 w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:ring-2 focus:ring-amber-500 outline-none"
          placeholder="URL (e.g. /pages/terms)"
        />
        <button 
          onClick={() => removeLink(sectionKey, idx)}
          className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 flex-shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {sectionKey === "navbar" && (
        <div className="mt-3 pl-10 space-y-2">
          {item.submenu?.map((sub: any, subIdx: number) => (
            <div key={sub.id} className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
              <select 
                onChange={(e) => { handleQuickAdd(e.target.value, true, subIdx); e.target.value = ""; }}
                className="border border-gray-200 rounded-md p-2 text-xs bg-white focus:ring-2 focus:ring-amber-500 outline-none w-24 cursor-pointer text-gray-600"
              >
                <option value="">Pick...</option>
                <optgroup label="Categories">
                  {availableCategories?.map((c: any) => <option key={`subcat-${c.slug}`} value={`category|${c.slug}|${c.name}`}>{c.name}</option>)}
                </optgroup>
                <optgroup label="Pages">
                  {availablePages?.map((p: any) => <option key={`subpage-${p.slug}`} value={`page|${p.slug}|${p.title}`}>{p.title}</option>)}
                </optgroup>
                <optgroup label="Partnerships">
                  <option value="special|/affiliate/apply|Create Affiliate account">Create Affiliate account</option>
                </optgroup>
              </select>
              <input 
                type="text" 
                value={sub.label} 
                onChange={e => updateSubmenuLink(idx, subIdx, "label", e.target.value)}
                className="flex-[0.5] w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 placeholder:text-gray-400 bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="Submenu Label"
              />
              <input 
                type="text" 
                value={sub.url} 
                onChange={e => updateSubmenuLink(idx, subIdx, "url", e.target.value)}
                className="flex-[0.8] w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 placeholder:text-gray-400 bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="Submenu URL"
              />
              <button 
                onClick={() => removeSubmenuLink(idx, subIdx)}
                className="p-2 text-red-500 hover:bg-red-100 rounded-md transition-colors flex-shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button 
            onClick={() => addSubmenuLink(idx)}
            className="text-xs font-semibold text-amber-600 hover:text-amber-700 mt-2 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Submenu Link
          </button>
        </div>
      )}
    </div>
  );
}

export default function ThemeClient({ initialData, availablePages, availableCategories }: any) {
  const [data, setData] = useState<any>(initialData || {
    navbar: [],
    footer: { shop: [], company: [], legal: [] },
    contact: { phone: "", email: "", announcement: "" }
  });
  const [loading, setLoading] = useState(false);

  const updateSubmenuLink = (index: number, subIndex: number, field: string, value: string) => {
    const copy = { ...data };
    copy.navbar[index].submenu[subIndex][field] = value;
    setData(copy);
  };

  const addSubmenuLink = (index: number) => {
    const copy = { ...data };
    if (!copy.navbar[index].submenu) copy.navbar[index].submenu = [];
    copy.navbar[index].submenu.push({ id: Date.now().toString() + Math.random(), label: "New Submenu", url: "/" });
    setData(copy);
  };

  const removeSubmenuLink = (index: number, subIndex: number) => {
    const copy = { ...data };
    copy.navbar[index].submenu.splice(subIndex, 1);
    setData(copy);
  };

  const handleSave = async () => {
    setLoading(true);
    const res = await saveThemeSettings(data);
    setLoading(false);
    if (!res?.success) alert("Failed: " + res?.error);
    else alert("Navigation menus and footer successfully published to storefront!");
  };

  const updateLink = (section: string, index: number, field: string, value: string) => {
    const copy = { ...data };
    if (section === "navbar") copy.navbar[index][field] = value;
    else copy.footer[section][index][field] = value;
    setData(copy);
  };

  const addLink = (section: string) => {
    const copy = { ...data };
    const newLink = { id: Date.now().toString() + Math.random(), label: "New Link", url: "/" };
    if (section === "navbar") copy.navbar.push(newLink);
    else copy.footer[section].push(newLink);
    setData(copy);
  };

  const removeLink = (section: string, index: number) => {
    const copy = { ...data };
    if (section === "navbar") copy.navbar.splice(index, 1);
    else copy.footer[section].splice(index, 1);
    setData(copy);
  };

  const handleDragEnd = (sectionKey: string, event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
       setData((prev: any) => {
          const arr = sectionKey === "navbar" ? prev.navbar : prev.footer[sectionKey];
          const oldIndex = arr.findIndex((item: any) => item.id === active.id);
          const newIndex = arr.findIndex((item: any) => item.id === over.id);
          
          const newArr = arrayMove(arr, oldIndex, newIndex);
          const copy = { ...prev };
          if (sectionKey === "navbar") {
            copy.navbar = newArr;
          } else {
            copy.footer = { ...copy.footer, [sectionKey]: newArr };
          }
          return copy;
       });
    }
  };

  const updateContact = (field: string, value: string) => {
    setData({ ...data, contact: { ...data.contact, [field]: value } });
  };

  const renderSection = (title: string, sectionKey: string) => {
    const arr = sectionKey === "navbar" ? data.navbar : data.footer[sectionKey];
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-gray-400" /> {title}
        </h3>
        <DndContext collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(sectionKey, e)}>
          <SortableContext items={arr.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {arr?.map((item: any, idx: number) => (
                <SortableLinkItem
                  key={item.id}
                  id={item.id}
                  item={item}
                  idx={idx}
                  sectionKey={sectionKey}
                  updateLink={updateLink}
                  removeLink={removeLink}
                  updateSubmenuLink={updateSubmenuLink}
                  addSubmenuLink={addSubmenuLink}
                  removeSubmenuLink={removeSubmenuLink}
                  availablePages={availablePages}
                  availableCategories={availableCategories}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <button 
          onClick={() => addLink(sectionKey)}
          className="mt-4 flex items-center gap-2 text-sm font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-lg transition-colors border border-amber-100/50"
        >
          <Plus className="w-4 h-4" /> Add Link
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6 relative pb-20 w-full max-w-5xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Contact & Header Bar</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Phone className="w-3 h-3"/> Phone number</label>
              <input type="text" value={data.contact?.phone || ""} onChange={e => updateContact("phone", e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 placeholder:text-gray-400 bg-white outline-none focus:ring-2 focus:ring-amber-500" placeholder="+91-9971459984" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Mail className="w-3 h-3"/> Support Email</label>
              <input type="text" value={data.contact?.email || ""} onChange={e => updateContact("email", e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 placeholder:text-gray-400 bg-white outline-none focus:ring-2 focus:ring-amber-500" placeholder="support@deekshacandles.com" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Megaphone className="w-3 h-3"/> Top Announcement Bar</label>
              <input type="text" value={data.contact?.announcement || ""} onChange={e => updateContact("announcement", e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-900 placeholder:text-gray-400 bg-white outline-none focus:ring-2 focus:ring-amber-500" placeholder="Free shipping on orders over ₹999!" />
            </div>
          </div>
        </div>
        
        {renderSection("Main Header Links", "navbar")}
        {renderSection("Footer - Shop Links", "shop")}
        {renderSection("Footer - Company Links", "company")}
        {renderSection("Footer - Legal Links", "legal")}
      </div>

      <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white/80 backdrop-blur-md px-8 py-5 border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex justify-end z-20">
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Settings
        </button>
      </div>
    </div>
  );
}
