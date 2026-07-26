"use client";

import { useState, useEffect } from "react";
import { FlaskConical, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { GateProvider, GateMode } from "@/contexts/GateContext";

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS_GATE === "true";

type UserTier = "checking" | "free" | "premium" | "enterprise" | "concierge" | "admin";

interface Props {
  pillar: string;
  backHref: string;
  backLabel: string;
  children: React.ReactNode;
  /**
   * The minimum account tier required to access results on this tool.
   * Omit for free tools — any signed-in user can see results.
   *  "premium"    → Premium, Enterprise, Concierge, or Admin
   *  "enterprise" → Enterprise or Admin only
   *  "concierge"  → Concierge or Admin only
   */
  requiredTier?: "premium" | "enterprise" | "concierge";
}

function resolveMode(isAuthenticated: boolean, userTier: UserTier, requiredTier?: string): GateMode {
  // Non-members always hit the sign-up gate, regardless of tool type
  if (!isAuthenticated) return "preview-auth";

  // Admin bypasses every gate
  if (userTier === "admin") return "full";

  // No tier requirement — any signed-in user gets full access
  if (!requiredTier) return "full";

  if (requiredTier === "premium") {
    return ["premium", "enterprise", "concierge"].includes(userTier) ? "full" : "preview-tier";
  }

  if (requiredTier === "enterprise") {
    return userTier === "enterprise" ? "full" : "preview-enterprise";
  }

  if (requiredTier === "concierge") {
    return userTier === "concierge" ? "full" : "preview-concierge";
  }

  return "full";
}

export default function DashboardTierGate({ children, requiredTier }: Props) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [userTier, setUserTier]     = useState<UserTier>("checking");
  const [bannerDismissed, setBannerDismissed] = useState(false);

  /* ── Dev bypass — full access, no gates ── */
  if (DEV_BYPASS) {
    return (
      <GateProvider value={{ mode: "full" }}>
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
      </GateProvider>
    );
  }

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { setUserTier("free"); return; }

    fetch("/api/auth/me", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        const u = d?.data;
        if (u?.role === "admin") { setUserTier("admin"); return; }
        if (u?.accountType === "Enterprise") { setUserTier("enterprise"); return; }
        if (u?.accountType === "Concierge")  { setUserTier("concierge");  return; }
        const isPremium =
          (u?.isPremium === true || u?.isPremium === 1)
          || u?.subscriptionStatus === "active";
        setUserTier(isPremium ? "premium" : "free");
      })
      .catch(() => setUserTier("free"));
  }, [isAuthenticated, authLoading]);

  // Loading shell
  if (authLoading || userTier === "checking") return <main className="lamidone-section min-h-screen" />;

  const mode = resolveMode(isAuthenticated, userTier, requiredTier);
  return <GateProvider value={{ mode }}>{children}</GateProvider>;
}
