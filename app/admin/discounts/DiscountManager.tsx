"use client";

import { useState } from "react";
import { Trash2, Edit2, XCircle, Tag, Zap, TrendingDown, RefreshCcw, Landmark, Users, Info } from "lucide-react";

const DISCOUNT_TYPES = [
  { id: "PERCENTAGE", label: "Percentage % Off", icon: TrendingDown, desc: "Flat %, Tiered, Upto %" },
  { id: "FIXED_AMOUNT", label: "Fixed Amount ₹", icon: Tag, desc: "Flat ₹ Off, Min Purchase" },
  { id: "BOGO", label: "Quantity / BOGO", icon: RefreshCcw, desc: "Buy 1 Get 1, Bundle, Buy 2 Get 1" },
  { id: "FREE_SHIPPING", label: "Shipping", icon: Zap, desc: "Free Delivery on orders, First order" },
  { id: "BANK_OFFER", label: "Bank / Wallet Offer", icon: Landmark, desc: "HDFC 10%, Paytm Cashback" }
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DiscountManager({ initialDiscounts }: { initialDiscounts: any[] }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [discounts, setDiscounts] = useState<any[]>(initialDiscounts || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon ${code}?`)) return;
    try {
      await fetch(`/api/admin/discounts?id=${id}`, { method: 'DELETE' });
      setDiscounts(discounts.filter(d => d.id !== id));
    } catch (e) {
      alert("Error deleting discount");
    }
  };

  const handleToggleActive = async (id: string, currentState: boolean) => {
    try {
      const res = await fetch(`/api/admin/discounts`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !currentState })
      });
      if (res.ok) {
        setDiscounts(discounts.map(d => d.id === id ? { ...d, active: !currentState } : d));
      }
    } catch (e) {
      alert("Failed to toggle status");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const url = formData.id ? `/api/admin/discounts` : `/api/admin/discounts`;
      const method = formData.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Unknown error occurred");
      }

      const saved = await res.json();
      
      if (formData.id) {
        setDiscounts(discounts.map(d => d.id === formData.id ? saved : d));
      } else {
        setDiscounts([saved, ...discounts]);
      }
      setIsModalOpen(false);
      setFormData({});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openNew = () => {
    setFormData({ discountType: "PERCENTAGE", active: true });
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold font-serif text-gray-900">Active Campaign Rules</h2>
        <button onClick={openNew} className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-xl shadow-amber-600/20 active:scale-95 transition-all">
          + Launch New Discount
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase tracking-widest text-gray-400">
              <th className="pb-4 font-bold">Code</th>
              <th className="pb-4 font-bold">Type</th>
              <th className="pb-4 font-bold">Offer Info</th>
              <th className="pb-4 font-bold">Status</th>
              <th className="pb-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
             {discounts.length === 0 ? (
               <tr><td colSpan={5} className="py-12 text-center text-gray-400 italic font-medium">No active discounts found. Create one to boost sales!</td></tr>
             ) : discounts.map(d => (
               <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4">
                     <span className="bg-gray-100 text-gray-900 font-bold px-3 py-1.5 rounded-lg text-sm tracking-widest uppercase border border-gray-200 border-dashed">
                        {d.code}
                     </span>
                  </td>
                  <td className="py-4 text-sm font-medium text-gray-600">
                     <div className="flex items-center gap-2">
                       {DISCOUNT_TYPES.find(t => t.id === d.discountType)?.label || d.discountType}
                     </div>
                  </td>
                  <td className="py-4 text-sm">
                     <p className="font-bold text-gray-900">{d.description || (d.discountType === 'PERCENTAGE' ? `${d.discountValue}% OFF` : `₹${d.discountValue} OFF`)}</p>
                     {(d.minPurchase || d.maxDiscount) && (
                       <p className="text-xs text-gray-500 mt-1">
                         {d.minPurchase ? `Min ₹${d.minPurchase} ` : ''} 
                         {d.maxDiscount ? `(Max ₹${d.maxDiscount})` : ''}
                       </p>
                     )}
                     {(d.discountType === 'BOGO') && <p className="text-xs text-emerald-600 mt-1 font-medium bg-emerald-50 px-2 py-0.5 rounded-md inline-block">Buy {d.buyQuantity} Get {d.getQuantity}</p>}
                  </td>
                  <td className="py-4">
                     <button onClick={() => handleToggleActive(d.id, d.active)} className={`w-12 h-6 rounded-full relative transition-colors ${d.active ? 'bg-amber-500' : 'bg-gray-200'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${d.active ? 'left-7' : 'left-1'}`} />
                     </button>
                  </td>
                  <td className="py-4 flex items-center justify-end gap-3 opacity-30 hover:opacity-100 transition-opacity">
                     <button onClick={() => { setFormData(d); setIsModalOpen(true); }} className="text-gray-500 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                     <button onClick={() => handleDelete(d.id, d.code)} className="text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar p-8 shadow-2xl relative animate-in slide-in-from-bottom-8 duration-500">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full text-gray-500 hover:text-gray-900 transition-colors">
              <XCircle className="w-6 h-6" />
            </button>
            
            <div className="mb-8">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Promotion Builder</span>
              <h3 className="text-3xl font-serif text-gray-900">{formData.id ? 'Edit Coupon Engine' : 'Setup Discount Engine'}</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Type Selection */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {DISCOUNT_TYPES.map(type => {
                  const Icon = type.icon;
                  return (
                    <div 
                      key={type.id} 
                      onClick={() => setFormData({...formData, discountType: type.id})}
                      className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col gap-3 transition-all ${formData.discountType === type.id ? 'border-amber-500 bg-amber-50/50 shadow-md transform -translate-y-1' : 'border-gray-100 bg-white hover:border-amber-200'}`}
                    >
                      <Icon className={`w-6 h-6 ${formData.discountType === type.id ? 'text-amber-600' : 'text-gray-400'}`} />
                      <div>
                        <h4 className={`text-sm font-bold leading-tight ${formData.discountType === type.id ? 'text-amber-900' : 'text-gray-900'}`}>{type.label}</h4>
                        <p className="text-[10px] text-gray-500 mt-1">{type.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl space-y-6">
                 {/* Basic Info */}
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Coupon / Offer Code</label>
                       <input required type="text" value={formData.code || ''} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-bold uppercase shadow-sm placeholder:font-normal placeholder:lowercase placeholder:text-gray-400" placeholder="e.g. WELCOME10" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Short Display Tag/Description</label>
                       <input type="text" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm shadow-sm" placeholder="e.g. Flat 20% Off" />
                    </div>
                 </div>

                 {/* Dynamic value inputs based on type */}
                 {(formData.discountType === 'PERCENTAGE' || formData.discountType === 'FIXED_AMOUNT' || formData.discountType === 'BANK_OFFER' || formData.discountType === 'BEHAVIORAL') && (
                    <div className="space-y-2 border-t border-gray-100 pt-6">
                      <label className="text-[10px] font-bold text-amber-600 tracking-widest uppercase">{formData.discountType === 'PERCENTAGE' ? 'Discount Percentage (%)' : 'Discount Value (₹)'}</label>
                      <input required type="number" step="0.01" value={formData.discountValue || ''} onChange={(e) => setFormData({...formData, discountValue: e.target.value})} className="w-full bg-white border-none rounded-xl px-4 py-3 text-lg font-bold text-gray-900 shadow-sm" placeholder="0" />
                    </div>
                 )}

                 {formData.discountType === 'BOGO' && (
                    <div className="grid grid-cols-2 gap-6 border-t border-gray-100 pt-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-amber-600 tracking-widest uppercase">BUY Quantity</label>
                        <input required type="number" value={formData.buyQuantity || ''} onChange={(e) => setFormData({...formData, buyQuantity: e.target.value})} className="w-full bg-white border-none rounded-xl px-4 py-3 font-bold shadow-sm" placeholder="e.g. 2" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-emerald-600 tracking-widest uppercase">GET Quantity (Free)</label>
                        <input required type="number" value={formData.getQuantity || ''} onChange={(e) => setFormData({...formData, getQuantity: e.target.value})} className="w-full bg-white border-none rounded-xl px-4 py-3 font-bold shadow-sm" placeholder="e.g. 1" />
                      </div>
                    </div>
                 )}

                 {formData.discountType === 'BANK_OFFER' && (
                    <div className="space-y-2 border-t border-gray-100 pt-6">
                      <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Bank / Wallet Name</label>
                      <input required type="text" value={formData.bankName || ''} onChange={(e) => setFormData({...formData, bankName: e.target.value})} className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm shadow-sm" placeholder="e.g. HDFC, ICICI, Paytm" />
                    </div>
                 )}

                 {formData.discountType === 'BEHAVIORAL' && (
                    <div className="space-y-2 border-t border-gray-100 pt-6">
                      <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Target Group</label>
                      <select required value={formData.targetCustomer || 'ALL'} onChange={(e) => setFormData({...formData, targetCustomer: e.target.value})} className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm shadow-sm">
                        <option value="ALL">Everyone / General List</option>
                        <option value="NEW_USER">First Purchase Only</option>
                        <option value="ABANDONED_CART">Abandoned Checkout Savers</option>
                        <option value="REFERRAL">Referral Network</option>
                      </select>
                    </div>
                 )}

                 {/* Advanced Conditionals */}
                 <div className="grid md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase block flex items-center gap-1"><Info className="w-3 h-3"/> Minimum Order Value (₹)</label>
                       <input type="number" value={formData.minPurchase || ''} onChange={(e) => setFormData({...formData, minPurchase: e.target.value})} className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm shadow-sm" placeholder="e.g. 1500" />
                       <span className="text-[10px] text-gray-400 block mt-1">Leave empty if none</span>
                    </div>
                    {formData.discountType === 'PERCENTAGE' && (
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase block flex items-center gap-1"><Info className="w-3 h-3"/> Maximum Discount Cap (₹)</label>
                         <input type="number" value={formData.maxDiscount || ''} onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})} className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm shadow-sm" placeholder="e.g. 500" />
                         <span className="text-[10px] text-gray-400 block mt-1">For &quot;Upto X&quot; logic</span>
                      </div>
                    )}
                 </div>

                 {/* Expiry & Limits */}
                 <div className="grid md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase block">Usage Limit (per account/total)</label>
                       <input type="number" value={formData.usageLimit || ''} onChange={(e) => setFormData({...formData, usageLimit: e.target.value})} className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm shadow-sm" placeholder="e.g. 100" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase block">Expiry Date</label>
                       <input type="date" value={formData.expiresAt ? new Date(formData.expiresAt).toISOString().split('T')[0] : ''} onChange={(e) => setFormData({...formData, expiresAt: e.target.value})} className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm shadow-sm text-gray-600" />
                    </div>
                 </div>
              </div>

              <div className="flex justify-end pt-4">
                <button disabled={isSubmitting} type="submit" className="bg-gray-900 text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-xs shadow-2xl active:scale-95 transition-all w-full md:w-auto disabled:opacity-50">
                   {isSubmitting ? "Deploying Engine..." : (formData.id ? 'Save Updates' : 'Launch Discount Engine')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
