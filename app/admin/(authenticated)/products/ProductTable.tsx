"use client";

import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import { 
  Plus, Search, Edit3, Trash2, Check, X, Save, Edit, 
  ChevronDown, Filter, Download, MoreHorizontal, AlertTriangle,
  Trash, ArrowUpDown, ExternalLink, Copy
} from "lucide-react";
import { deleteProduct, duplicateProduct } from "@/app/admin/actions";
import { updateProductsBatch, deleteProductsBatch } from "./importActions";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CategoryMultiSelect from "@/components/admin/CategoryMultiSelect";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  discount?: number | null;
  stock: number;
  imageUrls: string[];
  categories: Category[];
}

export default function ProductTable({ 
  initialProducts, 
  categories 
}: { 
  initialProducts: Product[], 
  categories: Category[] 
}) {
  const [isBulkEditing, setIsBulkEditing] = useState(false);
  const [editedProducts, setEditedProducts] = useState<Record<string, { price?: number, stock?: number, categoryIds?: string[] }>>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  
  // Modal states
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null; batch: boolean }>({
    isOpen: false,
    id: null,
    batch: false
  });

  const [isDuplicating, setIsDuplicating] = useState<string | null>(null);
  const router = useRouter();

  // --- Filtering & Utility ---
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [initialProducts, searchQuery]);

  const handleExportCSV = () => {
    const headers = ["Name", "Categories", "Price", "Stock"];
    const rows = filteredProducts.map(p => [
      p.title,
      p.categories?.map((c: Category) => c.name).join("; ") || "Uncategorized",
      p.price.toString(),
      p.stock.toString()
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `inventory_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Bulk Edit Actions ---
  const handleEditChange = (id: string, field: string, value: number | string[]) => {
    setEditedProducts(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: value
      }
    }));
  };

  const handleSaveBulk = async () => {
    const updates = Object.entries(editedProducts).map(([id, data]) => ({
      id,
      ...data
    }));

    if (updates.length > 0) {
      startTransition(async () => {
        const result = await updateProductsBatch(updates);
        if (result.success) {
          setIsBulkEditing(false);
          setEditedProducts({});
          router.refresh();
        } else {
          alert("Failed to update products: " + result.error);
        }
      });
    } else {
      setIsBulkEditing(false);
    }
  };

  // --- Batch Actions ---
  const handleConfirmDelete = async () => {
    if (deleteModal.batch) {
        startTransition(async () => {
          const result = await deleteProductsBatch(selectedIds);
          if (result.success) {
            setSelectedIds([]);
            router.refresh();
          }
        });
    } else if (deleteModal.id) {
        await deleteProduct(deleteModal.id);
        router.refresh();
    }
  };
  const handleDuplicate = async (id: string) => {
    setIsDuplicating(id);
    try {
      await duplicateProduct(id);
      router.refresh();
    } catch (e) {
      alert("Error duplicating product");
    } finally {
      setIsDuplicating(null);
    }
  };

  const handleBatchUpdateCategory = async (categoryId: string | null) => {
    const updates = selectedIds.map(id => ({ 
        id, 
        categoryIds: categoryId ? [categoryId] : [] 
    }));
    startTransition(async () => {
        const result = await updateProductsBatch(updates);
        if (result.success) {
          setSelectedIds([]);
          router.refresh();
        }
    });
  };

  const handleBatchOutOfStock = async () => {
    const updates = selectedIds.map(id => ({ id, stock: 0 }));
    startTransition(async () => {
        const result = await updateProductsBatch(updates);
        if (result.success) {
          setSelectedIds([]);
          router.refresh();
        }
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // --- UI Helpers ---
  const getStockStyle = (stock: number) => {
    if (stock === 0) return "text-red-600 font-bold uppercase tracking-wider text-[10px]";
    if (stock <= 10) return "text-amber-500 font-semibold";
    return "text-emerald-600 font-medium";
  };

  return (
    <div className="space-y-4">
      {/* Table Utility Bar */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          
          <div className="h-6 w-[1px] bg-gray-100 mx-1" />

          {isBulkEditing ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveBulk}
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {isPending ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save Changes
              </button>
              <button
                onClick={() => { setIsBulkEditing(false); setEditedProducts({}); }}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsBulkEditing(true)}
              className="flex items-center gap-2 px-4 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-gray-800 shadow-lg shadow-gray-900/20 transition-all active:scale-95"
            >
              <Edit className="w-3.5 h-3.5" />
              Fast Bulk Edit
            </button>
          )}
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="overflow-x-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-200">
          <table className="w-full text-left text-sm text-gray-600 border-collapse">
            <thead className="bg-gray-50/50 backdrop-blur-md sticky top-0 z-20 border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-500">
              <tr>
                <th className="pl-4 py-3 w-10">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                  />
                </th>
                <th className="px-4 py-3 font-semibold">Product Name</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Stock Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  const currentCategoryIds = editedProducts[p.id]?.categoryIds ?? p.categories?.map((c: Category) => c.id) ?? [];
                  
                  return (
                    <tr key={p.id} className={`hover:bg-slate-50/80 transition-colors group ${isSelected ? 'bg-blue-50/30' : ''}`}>
                      <td className="pl-4 py-3">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => toggleSelectOne(p.id)}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 relative rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                            {p.imageUrls?.[0] ? (
                              <Image src={p.imageUrls[0]} alt={p.title} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <Plus className="w-3.5 h-3.5 rotate-45" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate max-w-[130px] md:max-w-[180px]" title={p.title}>{p.title}</p>
                            <p className="text-[9px] text-gray-400 font-mono mt-0.5">ID: {p.id.slice(-8).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 w-52">
                        {isBulkEditing ? (
                          <CategoryMultiSelect 
                            categories={categories}
                            selectedIds={currentCategoryIds}
                            onChange={(ids) => handleEditChange(p.id, 'categoryIds', ids)}
                          />
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {p.categories && p.categories.length > 0 ? (
                              p.categories.map((c: Category) => (
                                <span key={c.id} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-bold uppercase tracking-tight">
                                  {c.name}
                                </span>
                              ))
                            ) : (
                              <span className="px-1.5 py-0.5 bg-gray-50 text-gray-400 rounded text-[9px] font-bold uppercase italic">
                                None
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isBulkEditing ? (
                          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2 py-1.5 focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all">
                            <span className="text-gray-400 font-medium text-xs">₹</span>
                            <input
                              type="number"
                              defaultValue={p.price}
                              onChange={(e) => handleEditChange(p.id, 'price', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                              className="w-16 outline-none bg-transparent text-xs font-semibold"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col gap-0.5 w-24">
                            {p.discount ? (
                              <>
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-bold text-emerald-600/80 uppercase tracking-widest">Offer</span>
                                  <div className="flex items-center gap-1">
                                    <span className="text-[8px] font-bold bg-emerald-50 text-emerald-600 px-1 py-0.5 rounded border border-emerald-100">{p.discount}% OFF</span>
                                    <span className="font-bold text-emerald-600 text-xs">₹{Math.round(p.price - (p.price * p.discount / 100)).toLocaleString()}</span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">MRP</span>
                                  <span className="text-[10px] text-gray-400 line-through">₹{p.price.toLocaleString()}</span>
                                </div>
                              </>
                            ) : (
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Price</span>
                                <span className="font-bold text-gray-900 text-xs">₹{p.price.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isBulkEditing ? (
                          <input
                            type="number"
                            defaultValue={p.stock}
                            onChange={(e) => handleEditChange(p.id, 'stock', e.target.value === '' ? 0 : parseInt(e.target.value))}
                            className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-xs font-semibold"
                          />
                        ) : (
                          <div className="flex flex-col">
                            <span className={`${getStockStyle(p.stock)} text-xs items-center`}>
                              {p.stock === 0 ? "Out of Stock" : `${p.stock} Units`}
                            </span>
                            {p.stock > 0 && p.stock <= 10 && (
                              <div className="flex items-center gap-1 mt-0.5 text-[9px] text-amber-600 font-medium">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                Reorder Soon
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {!isBulkEditing ? (
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => window.open(`/products/${p.slug}`, '_blank')}
                                title="View Live"
                                className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                            <button 
                                onClick={() => handleDuplicate(p.id)}
                                disabled={isDuplicating === p.id}
                                title="Duplicate Product"
                                className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {isDuplicating === p.id ? <div className="w-3.5 h-3.5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <Link 
                                href={`/admin/products/${p.id}/edit`} 
                                title="Quick Edit Details"
                                className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                                <Edit3 className="w-3.5 h-3.5" />
                            </Link>
                            <button 
                                onClick={() => setDeleteModal({ isOpen: true, id: p.id, batch: false })}
                                title="Delete Product"
                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest animate-pulse">Editing</div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                     <div className="max-w-xs mx-auto space-y-3">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                            <Search className="w-5 h-5 text-gray-300" />
                        </div>
                        <p className="text-gray-900 font-bold">No results found</p>
                        <p className="text-gray-500 text-xs">Try searching for something else or check your spelling.</p>
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Batch Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-gray-900 text-white rounded-[1.5rem] px-6 py-4 shadow-2xl flex items-center gap-8 ring-8 ring-gray-900/10">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-[13px] font-bold">
                {selectedIds.length}
              </span>
              <span className="text-sm font-semibold whitespace-nowrap">items selected</span>
            </div>

            <div className="h-8 w-[1px] bg-white/10" />

            <div className="flex items-center gap-4">
              <button 
                onClick={handleBatchOutOfStock}
                className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                <Filter className="w-4 h-4" />
                Mark OOS
              </button>

              <div className="relative group">
                <button className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  Change Category 
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute bottom-full mb-4 right-0 bg-white text-gray-900 rounded-2xl shadow-2xl py-2 min-w-[200px] border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all translate-y-2 group-hover:translate-y-0">
                  <button 
                    onClick={() => handleBatchUpdateCategory(null)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                  >
                    Uncategorized
                  </button>
                  {categories.map(c => (
                    <button 
                      key={c.id}
                      onClick={() => handleBatchUpdateCategory(c.id)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setDeleteModal({ isOpen: true, id: null, batch: true })}
                className="flex items-center gap-2 text-sm font-semibold text-rose-400 hover:text-rose-300 transition-colors"
              >
                <Trash className="w-4 h-4" />
                Delete
              </button>
            </div>

            <button 
              onClick={() => setSelectedIds([])}
              className="ml-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, batch: false })}
        onConfirm={handleConfirmDelete}
        title={deleteModal.batch ? "Delete Multiple Products" : "Delete Product"}
        message={deleteModal.batch 
            ? `Are you sure you want to delete ${selectedIds.length} products? This action cannot be undone.`
            : "Are you sure you want to move this product to trash?"
        }
      />
    </div>
  );
}
