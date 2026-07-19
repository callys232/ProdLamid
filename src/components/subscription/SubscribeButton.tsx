"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Zap } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  plan: string; // e.g. "premium_monthly"
  label?: string;
  className?: string;
}

export default function SubscribeButton({ plan, label = "Upgrade Now", className = "" }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res  = await fetch("/api/subscription/create", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      // Redirect to Paystack checkout
      window.location.href = data.authorizationUrl;
    } catch (e: any) {
      toast.error(e.message || "Could not start subscription");
      setLoading(false);
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
      onClick={handleClick} disabled={loading}
      className={`flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-50 ${className}`}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
      {loading ? "Redirecting…" : label}
    </motion.button>
  );
}
