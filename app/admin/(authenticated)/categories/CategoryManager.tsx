"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import CategoryForm from "./CategoryForm";
import CategoryList from "./CategoryList";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  parentId?: string | null;
  parent?: Category | null;
}

export default function CategoryManager({ 
  initialCategories,
  createAction,
  updateAction,
  deleteAction
}: { 
  initialCategories: Category[],
  createAction: (formData: FormData) => Promise<void>,
  updateAction: (formData: FormData) => Promise<void>,
  deleteAction: (id: string) => Promise<void>
}) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClear = () => {
    setEditingCategory(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Area */}
      <div className="lg:col-span-1">
        <CategoryForm 
          action={editingCategory ? updateAction : createAction} 
          initialData={editingCategory} 
          categories={initialCategories}
          onClear={handleClear}
        />
      </div>

      {/* List Area */}
      <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-gray-800 tracking-tight italic">Inventory Library</h3>
            <span className="text-[10px] bg-white border px-3 py-1 rounded-full font-bold text-gray-400 uppercase tracking-widest shadow-sm">{initialCategories.length} Total</span>
          </div>
          <button 
            onClick={handleClear}
            className="flex items-center gap-2 bg-white border border-gray-100 hover:border-amber-200 text-amber-600 px-4 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm active:scale-95 group"
          >
            <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" /> Add New Block
          </button>
        </div>
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50/50 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-100">
            <tr>
              <th className="px-6 py-5">Preview</th>
              <th className="px-6 py-5">Classification</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <CategoryList 
            initialCategories={initialCategories} 
            deleteAction={deleteAction} 
            onEdit={handleEdit} 
          />
        </table>
      </div>
    </div>
  );
}
