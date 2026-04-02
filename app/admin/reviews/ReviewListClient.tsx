"use client";

import { useState } from "react";
import { Star, Trash2, Edit2, ShoppingBag, User, Search, Filter } from "lucide-react";
import { deleteReviewAction, updateReviewAction } from "./actions";

export default function ReviewListClient({ initialReviews }: { initialReviews: any[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  const filtered = reviews.filter(r => {
    const matchesSearch = r.user?.name?.toLowerCase().includes(search.toLowerCase()) || 
                         r.product?.title?.toLowerCase().includes(search.toLowerCase()) ||
                         r.comment?.toLowerCase().includes(search.toLowerCase());
    const matchesRating = filterRating === 'all' || r.rating === filterRating;
    return matchesSearch && matchesRating;
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ rating: 0, comment: "" });

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    const res = await deleteReviewAction(id);
    if (res.success) {
      setReviews(reviews.filter(r => r.id !== id));
    } else {
      alert("Failed to delete review: " + res.error);
    }
  }

  async function handleUpdate() {
    if (!editingId) return;
    const res = await updateReviewAction(editingId, editData);
    if (res.success) {
      setReviews(reviews.map(r => r.id === editingId ? { ...r, ...editData } : r));
      setEditingId(null);
    } else {
      alert("Failed to update: " + res.error);
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by customer, product, or content..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-transparent rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-gray-900 outline-none focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all placeholder:text-gray-400"
          />
        </div>
        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl">
          <Filter className="w-4 h-4 text-gray-400 ml-2" />
          {[5, 4, 3, 2, 1].map(r => (
            <button
               key={r}
               onClick={() => setFilterRating(filterRating === r ? 'all' : r)}
               className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all transition-transform active:scale-95 ${
                 filterRating === r 
                 ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
                 : 'text-gray-400 hover:bg-white hover:text-amber-500'
               }`}
            >
              {r}★
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Table/Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-100">
             <div className="p-5 bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-gray-300" />
             </div>
             <p className="text-gray-400 font-black text-sm tracking-widest uppercase italic">No reviews found matching your search.</p>
          </div>
        ) : (
          filtered.map((review) => (
          <div key={review.id} className="group flex flex-col md:flex-row items-center gap-3 bg-white p-2 md:p-3 rounded-[15px] border border-gray-100 hover:border-amber-200 transition-all duration-300">
            {/* Product Image (Tiny) */}
            <div className="flex-shrink-0">
               <div className="w-12 h-12 bg-gray-50 rounded-[10px] overflow-hidden border border-gray-100">
                  <img 
                    src={review.product?.imageUrls?.[0] || 'https://via.placeholder.com/150'} 
                    alt={review.product?.title}
                    className="w-full h-full object-cover"
                  />
               </div>
            </div>

            {/* Review Content (Dense) */}
            <div className="flex-1 min-w-0 space-y-1">
               <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-[9px] border border-amber-100 uppercase">
                       {(review.user?.name || "G")[0]}
                     </div>
                     <div className="truncate">
                        <p className="font-black text-gray-900 leading-none text-[10px] truncate">{review.user?.name || "Guest User"}</p>
                        <p className="text-[7px] uppercase font-black text-gray-400 tracking-widest mt-0.5 truncate">{review.product?.title}</p>
                     </div>
                  </div>
                  
                  {editingId === review.id ? (
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <button key={i} onClick={() => setEditData({ ...editData, rating: i })}>
                          <Star className={`w-3 h-3 ${i <= editData.rating ? 'text-amber-500 fill-current' : 'text-gray-100'}`} />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex gap-0.5 shrink-0">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} className={`w-2 h-2 ${i <= review.rating ? 'text-amber-500 fill-current' : 'text-gray-100'}`} />
                      ))}
                    </div>
                  )}
               </div>

               {editingId === review.id ? (
                 <textarea 
                  value={editData.comment}
                  onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                  className="w-full p-2 bg-gray-50 border border-amber-200 rounded-lg font-bold text-gray-900 outline-none focus:bg-white text-[10px]"
                  rows={2}
                 />
               ) : (
                 <div className="bg-gray-50/30 p-2 rounded-[10px]">
                    <p className="text-[10px] font-bold text-gray-600 leading-tight italic truncate max-w-2xl">
                      "{review.comment}"
                    </p>
                 </div>
               )}
            </div>

            {/* Tiny Actions */}
            <div className="flex md:flex-row gap-1.5 shrink-0">
               {editingId === review.id ? (
                 <>
                   <button 
                     onClick={handleUpdate}
                     className="px-2 py-1 bg-emerald-500 text-white rounded-md transition-all active:scale-95 text-[8px] font-black uppercase tracking-widest"
                   >
                     Save
                   </button>
                   <button 
                     onClick={() => setEditingId(null)}
                     className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md transition-all active:scale-95 text-[8px] font-black uppercase tracking-widest"
                   >
                     Cancel
                   </button>
                 </>
               ) : (
                 <>
                   <button 
                     onClick={() => {
                       setEditingId(review.id);
                       setEditData({ rating: review.rating, comment: review.comment });
                     }}
                     className="p-1.5 bg-amber-50 text-amber-500 hover:bg-amber-500 hover:text-white rounded-lg transition-all active:scale-90"
                   >
                     <Edit2 className="w-3 h-3" />
                   </button>
                   <button 
                     onClick={() => handleDelete(review.id)}
                     className="p-1.5 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all active:scale-90"
                   >
                     <Trash2 className="w-3 h-3" />
                   </button>
                 </>
               )}
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
}
