"use client";

import { Trash2, Edit2 } from "lucide-react";
import { useState } from "react";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
}

export default function CategoryList({ 
  initialCategories, 
  deleteAction,
  onEdit
}: { 
  initialCategories: Category[], 
  deleteAction: (id: string) => void,
  onEdit: (category: Category) => void
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteAction(id);
      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      alert("Failed to delete category.");
    }
  };

  const openDeleteModal = (id: string) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  return (
    <>
      <tbody className="divide-y divide-gray-100">
        {initialCategories.length > 0 ? (
          initialCategories.map(c => (
            <tr key={c.id} className="hover:bg-gray-50/50 transition-colors group">
              <td className="px-6 py-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                  {c.icon ? (
                    <img src={c.icon} className="w-full h-full object-cover" alt={c.name} />
                  ) : (
                    <div className="text-[10px] text-gray-300 font-bold uppercase tracking-tighter">No Icon</div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 font-medium text-gray-900">
                <div className="flex flex-col">
                  <span className="font-bold">{c.name}</span>
                  <span className="text-xs text-blue-500 font-mono mt-0.5">/{c.slug}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => onEdit(c)}
                    className="p-3 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-2xl transition-all shadow-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => openDeleteModal(c.id)}
                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3} className="px-6 py-12 text-center">
              <p className="text-gray-900 font-bold italic mb-1">No categories found</p>
              <p className="text-gray-500 text-xs">Create your first category using the form on the left.</p>
            </td>
          </tr>
        )}
      </tbody>

      <DeleteConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => selectedId ? handleDelete(selectedId) : Promise.resolve()}
        title="Delete Category"
        message="Are you sure you want to delete this category? Any products assigned to it will become 'Uncategorized'."
      />
    </>
  );
}
