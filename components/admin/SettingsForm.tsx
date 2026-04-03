"use client";

import { Save, CreditCard, Truck, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { updateStoreSettings } from "@/app/admin/(authenticated)/settings/actions";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export default function SettingsForm({ settings }: { settings: Record<string, any> }) {
  const [razorpayKeyId, setRazorpayKeyId] = useState(settings?.razorpayKeyId || "");
  const [razorpaySecret, setRazorpaySecret] = useState(settings?.razorpaySecret || "");
  const [shiprocketEmail, setShiprocketEmail] = useState(settings?.shiprocketEmail || "");
  const [shiprocketPassword, setShiprocketPassword] = useState(settings?.shiprocketPassword || "");
  const [isConnectingRazorpay, setIsConnectingRazorpay] = useState(false);
  const [isConnectingShiprocket, setIsConnectingShiprocket] = useState(false);

  useEffect(() => {
    const handleExtensionMessage = (event: MessageEvent) => {
      if (event.source !== window || !event.data || event.data.type !== "EXT_CREDENTIALS") {
        return;
      }

      console.log("Received credentials from extension:", event.data);
      const data = event.data.data;

      if (data.razorpayKeyId) setRazorpayKeyId(data.razorpayKeyId);
      if (data.razorpaySecret) {
        setRazorpaySecret(data.razorpaySecret);
        setIsConnectingRazorpay(false);
      }
      if (data.shiprocketEmail) {
        setShiprocketEmail(data.shiprocketEmail);
        setIsConnectingShiprocket(false);
      }
      if (data.shiprocketPassword) {
        setShiprocketPassword(data.shiprocketPassword);
        setIsConnectingShiprocket(false);
      }
      
      alert(`Auto-filled credentials from ${data.source}! Please save the integration.`);
    };

    window.addEventListener("message", handleExtensionMessage);
    return () => window.removeEventListener("message", handleExtensionMessage);
  }, []);

  const handleQuickSetup = () => {
    // Notify the extension to start scraping
    window.postMessage({ type: "START_QUICK_SETUP" }, "*");
    
    // Fallback: Just open the windows for manual setup if extension isn't running
    window.open("https://dashboard.razorpay.com/app/keys", "_blank");
    window.open("https://app.shiprocket.in/api-settings", "_blank");
  };

  const handleRazorpayGoogleConnect = () => {
    setIsConnectingRazorpay(true);
    
    // Simulate natural OAuth flow visual delay
    setTimeout(() => {
      // Trigger extension auto-fetch for Razorpay specifically if extension exists
      window.postMessage({ type: "START_QUICK_SETUP", provider: "razorpay" }, "*");
      
      // Open Razorpay Google Auth popup (simulation)
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      const popup = window.open("https://auth.razorpay.com/google", "RazorpayAuth", `width=${width},height=${height},left=${left},top=${top}`);
      
      // If popup blocked or closed quickly, fallback
      if (!popup) {
         window.open("https://dashboard.razorpay.com/app/keys", "_blank");
         setIsConnectingRazorpay(false);
      } else {
         // Fake the completion if extension doesn't respond in 5s
         setTimeout(() => {
           if (isConnectingRazorpay) setIsConnectingRazorpay(false);
         }, 5000);
      }
    }, 400);
  };

  const handleShiprocketGoogleConnect = () => {
    setIsConnectingShiprocket(true);
    
    // Simulate natural OAuth flow visual delay
    setTimeout(() => {
      // Trigger extension auto-fetch for Shiprocket specifically if extension exists
      window.postMessage({ type: "START_QUICK_SETUP", provider: "shiprocket" }, "*");
      
      // Open Shiprocket Google Auth popup (simulation)
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      const popup = window.open("https://auth.shiprocket.in/google", "ShiprocketAuth", `width=${width},height=${height},left=${left},top=${top}`);
      
      // If popup blocked or closed quickly, fallback
      if (!popup) {
         window.open("https://app.shiprocket.in/api-settings", "_blank");
         setIsConnectingShiprocket(false);
      } else {
         // Fake the completion if extension doesn't respond in 5s
         setTimeout(() => {
           if (isConnectingShiprocket) setIsConnectingShiprocket(false);
         }, 5000);
      }
    }, 400);
  };

  return (
    <form action={updateStoreSettings} className="space-y-8">
      {/* Razorpay Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6 relative z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-blue-500" /> Razorpay Integration
            </h2>
            <p className="text-sm text-gray-500 mt-1">Configure your payment gateway seamlessly.</p>
          </div>
          
          <button
            type="button"
            onClick={handleRazorpayGoogleConnect}
            disabled={isConnectingRazorpay}
            className="flex items-center gap-3 px-5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-semibold text-sm transition-all shadow-sm active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group whitespace-nowrap"
          >
            {isConnectingRazorpay ? (
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            <span>{isConnectingRazorpay ? "Connecting..." : "Connect Automatically"}</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Razorpay Key ID</label>
            <input 
              name="razorpayKeyId" 
              value={razorpayKeyId} 
              onChange={(e) => setRazorpayKeyId(e.target.value)} 
              type="password" 
              placeholder="rzp_test_xxxxxx" 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Razorpay Secret</label>
            <input 
              name="razorpaySecret" 
              value={razorpaySecret} 
              onChange={(e) => setRazorpaySecret(e.target.value)} 
              type="password" 
              placeholder="xxxxxxxxxxxx" 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" 
            />
          </div>
        </div>
        <p className="text-sm text-gray-500">Leaving these blank will revert checkout to &quot;Cash on Delivery&quot;.</p>
      </div>

      {/* Shiprocket Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6 relative z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Truck className="w-6 h-6 text-emerald-500" /> Shiprocket Integration
            </h2>
            <p className="text-sm text-gray-500 mt-1">Sync your orders and automate shipping globally.</p>
          </div>
          
          <button
            type="button"
            onClick={handleShiprocketGoogleConnect}
            disabled={isConnectingShiprocket}
            className="flex items-center gap-3 px-5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-semibold text-sm transition-all shadow-sm active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group whitespace-nowrap"
          >
            {isConnectingShiprocket ? (
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            <span>{isConnectingShiprocket ? "Connecting..." : "Connect Automatically"}</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shiprocket Email</label>
            <input 
              name="shiprocketEmail" 
              value={shiprocketEmail} 
              onChange={(e) => setShiprocketEmail(e.target.value)} 
              type="email" 
              placeholder="email@company.com" 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shiprocket Password</label>
            <input 
              name="shiprocketPassword" 
              value={shiprocketPassword} 
              onChange={(e) => setShiprocketPassword(e.target.value)} 
              type="password" 
              placeholder="••••••••" 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" 
            />
          </div>
        </div>
        <p className="text-sm text-gray-500">Upon successful checkout, orders will be automatically pushed to Shiprocket if these credentials are valid.</p>
      </div>

      <div className="flex flex-col items-end gap-4 mt-8">
        <button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] w-full max-w-sm">
          <Save className="w-5 h-5" /> Save Integrations
        </button>
        
        <button 
          type="button" 
          onClick={handleQuickSetup}
          className="bg-gray-900 hover:bg-gray-800 text-amber-500 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] w-full max-w-sm border border-gray-800"
        >
          <Zap className="w-5 h-5" /> Quick Setup
        </button>
      </div>
    </form>
  );
}
