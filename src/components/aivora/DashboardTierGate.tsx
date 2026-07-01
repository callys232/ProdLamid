"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Lock, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import DashboardAuthGate from "./DashboardAuthGate";

interface Props {
  pillar: string;
  backHref: string;
  backLabel: string;
  children: React.ReactNode;
}

export default function DashboardTierGate({ pillar, backHref, backLabel, children }: Props) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [tier, setTier]       = useState<"checking" | "free" | "premium">("checking");

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { setTier("free"); return; }

    fetch("/api/auth/me", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        const u = d?.data;
        const hasTier = u?.isPremium === true
          || u?.subscriptionStatus === "active"
          || u?.accountType === "Enterprise"
          || u?.accountType === "Admin"
          || u?.role === "admin";
        setTier(hasTier ? "premium" : "free");
      })
      .catch(() => setTier("free"));
  }, [isAuthenticated, authLoading]);

  // Loading
  if (authLoading || tier === "checking") return <main className="aivora-section min-h-screen" />;

  // Not logged in → sign in gate
  if (!isAuthenticated) return <DashboardAuthGate pillar={pillar} backHref={backHref} backLabel={backLabel} />;

  // Logged in but free tier → upgrade gate
  if (tier === "free") {
    return (
      <main className="aivora-section min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="w-14 h-14 rounded-2xl border border-[#C12129]/25 bg-[#C12129]/8 flex items-center justify-center mb-6">
          <Lock className="w-6 h-6 text-[#C12129]" strokeWidth={2} />
        </div>
        <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">{pillar}</p>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Premium feature</h1>
        <p className="text-sm text-gray-500 dark:text-white/45 max-w-sm mb-8">
          Upgrade your account to access advanced intelligence dashboards.
        </p>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#C12129] hover:bg-[#a01a20] transition-colors shadow-[0_0_14px_rgba(193,33,41,0.35)] inline-flex items-center gap-1.5">
            Upgrade <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link href="/pricing" className="px-6 py-2.5 rounded-xl text-sm font-semibold border border-[#C12129]/25 text-[#C12129] hover:bg-[#C12129]/8 transition-colors">
            View Plans
          </Link>
        </div>
        <Link href={backHref} className="text-xs text-gray-400 dark:text-white/30 hover:text-[#C12129] transition-colors mt-8">
          ← {backLabel}
        </Link>
      </main>
    );
  }

  // Premium — render the page
  return <>{children}</>;
}
