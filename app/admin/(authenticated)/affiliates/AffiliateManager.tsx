"use client";

import { useState } from "react";
import { Plus, Search, MoreVertical, Trash2, Edit2, Shield, User, Mail, DollarSign, ExternalLink, Youtube, Instagram, Phone, CheckCircle2, LogIn, Eye, EyeOff } from "lucide-react";
import { createAffiliate, updateAffiliate, deleteAffiliate } from "./actions";
import { impersonateAffiliate } from "@/app/affiliate/actions";

interface Affiliate {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  youtubeUrl: string | null;
  instagramUrl: string | null;
  code: string | null;
  commissionRate: number;
  totalSales: number;
  totalEarnings: number;
  status: string;
  payoutInfo: string | null;
  _count?: { orders: number };
}

import { approveAffiliate, rejectAffiliate } from "./actions";

export default function AffiliateManager({ initialAffiliates }: { initialAffiliates: Affiliate[] }) {
  const [affiliates, setAffiliates] = useState(initialAffiliates);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    code: "",
    password: "",
    commissionRate: 10,
    payoutInfo: ""
  });

  const filteredAffiliates = affiliates.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    (a.code || "").toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (editingId) {
      const res = await updateAffiliate(editingId, formData);
      if (res.success) {
        setAffiliates(prev => prev.map(a => a.id === editingId ? { ...a, ...formData } : a));
        setIsModalOpen(false);
        setEditingId(null);
      } else {
        alert(res.error || "Failed to update partner");
      }
    } else {
      const res = await createAffiliate(formData);
      if (res.success) {
        setAffiliates(prev => [res.data as any, ...prev]);
        setIsModalOpen(false);
      } else {
        alert(res.error);
      }
    }
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    const code = prompt("Enter Affiliate Code to assign (e.g., PARTNER10):");
    if (!code) return;
    const rate = prompt("Enter Commission Rate %:", "10");
    if (!rate) return;

    setLoading(true);
    const res = await approveAffiliate(id, code, parseFloat(rate));
    if (res.success) {
      setAffiliates(prev => prev.map(a => a.id === id ? { ...a, status: 'approved', code, commissionRate: parseFloat(rate) } : a));
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  const handleReject = async (id: string) => {
    if (!confirm("Reject this application?")) return;
    setLoading(true);
    const res = await rejectAffiliate(id);
    if (res.success) {
      setAffiliates(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this affiliate?")) return;
    const res = await deleteAffiliate(id);
    if (res.success) {
      setAffiliates(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Affiliate Management</h1>
          <p className="text-sm text-gray-500">Track and manage your affiliate partners and their performance.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ name: "", email: "", code: "", password: "", commissionRate: 10, payoutInfo: "" });
            setEditingId(null);
            setIsModalOpen(true);
          }}
          className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-amber-600/10"
        >
          <Plus className="w-4 h-4" /> Add New Affiliate
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Affiliates', value: affiliates.length, icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Sales', value: `₹${affiliates.reduce((sum, a) => sum + a.totalSales, 0).toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total Commission', value: `₹${affiliates.reduce((sum, a) => sum + a.totalEarnings, 0).toLocaleString()}`, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Active Promotions', value: affiliates.filter(a => a.status === 'active').length, icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* List / Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, email or code..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Affiliate</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Rate</th>
                <th className="px-6 py-4">Performance</th>
                <th className="px-6 py-4">Earnings</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAffiliates.map((affiliate) => (
                <tr key={affiliate.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-400 text-sm">
                        {affiliate.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-amber-600 transition-colors uppercase tracking-tight">{affiliate.name}</p>
                        <p className="text-[11px] text-gray-400 flex items-center gap-1 leading-none mt-0.5"><Mail className="w-3 h-3 text-gray-300" /> {affiliate.email}</p>
                        {affiliate.phone && <p className="text-[11px] text-gray-400 flex items-center gap-1 leading-none mt-1"><Phone className="w-3 h-3 text-gray-300" /> {affiliate.phone}</p>}
                        <div className="flex gap-2 mt-1.5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                          {affiliate.youtubeUrl && <a href={affiliate.youtubeUrl} target="_blank" className="hover:text-red-600"><Youtube size={12} /></a>}
                          {affiliate.instagramUrl && <a href={affiliate.instagramUrl} target="_blank" className="hover:text-pink-600"><Instagram size={12} /></a>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      affiliate.status === 'approved' ? 'bg-green-100 text-green-700' : 
                      affiliate.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                      affiliate.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {affiliate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm font-bold text-gray-700">
                      {affiliate.code ? (
                        <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[11px] border border-amber-100 font-black">{affiliate.code}</span>
                      ) : (
                        <span className="text-gray-300 italic text-[11px]">N/A</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm font-bold text-gray-700">
                       {affiliate.commissionRate}%
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">₹{affiliate.totalSales.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold font-mono leading-none">{affiliate._count?.orders || 0} Orders</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-600 tracking-tighter">
                    ₹{affiliate.totalEarnings.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-10 group-hover:opacity-100 transition-opacity">
                      {affiliate.status === 'pending' && (
                        <div className="flex gap-2 mr-2">
                           <button onClick={() => handleApprove(affiliate.id)} className="bg-green-600 text-white p-1.5 rounded-lg hover:bg-green-700" title="Approve"><CheckCircle2 className="w-4 h-4" /></button>
                           <button onClick={() => handleReject(affiliate.id)} className="bg-red-600 text-white p-1.5 rounded-lg hover:bg-red-700" title="Reject">&times;</button>
                        </div>
                      )}
                      
                      <button 
                        onClick={() => impersonateAffiliate(affiliate.id)}
                        className="p-2 hover:bg-amber-50 text-amber-600 rounded-lg transition-colors"
                        title="View Dashboard"
                      >
                        <LogIn className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => {
                          setFormData({ 
                            name: affiliate.name, 
                            email: affiliate.email, 
                            code: affiliate.code || "", 
                            password: "", // Don't show existing password
                            commissionRate: affiliate.commissionRate, 
                            payoutInfo: affiliate.payoutInfo || "" 
                          });
                          setEditingId(affiliate.id);
                          setIsModalOpen(true);
                        }}
                        className="p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(affiliate.id)}
                        className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{editingId ? 'Edit Partner' : 'Add New Partner'}</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Partner Information</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-200 rounded-full transition-colors">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 leading-none">Full Name</label>
                  <input 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 leading-none">Email Address</label>
                  <input 
                    required type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com"
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 leading-none">Affiliate Code</label>
                  <input 
                    required
                    value={formData.code}
                    onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    placeholder="DEEKSHA10"
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-black text-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all uppercase tracking-widest"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 leading-none">Commission Rate (%)</label>
                  <input 
                    required type="number"
                    value={formData.commissionRate}
                    onChange={e => setFormData({...formData, commissionRate: parseFloat(e.target.value)})}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all font-bold"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 leading-none">Login Password {editingId && "(Leave blank to keep current)"}</label>
                  <div className="relative group">
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      placeholder="Set secret password for affiliate to login"
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all pr-12"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 leading-none">Payout Information</label>
                <textarea 
                  value={formData.payoutInfo}
                  onChange={e => setFormData({...formData, payoutInfo: e.target.value})}
                  rows={3}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all font-medium"
                  placeholder="Bank Details, UPI ID, etc."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-8 py-4 rounded-2xl text-sm font-bold border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  disabled={loading}
                  className="flex-1 bg-gray-900 group relative text-white py-4 rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-2xl shadow-gray-200 disabled:opacity-50"
                >
                  {loading ? 'Crunching...' : editingId ? 'Update Partner' : 'Add Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline missing icon
function TrendingUp(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
  );
}

function Tags(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 5 1.41 1.41a1 1 0 0 1 0 1.42l-1.41 1.41a1 1 0 0 1-1.42 0l-1.41-1.41a1 1 0 0 1 0-1.42L13.59 5a1 1 0 0 1 1.41 0z"></path><path d="m7 13 1.41 1.41a1 1 0 0 1 0 1.42l-1.41 1.41a1 1 0 0 1-1.42 0l-1.41-1.41a1 1 0 0 1 0-1.42L5.59 13a1 1 0 0 1 1.41 0z"></path><path d="m11 9 1.41 1.41a1 1 0 0 1 0 1.42l-1.41 1.41a1 1 0 0 1-1.42 0l-1.41-1.41a1 1 0 0 1 0-1.42L9.59 9a1 1 0 0 1 1.41 0z"></path><path d="M11 19H3"></path><path d="M19 11h-8"></path><path d="M15 15h-8"></path><path d="m19 19-4-4"></path><path d="m21 15-2 2-2-2"></path></svg>
  );
}
