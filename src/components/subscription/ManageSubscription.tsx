"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Zap, Loader2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import SubscribeButton from "./SubscribeButton";

interface SubInfo {
  tier:               string;
  subscriptionStatus: string;
  subscriptionCycle:  string;
}

const TIER_LABEL: Record<string, string> = {
  free:            "Starter (Free)",
  premium:         "Premium",
  enterprise:      "Enterprise",
  enterprise_plus: "Enterprise+",
};

const STATUS_STYLE: Record<string, string> = {
  active:       "text-green-400",
  inactive:     "text-gray-400",
  cancelled:    "text-red-400",
  "non-renewing": "text-yellow-400",
};

export default function ManageSubscription() {
  const [info, setInfo]         = useState<SubInfo | null>(null);
  const [loading, setLoading]   = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [confirm, setConfirm]   = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => {
        if (d.success) setInfo({
          tier:               d.data.tier               ?? "free",
          subscriptionStatus: d.data.subscriptionStatus ?? "inactive",
          subscriptionCycle:  d.data.subscriptionCycle  ?? "monthly",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleCancel() {
    setCancelling(true);
    try {
      const res = await fetch("/api/subscription/cancel", { method: "POST" });
      const d   = await res.json();
      if (!res.ok) throw new Error(d.message);
      toast.success("Subscription cancelled. Access continues until end of period.");
      setInfo(p => p ? { ...p, subscriptionStatus: "cancelled" } : p);
      setConfirm(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to cancel");
    } finally {
      setCancelling(false);
    }
  }

  if (loading) return <div className="h-6 w-32 animate-pulse rounded bg-white/10" />;

  const isActive = info?.subscriptionStatus === "active";
  const isFree   = !info?.tier || info.tier === "free";

  return (
    <div className="space-y-5">
      {/* Current plan */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">Current Plan</h3>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-bold text-white">{TIER_LABEL[info?.tier ?? "free"]}</p>
            <p className={`mt-0.5 text-xs font-medium capitalize ${STATUS_STYLE[info?.subscriptionStatus ?? "inactive"]}`}>
              {isActive ? `Active · ${info?.subscriptionCycle}` : (info?.subscriptionStatus ?? "inactive")}
            </p>
          </div>
          {isActive ? (
            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
          ) : (
            <XCircle className="h-5 w-5 text-gray-500 flex-shrink-0" />
          )}
        </div>
      </div>

      {/* Upgrade options (only show if on free or lower tier) */}
      {isFree && (
        <div className="rounded-xl border border-[#c12129]/20 bg-[#c12129]/5 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#c12129]" />
            <p className="text-sm font-semibold text-white">Upgrade to Premium</p>
          </div>
          <p className="mb-4 text-xs text-gray-400">Unlock AI matching, unlimited projects, priority support and more.</p>
          <div className="flex flex-wrap gap-3">
            <SubscribeButton plan="premium_monthly"   label="Monthly — $49/mo"   className="text-xs px-4 py-2" />
            <SubscribeButton plan="premium_quarterly" label="Quarterly — $129/qtr" className="text-xs px-4 py-2 bg-white/10 text-white hover:bg-white/20" />
            <SubscribeButton plan="premium_annual"    label="Annual — $499/yr"   className="text-xs px-4 py-2 bg-green-600 hover:bg-green-700" />
          </div>
        </div>
      )}

      {/* Cancel subscription */}
      {isActive && info?.tier === "premium" && (
        <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-5">
          <h3 className="mb-2 text-sm font-semibold text-red-400">Cancel Subscription</h3>
          <p className="mb-4 text-xs text-gray-500">
            You'll keep Premium access until the end of your billing period.
          </p>
          {!confirm ? (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => setConfirm(true)}
              className="rounded-lg border border-red-500/30 px-4 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10">
              Cancel Subscription
            </motion.button>
          ) : (
            <div className="flex gap-3">
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleCancel} disabled={cancelling}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-50">
                {cancelling && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Yes, cancel
              </motion.button>
              <button onClick={() => setConfirm(false)} className="rounded-lg border border-white/10 px-4 py-2 text-xs text-gray-400 hover:text-white">
                Keep plan
              </button>
            </div>
          )}
        </div>
      )}

      {/* Link to full pricing */}
      <a href="/pricing" className="block text-center text-xs text-gray-500 hover:text-[#c12129] transition">
        View all plans →
      </a>
    </div>
  );
}
