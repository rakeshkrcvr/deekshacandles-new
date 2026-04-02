"use client";

import { useEffect, useState } from "react";
import CopyButton from "./CopyButton";

export default function ReferralLinkBox({ code }: { code: string }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    // Construct the URL on the client side to get the current origin
    const origin = window.location.origin;
    setUrl(`${origin}?ref=${code}`);
  }, [code]);

  return (
    <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col gap-2 min-w-[300px]">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Your Referral Link</p>
      <div className="flex items-center gap-2">
        <input 
          readOnly 
          value={url || `Constructing link...`} 
          className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-600 w-full focus:outline-none"
        />
        <CopyButton text={url} />
      </div>
    </div>
  );
}
