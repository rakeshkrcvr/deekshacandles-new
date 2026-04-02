"use client";

import { useState } from "react";
import { Mail, Lock, LogIn, ArrowLeft } from "lucide-react";
import { loginAffiliate } from "@/app/affiliate/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AffiliateLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await loginAffiliate(formData.email, formData.password);
    if (res.success) {
      router.push("/affiliate/dashboard");
    } else {
      setError(res.error || "Login failed. Please check your credentials.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
      <div className="max-w-md w-full">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8 text-sm font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>

        <div className="bg-white rounded-[2rem] shadow-2xl shadow-gray-200/60 p-10 border border-gray-100">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tighter uppercase">Affiliate Login</h1>
            <p className="text-sm text-gray-400 font-medium">Access your partner dashboard to track earnings and sales.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold animate-in fade-in zoom-in-95">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Registered Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-amber-600 transition-colors" />
                  <input 
                    required type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="name@example.com"
                    className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500/30 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-amber-600 transition-colors" />
                  <input 
                    required type="password"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500/30 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-gray-900 text-white py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? "Verifying..." : (
                <>
                  Enter Dashboard <LogIn className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-6 text-center border-t border-gray-50">
              <p className="text-xs text-gray-400 font-medium italic">
                Don't have an affiliate account?{" "}
                <Link href="/affiliate/apply" className="text-amber-600 font-bold hover:underline not-italic">Apply Here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
