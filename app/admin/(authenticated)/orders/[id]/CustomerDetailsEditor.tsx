"use client";

import { useState } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  MoreVertical, 
  Edit, 
  Check, 
  X, 
  Loader2,
  Trash2
} from "lucide-react";
import { updateOrderCustomerDetails } from "../../../actions";

interface CustomerDetailsEditorProps {
  order: any;
}

export default function CustomerDetailsEditor({ order }: CustomerDetailsEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [formData, setFormData] = useState({
    userName: order.user?.name || "",
    email: order.user?.email || "",
    fullName: order.address?.fullName || "",
    phone: order.address?.phone || "",
    address: order.address?.address || "",
    city: order.address?.city || "",
    state: order.address?.state || "",
    pincode: order.address?.pincode || ""
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateOrderCustomerDetails(order.id, formData);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update customer details");
    } finally {
      setIsLoading(false);
    }
  }

  if (isEditing) {
    return (
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-gray-900 text-sm tracking-tight uppercase tracking-widest text-[#B5B5B5]">Edit Customer</h2>
          <div className="flex gap-2">
             <button 
               onClick={() => setIsEditing(false)}
               className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
             >
               <X className="w-4 h-4" />
             </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account Name</label>
              <input 
                type="text"
                value={formData.userName}
                onChange={(e) => setFormData({...formData, userName: e.target.value})}
                className="px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</label>
              <input 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                required
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-50 space-y-4">
             <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shipping Address</h3>
             
             <div className="flex flex-col gap-1.5">
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name (Delivery)</label>
               <input 
                 type="text"
                 value={formData.fullName}
                 onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                 className="px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                 required
               />
             </div>

             <div className="flex flex-col gap-1.5">
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</label>
               <input 
                 type="text"
                 value={formData.phone}
                 onChange={(e) => setFormData({...formData, phone: e.target.value})}
                 className="px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                 required
               />
             </div>

             <div className="flex flex-col gap-1.5">
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Address</label>
               <textarea 
                 value={formData.address}
                 onChange={(e) => setFormData({...formData, address: e.target.value})}
                 className="px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all min-h-[80px]"
                 required
               />
             </div>

             <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">City</label>
                  <input 
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">State</label>
                  <input 
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pincode</label>
                  <input 
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                    className="px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
             </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 disabled:opacity-50 transition-all active:scale-95"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 space-y-6 relative overflow-visible">
       {/* Menu Popup */}
       {showMenu && (
         <>
           <div className="fixed inset-0 z-50" onClick={() => setShowMenu(false)} />
           <div className="absolute right-6 top-14 w-40 bg-white rounded-2xl shadow-xl border border-gray-50 p-1.5 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
             <button 
               onClick={() => {
                 setIsEditing(true);
                 setShowMenu(false);
               }}
               className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
             >
               <Edit className="w-3.5 h-3.5" />
               Edit Details
             </button>
             <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
               <Trash2 className="w-3.5 h-3.5" />
               Remove User
             </button>
           </div>
         </>
       )}

       <div className="flex justify-between items-center">
          <h2 className="font-bold text-gray-900 text-base tracking-tight">Customer</h2>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
       </div>
       
       <div className="space-y-1">
          <p className="text-[#6366F1] font-bold text-lg hover:underline cursor-pointer">{order.user?.name || 'Guest User'}</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{order.user?.orders?.length || 1} ORDER</p>
       </div>

       <div className="space-y-4 pt-2">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 flex-shrink-0 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-50">
               <Mail className="w-4 h-4 text-gray-400" />
             </div>
             <div className="min-w-0">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Email</p>
                <p className="text-sm font-bold text-gray-700 truncate">{order.user?.email || 'N/A'}</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 flex-shrink-0 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-50">
               <Phone className="w-4 h-4 text-gray-400" />
             </div>
             <div className="min-w-0">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Phone</p>
                <p className="text-sm font-bold text-gray-700">{order.address?.phone || 'N/A'}</p>
             </div>
          </div>
       </div>

       <div className="pt-6 border-t border-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-bold text-[#B5B5B5] uppercase tracking-widest flex items-center gap-2">
              Shipping Address
            </h3>
            <MapPin className="w-4 h-4 text-gray-200" />
          </div>
          <div className="text-sm font-medium text-gray-600 space-y-2 leading-relaxed">
            <p className="font-bold text-gray-900 text-base">{order.address?.fullName || 'N/A'}</p>
            <p className="text-[#6B7280]">{order.address?.address || 'N/A'}</p>
            <p className="text-[#6B7280]">{order.address?.city}, {order.address?.state} {order.address?.pincode}</p>
            <p className="text-[#6B7280]">India</p>
            <p className="mt-3 text-gray-400 font-bold tracking-tight">{order.address?.phone || 'N/A'}</p>
          </div>
       </div>
    </div>
  );
}
