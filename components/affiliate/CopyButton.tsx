"use client";

import { Copy } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    alert("Link copied to clipboard!");
  };

  return (
    <button 
      onClick={handleCopy}
      className="p-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition shadow-lg shadow-amber-600/20"
      title="Copy Link"
    >
      <Copy className="w-4 h-4" />
    </button>
  );
}
