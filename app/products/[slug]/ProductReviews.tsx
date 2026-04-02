"use client";

import { useState } from "react";
import { Star, User, ChevronDown } from "lucide-react";
import { submitReviewAction } from "./actions";

export default function ProductReviews({ productId, reviews = [] }: { productId: string, reviews: any[] }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Real Summary & Distribution Logic
  const hasReviews = reviews.length > 0;
  const totalReviews = reviews.length;
  const avgRating = hasReviews 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : "0.0";

  // Calculate real distribution
  const counts = [0, 0, 0, 0, 0]; // 1 to 5 stars
  reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) counts[r.rating - 1]++;
  });

  const distribution = [
    { label: "FIVE", value: counts[4], percent: totalReviews > 0 ? (counts[4] / totalReviews) * 100 : 0 },
    { label: "FOUR", value: counts[3], percent: totalReviews > 0 ? (counts[3] / totalReviews) * 100 : 0 },
    { label: "THREE", value: counts[2], percent: totalReviews > 0 ? (counts[2] / totalReviews) * 100 : 0 },
    { label: "TWO", value: counts[1], percent: totalReviews > 0 ? (counts[1] / totalReviews) * 100 : 0 },
    { label: "ONE", value: counts[0], percent: totalReviews > 0 ? (counts[0] / totalReviews) * 100 : 0 },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (rating === 0) return setMessage({ type: 'error', text: 'Please select a rating' });
    
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append("productId", productId);
    formData.append("rating", rating.toString());

    const res = await submitReviewAction(formData);
    if (res.success) {
      setMessage({ type: 'success', text: 'Review submitted successfully!' });
      (e.target as any).reset();
      setRating(0);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to submit review' });
    }
    setIsSubmitting(false);
  }

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 bg-white">
      {/* Top Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
        {/* Rating Bars */}
        <div className="space-y-4">
          {distribution.map((item) => (
            <div key={item.label} className="flex items-center gap-4 group">
              <span className="w-12 text-[10px] font-black text-gray-400 tracking-widest">{item.label}</span>
              <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
              <div className="flex-1 h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-1000 ease-out shadow-sm" 
                  style={{ width: `${item.percent}%` }}
                />
              </div>
              <span className="w-10 text-right text-[11px] font-bold text-gray-500">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Global Score Card */}
        <div className="bg-amber-50/30 border border-amber-100/50 rounded-[40px] p-12 text-center flex flex-col items-center justify-center animate-in zoom-in duration-700">
           <div className="text-6xl font-black text-amber-600 mb-6 tracking-tighter">
             {avgRating}
           </div>
           <div className="flex gap-2 mb-4">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-8 h-8 ${i <= Math.floor(Number(avgRating)) ? 'text-amber-500 fill-current' : 'text-gray-200'}`} />
              ))}
           </div>
           <div className="text-gray-500 font-bold text-sm tracking-wide uppercase">
             {totalReviews} Ratings
           </div>
        </div>
      </div>

      {/* Main Review Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Recent Feedbacks List */}
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Recent Feedbacks</h2>
          <div className="space-y-6">
            {!hasReviews ? (
              <div className="py-20 text-center bg-gray-50/50 rounded-[40px] border border-dashed border-gray-100 flex flex-col items-center">
                 <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                   <Star className="w-8 h-8 text-gray-200" />
                 </div>
                 <p className="text-gray-400 font-bold text-sm tracking-wide uppercase">No reviews yet. Be the first to INDULGE!</p>
              </div>
            ) : (
              reviews.map((review, idx) => (
                <div key={review.id || idx} className="flex gap-5 p-6 bg-white border border-gray-100 rounded-[30px] hover:border-amber-200 hover:shadow-xl hover:shadow-gray-100/50 transition-all group animate-in slide-in-from-left-4 duration-500">
                  <div className="w-16 h-16 rounded-full bg-gray-50 overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                     <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center text-amber-600 font-bold text-xl uppercase">
                       {(review.user?.name || "R")[0]}
                     </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-900 text-lg">{review.user?.name || "Robert Karmazov"}</h4>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i <= review.rating ? 'text-amber-500 fill-current' : 'text-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed font-medium">
                      {review.comment}
                    </p>
                    <div className="mt-3 text-[10px] text-gray-300 font-black tracking-widest uppercase">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : "Recently"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add a Review Form */}
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Add a Review</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Rating Stars Input */}
            <div>
              <p className="block text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] mb-4">Add Your Rating<span className="text-red-500 ml-1 mt-1">*</span></p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="p-1 transition-all hover:scale-125 focus:outline-none"
                    onMouseEnter={() => setHover(s)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(s)}
                  >
                    <Star 
                      className={`w-8 h-8 transition-colors ${
                        s <= (hover || rating) ? "text-amber-500 fill-current" : "text-gray-200"
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] mb-2 px-1">Name<span className="text-red-500 ml-1 mt-1">*</span></label>
                <input required name="name" type="text" placeholder="John Doe" className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all placeholder:text-gray-300" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] mb-2 px-1">Email <span className="text-red-500 ml-1 mt-1">*</span></label>
                <input required name="email" type="email" placeholder="john@example.com" className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all placeholder:text-gray-300" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] mb-2 px-1">Write Your Review <span className="text-red-500 ml-1 mt-1">*</span></label>
              <textarea 
                required 
                name="comment" 
                rows={5} 
                className="w-full bg-white border border-gray-100 rounded-[30px] px-6 py-4 text-sm font-bold text-gray-900 outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all placeholder:text-gray-300 leading-relaxed" 
                placeholder="Indulge in your feedback..."
              ></textarea>
            </div>

            {message && (
              <p className={`text-sm font-bold ${message.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>{message.text}</p>
            )}

            <button 
              disabled={isSubmitting}
              className="w-full bg-amber-500 text-white font-black py-5 rounded-[25px] hover:bg-amber-600 shadow-xl shadow-amber-500/20 active:scale-95 transition-all text-xs uppercase tracking-widest disabled:opacity-50 disabled:grayscale"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
