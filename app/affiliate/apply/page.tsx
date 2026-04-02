"use client";

import { useState } from "react";
import { User, Mail, Phone, Youtube, Instagram, Send, CheckCircle2 } from "lucide-react";
import { submitAffiliateApplication } from "@/app/admin/affiliates/actions";
import Link from "next/link";

export default function AffiliateApplyPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    youtubeUrl: "",
    instagramUrl: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await submitAffiliateApplication(formData);
    if (res.success) {
      setSubmitted(true);
    } else {
      setError(res.error || "Failed to submit application");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Application Submitted!</h1>
          <p className="text-gray-500 leading-relaxed">
            Thank you for your interest in joining the Deeksha Candles Affiliate Program. 
            We have received your details and our team will review your profile shortly. 
            You will receive an email once your account is approved.
          </p>
          <div className="pt-4">
            <Link href="/" className="inline-flex items-center justify-center px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-xl">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-20 px-6">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Become an Affiliate</h1>
          <p className="text-gray-500">Partner with Deeksha Candles and earn commissions on every referral. Fill in your professional details below to apply.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your full name"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      required type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="email@example.com"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      required type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      placeholder="+91 00000 00000"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Set Account Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 flex items-center justify-center font-bold">***</span>
                  <input 
                    required type="password"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    placeholder="Create a strong password"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">YouTube Link (optional)</label>
                <div className="relative">
                  <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    value={formData.youtubeUrl}
                    onChange={e => setFormData({...formData, youtubeUrl: e.target.value})}
                    placeholder="https://youtube.com/c/..."
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Instagram Link (optional)</label>
                <div className="relative">
                  <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    value={formData.instagramUrl}
                    onChange={e => setFormData({...formData, instagramUrl: e.target.value})}
                    placeholder="https://instagram.com/..."
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-gray-900 text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-50 mt-4 active:scale-[0.98]"
            >
              {loading ? "Submitting..." : (
                <>
                  Submit Application <Send className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="relative flex items-center justify-center py-4">
              <div className="w-full border-t border-gray-100"></div>
              <span className="bg-white px-3 text-[10px] font-black text-gray-300 uppercase tracking-widest absolute">OR</span>
            </div>

            <Link 
              href="/affiliate/login"
              className="w-full border-2 border-gray-900 border-dashed text-gray-900 py-3.5 rounded-xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-all active:scale-[0.98]"
            >
              Already a Partner? Login here
            </Link>

            <p className="text-[11px] text-gray-400 text-center uppercase tracking-widest font-bold pt-4">
              By submitting, you agree to our terms & conditions.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
