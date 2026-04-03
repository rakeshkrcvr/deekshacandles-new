import prisma from "@/lib/prisma";
import { 
  Package, 
  CheckCircle, 
  Clock, 
  Trash2, 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare,
  Printer,
  Edit,
  History,
  CornerUpLeft,
  ChevronUp,
  MoreVertical
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateOrderStatus } from "../../../actions";
import CustomerDetailsEditor from "./CustomerDetailsEditor";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id: id },
    include: {
      user: true,
      items: { include: { product: true } },
      address: true,
    },
  });

  if (!order) {
    notFound();
  }

  const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const statusColors: any = {
    pending: "bg-amber-100 text-amber-900 border-amber-200",
    completed: "bg-emerald-100 text-emerald-900 border-emerald-200",
    cancelled: "bg-rose-100 text-rose-900 border-rose-200",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors shadow-sm active:scale-95">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">#{order.id.slice(-6).toUpperCase()}</h1>
              <div className="flex gap-1.5">
                 <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black border tracking-wider ${order.paymentId ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                   {order.paymentId ? '● Paid' : '● Pending'}
                 </span>
                 <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black border tracking-wider ${statusColors[order.status]}`}>
                   {order.status === 'completed' ? '● Fulfilled' : '● Processing'}
                 </span>
              </div>
            </div>
            <p className="text-gray-400 text-[11px] mt-1 font-medium">{new Date(order.createdAt).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })} from Deeksha Online Store</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50 active:scale-95 transition-all shadow-sm">
             <CornerUpLeft className="w-3.5 h-3.5" /> Refund
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50 active:scale-95 transition-all shadow-sm">
             <Edit className="w-3.5 h-3.5" /> Edit
          </button>
          <div className="flex bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
             <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 text-xs font-bold border-r border-gray-100">Print</button>
             <button className="px-2 py-1.5 text-gray-600 hover:bg-gray-50"><MoreVertical className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Fulfillment Card */}
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-gray-400" />
                <h2 className="font-bold text-gray-900">Unfulfilled ({order.items.length})</h2>
              </div>
              <span className="text-xs font-bold text-gray-400">#{order.id.slice(-6).toUpperCase()}-F1</span>
            </div>
            <div className="divide-y divide-gray-50">
               {order.items.map((item) => (
                 <div key={item.id} className="p-6 flex gap-4 hover:bg-gray-50/30 transition-colors">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.product?.imageUrls?.[0] || "https://images.unsplash.com/photo-1603006905393-3b10b6d214c7?auto=format&fit=crop&q=80&w=600"} alt={item.product.title} className="w-16 h-16 rounded-xl object-cover border border-gray-100" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{item.product.title}</h3>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-medium uppercase tracking-wider">{item.product.slug}</p>
                    </div>
                    <div className="text-right whitespace-nowrap">
                       <p className="text-sm font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                       <p className="text-[10px] text-gray-400 mt-1 font-bold">₹{item.price.toFixed(2)} × {item.quantity}</p>
                    </div>
                 </div>
               ))}
            </div>
            <div className="p-4 bg-gray-50/50 border-t border-gray-50 flex justify-end">
               <form action={async () => {
                   "use server";
                   await updateOrderStatus(order.id, 'completed');
               }}>
                 <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95">
                    Fulfill Items
                 </button>
               </form>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden p-6 space-y-4">
             <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <h2 className="font-bold text-gray-900 uppercase text-[11px] tracking-widest text-gray-400">Payment Details</h2>
             </div>
             <div className="space-y-2 text-sm border-b border-gray-50 pb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="text-gray-900 font-bold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Shipping (Standard)</span>
                  <span className="text-emerald-600 font-bold">Free</span>
                </div>
                <div className="flex justify-between text-base pt-2">
                  <span className="text-gray-900 font-black">Total</span>
                  <span className="text-gray-900 font-black">₹{order.total.toFixed(2)}</span>
                </div>
             </div>
             <div className="flex justify-between items-center text-sm pt-2">
                <span className="text-gray-500 font-medium">Paid by customer</span>
                <span className="text-gray-900 font-bold">₹{order.paymentId ? order.total.toFixed(2) : '0.00'}</span>
             </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 space-y-6">
             <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-gray-400" />
                <h2 className="font-bold text-gray-900 uppercase text-[11px] tracking-widest text-gray-400">Timeline</h2>
             </div>
             <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-black text-xs">
                  {order.user?.name?.[0] || 'G'}
                </div>
                <div className="flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                   <p className="text-xs text-gray-400 font-medium">No comments yet. Only staff can see these.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar Sidebar Area */}
        <div className="space-y-6">
          {/* Notes Card */}
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-900 text-sm tracking-tight">Notes</h2>
              <button className="text-gray-400 hover:text-gray-600"><Edit className="w-3.5 h-3.5" /></button>
            </div>
            <p className="text-xs text-gray-400 font-medium italic">No notes from customer</p>
          </div>

          {/* Customer Card */}
          <CustomerDetailsEditor order={order} />
        </div>
      </div>
    </div>
  );
}
