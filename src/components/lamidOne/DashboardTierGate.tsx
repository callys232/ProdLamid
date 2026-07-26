"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Lock, ArrowUpRight, FlaskConical, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import DashboardAuthGate from "./DashboardAuthGate";

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS_GATE === "true";

interface Props {
  pillar: string;
  backHref: string;
  backLabel: string;
  children: React.ReactNode;
}

export default function DashboardTierGate({ pillar, backHref, backLabel, children }: Props) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [tier, setTier]         = useState<"checking" | "free" | "premium">("checking");
  const [bannerDismissed, setBannerDismissed] = useState(false);

  /* ── Dev bypass — skip all gates ── */
  if (DEV_BYPASS) {
    return (
      <>
        {!bannerDismissed && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-3 px-4 py-2.5 rounded-xl border border-amber-400/40 bg-amber-950/90 backdrop-blur-sm shadow-lg text-amber-300 text-xs font-medium">
            <FlaskConical className="w-3.5 h-3.5 shrink-0" />
            <span>Dev mode — all gates bypassed. Set <code className="font-mono bg-amber-900/60 px-1 rounded">NEXT_PUBLIC_DEV_BYPASS_GATE=false</code> before deploying.</span>
            <button type="button" aria-label="Dismiss dev banner" onClick={() => setBannerDismissed(true)} className="ml-1 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        {children}
      </>
    );
  }

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { setTier("free"); return; }

    fetch("/api/auth/me", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        const u = d?.data;
        const hasTier =
          /* Explicit premium flag — accept boolean true or truthy number */
          (u?.isPremium === true || u?.isPremium === 1)
          || u?.subscriptionStatus === "active"
          /* Enterprise account types always have premium access */
          || ["Enterprise", "Concierge", "Admin"].includes(u?.accountType ?? "")
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
        <div className="w-14 h-14 rounded-2xl border border-[#2563EB]/25 bg-[#2563EB]/8 flex items-center justify-center mb-6">
          <Lock className="w-6 h-6 text-[#2563EB]" strokeWidth={2} />
        </div>
        <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">{pillar}</p>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Premium feature</h1>
        <p className="text-sm text-gray-500 dark:text-white/45 max-w-sm mb-8">
          Upgrade your account to access advanced intelligence dashboards.
        </p>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors shadow-[0_0_14px_rgba(37,99,235,0.35)] inline-flex items-center gap-1.5">
            Upgrade <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link href="/pricing" className="px-6 py-2.5 rounded-xl text-sm font-semibold border border-[#2563EB]/25 text-[#2563EB] hover:bg-[#2563EB]/8 transition-colors">
            View Plans
          </Link>
        </div>
        <Link href={backHref} className="text-xs text-gray-400 dark:text-white/30 hover:text-[#2563EB] transition-colors mt-8">
          ← {backLabel}
        </Link>
      </main>
    );
  }

  // Premium — render the page
  return <>{children}</>;
}
