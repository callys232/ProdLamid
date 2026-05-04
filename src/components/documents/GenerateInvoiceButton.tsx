"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface InvoiceItem { description: string; quantity: number; unitPrice: number }

interface Props {
  toUserId?:  string;
  toEmail?:   string;
  toName?:    string;
  items:      InvoiceItem[];
  notes?:     string;
  currency?:  string;
  label?:     string;
  className?: string;
}

export default function GenerateInvoiceButton({ toUserId, toEmail, toName, items, notes, currency, label = "Download Invoice", className = "" }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const res = await fetch("/api/invoice/generate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ toUserId, toEmail, toName, items, notes, currency }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }

      const html = await res.text();
      // Open in new tab for browser print-to-PDF
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(html);
        win.document.close();
        win.focus();
        setTimeout(() => win.print(), 500);
      }
    } catch (e: any) {
      toast.error(e.message || "Could not generate invoice");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
      onClick={handleGenerate} disabled={loading}
      className={`flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-gray-300 transition hover:border-white/20 hover:text-white disabled:opacity-50 ${className}`}
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
      {loading ? "Generating…" : label}
    </motion.button>
  );
}
