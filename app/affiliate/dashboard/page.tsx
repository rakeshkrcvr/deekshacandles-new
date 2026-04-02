import { getAffiliateSession, logoutAffiliate } from "../actions";
import { redirect } from "next/navigation";
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Copy, 
  LogOut, 
  ExternalLink, 
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  LayoutDashboard
} from "lucide-react";
import ReferralLinkBox from "@/components/affiliate/ReferralLinkBox";

export default async function AffiliateDashboardPage() {
  const affiliate = await getAffiliateSession();

  if (!affiliate) {
    redirect("/affiliate/login");
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-amber-600/20">
              {affiliate.name[0]}
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-900 tracking-tighter uppercase leading-none">Partner Dashboard</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Ref Code: <span className="text-amber-600">{affiliate.code}</span></p>
            </div>
          </div>
          
          <form action={logoutAffiliate}>
            <button className="text-gray-400 hover:text-red-600 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest group">
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Sign Out
            </button>
          </form>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-10 space-y-10">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Welcome back, {affiliate.name}!</h2>
            <p className="text-sm text-gray-500 mt-1 font-medium">Tracking your performance and earnings in real-time.</p>
          </div>
          <ReferralLinkBox code={affiliate.code || ""} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              label: 'Total Earnings', 
              value: `₹${affiliate.totalEarnings.toLocaleString()}`, 
              icon: DollarSign, 
              color: 'text-emerald-600', 
              bg: 'bg-emerald-50',
              trend: 'Lifetime'
            },
            { 
              label: 'Sales Referred', 
              value: `₹${affiliate.totalSales.toLocaleString()}`, 
              icon: TrendingUp, 
              color: 'text-blue-600', 
              bg: 'bg-blue-50',
              trend: 'Revenue Generated'
            },
            { 
              label: 'Total Orders', 
              value: affiliate._count?.orders || 0, 
              icon: ShoppingBag, 
              color: 'text-purple-600', 
              bg: 'bg-purple-50',
              trend: 'Completed referrals'
            },
            { 
              label: 'Commission Rate', 
              value: `${affiliate.commissionRate}%`, 
              icon: AlertCircle, 
              color: 'text-amber-600', 
              bg: 'bg-amber-50',
              trend: 'Flat percentage'
            },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
              <div className={`p-4 rounded-3xl ${stat.bg} ${stat.color} absolute -right-4 -top-4 opacity-20 group-hover:scale-150 transition-transform duration-700`}>
                <stat.icon className="w-12 h-12" />
              </div>
              <div className="relative z-10">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-gray-900 tracking-tighter mb-2">{stat.value}</p>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
                  <Clock className="w-3 h-3" /> {stat.trend}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Tabs / Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                <Calendar className="w-5 h-5 text-amber-500" /> Recent Referred Sales
              </h3>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                       <th className="px-8 py-5">Order ID</th>
                       <th className="px-8 py-5">Date</th>
                       <th className="px-8 py-5">Amount</th>
                       <th className="px-8 py-5">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                     {affiliate.orders.length > 0 ? affiliate.orders.map((order) => (
                       <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                         <td className="px-8 py-6">
                            <p className="text-xs font-bold text-gray-900 uppercase tracking-tighter">#{order.id.slice(-8)}</p>
                         </td>
                         <td className="px-8 py-6">
                            <p className="text-xs font-medium text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                         </td>
                         <td className="px-8 py-6">
                            <p className="text-sm font-black text-gray-900">₹{order.total.toLocaleString()}</p>
                            <p className="text-[10px] font-bold text-emerald-600 uppercase">Comm: ₹{(order.total * (affiliate.commissionRate / 100)).toFixed(2)}</p>
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-1.5">
                              {order.status === 'completed' || order.status === 'success' ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              ) : order.status === 'cancelled' ? (
                                <XCircle className="w-4 h-4 text-red-500" />
                              ) : (
                                <Clock className="w-4 h-4 text-amber-500" />
                              )}
                              <span className={`text-[10px] font-black uppercase tracking-widest ${
                                order.status === 'completed' || order.status === 'success' ? 'text-emerald-700' : 
                                order.status === 'cancelled' ? 'text-red-700' : 'text-amber-700'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                         </td>
                       </tr>
                     )) : (
                       <tr>
                         <td colSpan={4} className="px-8 py-20 text-center">
                            <div className="max-w-xs mx-auto">
                              <ShoppingBag className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No sales yet.</p>
                              <p className="text-xs text-gray-400 mt-1">Start sharing your referral link to earn commissions!</p>
                            </div>
                         </td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight px-2">Account Details</h3>
            
            <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-gray-900/10 space-y-8 relative overflow-hidden">
               <div className="absolute right-0 top-0 opacity-10 -rotate-12 translate-x-4">
                  <LayoutDashboard className="w-52 h-52 text-white" />
               </div>

               <div className="space-y-1 relative z-10">
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Partner Level</p>
                 <p className="text-2xl font-black italic tracking-tighter uppercase text-amber-500 shadow-amber-500/10">Elite Silver</p>
               </div>

               <div className="space-y-4 relative z-10">
                 <div className="flex items-center justify-between border-b border-white/10 pb-3">
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payout Info</span>
                   <span className="text-xs font-bold text-gray-200">{affiliate.payoutInfo || "Not Set"}</span>
                 </div>
                 <div className="flex items-center justify-between border-b border-white/10 pb-3">
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Commission</span>
                   <span className="text-xs font-bold text-amber-500">{affiliate.commissionRate}% Flat</span>
                 </div>
                 <div className="flex items-center justify-between border-b border-white/10 pb-3">
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined On</span>
                   <span className="text-xs font-bold text-gray-200">{new Date(affiliate.createdAt).toLocaleDateString()}</span>
                 </div>
               </div>

               <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative z-10">
                 Request Payout
               </button>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/30">
               <div className="flex items-center gap-3 mb-4">
                 <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                    <AlertCircle className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-sm font-black text-gray-900 uppercase">Need Help?</p>
                   <p className="text-[10px] font-bold text-gray-400">Our support team is here.</p>
                 </div>
               </div>
               <a href="mailto:support@deekshacandles.com" className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-[10px] font-bold text-gray-600 uppercase tracking-widest transition-colors">
                 Contact Support <ExternalLink className="w-3 h-3" />
               </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
