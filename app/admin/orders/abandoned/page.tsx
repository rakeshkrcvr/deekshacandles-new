import prisma from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { ShoppingCart, Mail, Phone, ExternalLink, RefreshCw, AlertCircle, Gift } from "lucide-react";
import { AbandonedCheckout } from "@/lib/generated/client";
import RecoveryLink from "./RecoveryLink";

export default async function AbandonedCheckoutsPage() {
  const abandoned: AbandonedCheckout[] = await prisma.abandonedCheckout.findMany({
    orderBy: { createdAt: "desc" },
    take: 100
  });

  const totalAbandoned = abandoned.length;
  const recoveredCheckouts = abandoned.filter(a => a.recovered);
  const recoveredCount = recoveredCheckouts.length;
  const recoveryRate = totalAbandoned > 0 ? (recoveredCount / totalAbandoned) * 100 : 0;
  const recoveredRevenue = recoveredCheckouts.reduce((acc, a) => acc + a.total, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-600/10 rounded-2xl">
             <ShoppingCart className="w-8 h-8 text-rose-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Abandoned Checkouts</h1>
            <p className="text-gray-500 mt-1">Track and recover lost orders from your customers.</p>
          </div>
        </div>
      </div>

      {/* Analytics Rows */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 text-gray-400 mb-2">
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-wider">Total Abandoned</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalAbandoned}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 text-emerald-500 mb-2">
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-wider text-gray-400">Recovery Rate</span>
          </div>
          <div className="text-3xl font-bold text-emerald-600">{recoveryRate.toFixed(1)}%</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 text-rose-500 mb-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-wider text-gray-400">Potential Revenue</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">₹{abandoned.filter(a => !a.recovered).reduce((acc, a) => acc + a.total, 0).toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm ring-2 ring-emerald-500/20">
          <div className="flex items-center gap-3 text-amber-500 mb-2">
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-wider text-gray-400">Recovered Revenue</span>
          </div>
          <div className="text-3xl font-bold text-emerald-600">₹{recoveredRevenue.toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h2 className="font-bold text-gray-900">Recent Abandoned Checkouts</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer Info</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Cart Details</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Drop-off Stage</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Reminders</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Time</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Recovery Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {abandoned.map((item) => (
                <tr key={item.id} className={`hover:bg-gray-50/50 transition-colors ${item.recovered ? 'opacity-60 grayscale' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">
                        {item.firstName ? `${item.firstName} ${item.lastName}` : "Identified Visitor"}
                      </span>
                      <div className="flex flex-col gap-1 mt-1 text-xs text-gray-500">
                        {item.email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" /> {item.email}</span>}
                        {item.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /> {item.phone}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">₹{item.total.toFixed(2)}</span>
                      <span className="text-xs text-gray-500">{(item.cartItems as any).length} Item(s)</span>
                      {item.couponCode && (
                        <div className="flex items-center gap-1.5 mt-1">
                           <Gift className="w-3 h-3 text-amber-500" />
                           <span className="text-[10px] font-bold text-amber-600 uppercase">{item.couponCode}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {item.recovered ? (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Success (Recovered)</span>
                    ) : (
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-wider">{item.lastStep} Step</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-700">{item.remindersSent}</span>
                      <span className="text-xs text-gray-400">sent</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    <div className="flex flex-col capitalize">
                      <span>{format(new Date(item.updatedAt), "HH:mm")}</span>
                      <span>{format(new Date(item.updatedAt), "dd MMM yyyy")}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <RecoveryLink token={item.recoveryToken} />
                  </td>
                </tr>
              ))}
              {abandoned.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium">
                    No abandoned checkouts found yet.
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
