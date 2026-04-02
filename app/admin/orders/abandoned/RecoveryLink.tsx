"use client";

import { useState } from "react";
import { Link2, Check, Copy } from "lucide-react";

export default function RecoveryLink({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);
  const link = typeof window !== "undefined" ? `${window.location.origin}/checkout?token=${token}` : `/checkout?token=${token}`;

  const copy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <input 
        readOnly 
        value={link}
        className="w-32 bg-gray-50 border border-gray-100 rounded px-2 py-1 text-[10px] text-gray-400 truncate"
      />
      <button 
        onClick={copy}
        className={`p-1.5 rounded-lg transition-all ${copied ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        title="Copy Recovery Link"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="p-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
        title="Open Link"
      >
        <Link2 className="w-4 h-4" />
      </a>
    </div>
  );
}
