import prisma from "@/lib/prisma";
import { Star, Trash2, Edit2, ShoppingBag, User } from "lucide-react";
import ReviewListClient from "./ReviewListClient";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: {
      user: true,
      product: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="p-8 pb-20 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Review Management</h1>
          <p className="text-gray-500 mt-2 font-medium">Manage and moderate your customer feedback</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
           <div className="px-4 py-2 text-center">
             <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Total Reviews</p>
             <p className="text-xl font-black text-gray-900">{reviews.length}</p>
           </div>
           <div className="w-[1px] h-8 bg-gray-100" />
           <div className="px-4 py-2 text-center">
             <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Avg Rating</p>
             <p className="text-xl font-black text-amber-500">
               {reviews.length > 0 
                ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
                : "0.0"}
             </p>
           </div>
        </div>
      </div>

      {/* Main List */}
      <ReviewListClient initialReviews={reviews} />
    </div>
  );
}
