import prisma from "@/lib/prisma";
import { Package, CheckCircle, Clock, Trash2, ArrowRight, CreditCard, Truck, ExternalLink, MapPin } from "lucide-react";
import { updateOrderStatus } from "../../actions";
import Link from "next/link";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: { include: { product: true } },
      address: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Orders</h1>
          <p className="text-gray-500 mt-2">View and manage customer orders.</p>
        </div>
        <Link 
          href="/admin/orders/abandoned" 
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all shadow-sm"
        >
          View Abandoned Checkouts
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr className="text-gray-500 uppercase tracking-wider text-[9px] font-black border-b border-gray-100 bg-gray-50/30">
                <th className="px-5 py-3 text-left">Order</th>
                <th className="px-5 py-3 text-left">Customer</th>
                <th className="px-5 py-3 text-left">Items</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-center">Amount</th>
                <th className="px-5 py-3 text-left">Payment</th>
                <th className="px-5 py-3 text-left">Fulfillment</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/30 transition-colors border-b last:border-0 border-gray-50 group">
                    <td className="px-5 py-3.5 align-middle">
                      <Link href={`/admin/orders/${order.id}`} className="group/id flex flex-col gap-0 cursor-pointer">
                        <span className="font-bold text-gray-900 font-mono text-[10px] group-hover/id:text-indigo-600 transition-colors">#{order.id.slice(-6).toUpperCase()}</span>
                        <span className="text-[8px] uppercase font-black text-gray-400">Online Order</span>
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 align-middle">
                      <div className="flex flex-col">
                        <Link href={`/admin/orders/${order.id}`} className="font-bold text-gray-700 text-[10px] hover:text-indigo-600 transition-colors cursor-pointer leading-tight">{order.user?.name || 'Guest User'}</Link>
                        <div className="flex items-center gap-1 text-gray-400 mt-0.5">
                           <MapPin className="w-2.5 h-2.5 opacity-50" />
                           <span className="text-[8.5px] font-bold max-w-[100px] truncate uppercase tracking-tight">
                             {order.address?.city}
                           </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 align-middle">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <Package className="w-2.5 h-2.5 text-gray-300" />
                          <span className="text-[10px] font-black text-gray-600">{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}</span>
                        </div>
                        <p className="text-[8.5px] text-gray-400 truncate max-w-[100px] mt-0.5">
                          {order.items.map(item => item.product.title).join(", ")}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 align-middle">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 font-bold leading-tight">{new Date(order.createdAt).toLocaleDateString()}</span>
                        <span className="text-[8.5px] text-gray-400 font-medium">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 align-middle text-center">
                      <span className="font-black text-gray-900 text-[11px] tracking-tighter">₹{order.total}</span>
                    </td>
                    <td className="px-5 py-3.5 align-middle">
                      <div className="flex flex-col gap-1">
                        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-sm border w-fit ${order.paymentId ? 'bg-emerald-50/50 border-emerald-100' : 'bg-amber-50/50 border-amber-100'}`}>
                          {order.paymentId ? <CreditCard className="w-2 h-2 text-emerald-500" /> : <Clock className="w-2 h-2 text-amber-500" />}
                          <span className={`text-[8.5px] font-black uppercase tracking-tight ${order.paymentId ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {order.paymentId ? 'Paid' : 'COD'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 align-middle">
                      <div className="flex flex-col gap-1">
                         <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-sm border w-fit ${
                           order.status === 'completed' ? 'bg-indigo-50/50 text-indigo-700 border-indigo-100' :
                           'bg-slate-50/50 text-slate-600 border-slate-100'
                         }`}>
                           <Truck className="w-2 h-2" />
                           <span className="text-[8.5px] font-black uppercase tracking-tight">
                             {order.status === 'completed' ? 'Fulfilled' : 'Processing'}
                           </span>
                         </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 align-middle text-right">
                       <div className="flex justify-end gap-1">
                         <Link 
                           href={`/admin/orders/${order.id}`}
                           className="flex items-center justify-center w-7 h-7 bg-white border border-gray-100 text-gray-400 hover:text-indigo-600 hover:border-indigo-100 rounded-md transition-all active:scale-90"
                           title="View Details"
                         >
                           <ExternalLink className="w-3 h-3" />
                         </Link>
                         {order.status !== 'completed' && (
                           <form action={async () => {
                             "use server";
                             await updateOrderStatus(order.id, 'completed');
                           }}>
                              <button className="flex items-center gap-1 px-2 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-md text-[9px] font-black transition-all active:scale-95 uppercase tracking-tighter">
                                <CheckCircle className="w-2.5 h-2.5" /> Ship
                              </button>
                           </form>
                         )}
                       </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                     No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
