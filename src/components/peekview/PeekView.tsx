"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Layers, Lock } from "lucide-react";
import ToolCard, { TOOLS } from "./ToolCard";
import { useAuth } from "@/hooks/useAuth";

const ENTERPRISE_TYPES = ["Enterprise", "Concierge", "Admin"];

type Tier = "free" | "member" | "premium" | "enterprise";

function resolveTier(accountType?: string, isPremium?: boolean, subscriptionStatus?: string, role?: string): Tier {
  if (ENTERPRISE_TYPES.includes(accountType ?? "") || role === "admin") return "enterprise";
  if (isPremium || subscriptionStatus === "active") return "premium";
  return "member";
}

/* ── PeekView navbar dropdown ────────────────────────────────── */
export default function PeekView() {
  const [open, setOpen]   = useState(false);
  const [tier, setTier]   = useState<Tier>("free");
  const ref               = useRef<HTMLDivElement>(null);
  const router            = useRouter();
  const { user }          = useAuth();

  /* Close on outside click / Escape */
  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onMouse);
    document.addEventListener("keydown",   onKey);
    return () => {
      document.removeEventListener("mousedown", onMouse);
      document.removeEventListener("keydown",   onKey);
    };
  }, []);

  /* Resolve tier whenever dropdown opens */
  useEffect(() => {
    if (!open) return;
    if (!user) { setTier("free"); return; }

    /* Enterprise account types don't need an API call */
    if (ENTERPRISE_TYPES.includes(user.accountType ?? "") || user.role === "admin") {
      setTier("enterprise");
      return;
    }

    /* For non-enterprise logged-in users, check subscription status */
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(u => setTier(resolveTier(u?.accountType, u?.isPremium, u?.subscriptionStatus, u?.role)))
      .catch(() => setTier("member"));
  }, [open, user]);

  /* Filter tools by current tier */
  const visibleTools = TOOLS.filter(t => {
    if (t.enterprise) return tier === "enterprise";
    if (t.premium)    return tier === "premium" || tier === "enterprise";
    if (t.member)     return tier === "member" || tier === "premium" || tier === "enterprise";
    return true; // free tools always visible
  });

  const handleToolClick = (tool: typeof TOOLS[0]) => {
    setOpen(false);

    if (tool.enterprise) {
      if (tier === "enterprise") {
        window.open(tool.href, "_blank", "noopener,noreferrer");
      } else {
        router.push("/pricing?plan=enterprise");
      }
      return;
    }

    if (tool.premium) {
      if (tier === "premium" || tier === "enterprise") {
        router.push(tool.href);
      } else if (tier === "member") {
        router.push("/pricing");
      } else {
        router.push("/signup");
      }
      return;
    }

    if (tool.member) {
      if (tier !== "free") {
        router.push(tool.href);
      } else {
        router.push("/signup");
      }
      return;
    }

    /* Free tools — open for everyone */
    if (tool.external) {
      window.open(tool.href, "_blank", "noopener,noreferrer");
    } else {
      router.push(tool.href);
    }
  };

  /* Tier label for footer */
  const tierLabels: Record<Tier, string> = {
    free:       "Sign in to unlock member & premium tools",
    member:     "Upgrade to see premium intelligence tools",
    premium:    "Premium member — full tool access",
    enterprise: "Enterprise — all tools unlocked",
  };

  return (
    <div ref={ref} className="relative">

      {/* Trigger */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        whileTap={{ scale: 0.88 }}
        aria-label="Explore platform tools"
        aria-expanded={open}
        className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all
          ${open
            ? "text-white bg-white/12 border border-white/15"
            : "text-gray-400 hover:text-white hover:bg-white/6 border border-transparent"
          }`}
      >
        <Layers className="w-4 h-4" />
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.33, 1, 0.68, 1] as const }}
            className="absolute right-0 top-full mt-2 w-80 bg-[#0b0b0b] border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/8">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#2563EB]/20 border border-[#2563EB]/30 flex-shrink-0">
                <span className="text-[10px] font-black text-[#2563EB] leading-none">L</span>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-white leading-none">LAMID Platform</p>
                <p className="text-[9px] text-white/45 mt-0.5">Quick access</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(false)}
                className="ml-auto text-white/45 hover:text-gray-400 transition-colors text-xs leading-none"
                aria-label="Close"
              >
                ✕
              </motion.button>
            </div>

            {/* Free tools section */}
            <div className="px-3 pt-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/45 mb-2 px-1">Free Tools</p>
              <div className="grid grid-cols-3 gap-2">
                {visibleTools.filter(t => !t.member && !t.premium && !t.enterprise).map((tool, i) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.18, ease: [0.33, 1, 0.68, 1] as const }}
                  >
                    <ToolCard tool={tool} onClick={() => handleToolClick(tool)} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Member / Premium / Enterprise tools */}
            {(tier === "member" || tier === "premium" || tier === "enterprise") && (
              <div className="px-3 pt-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/45 mb-2 px-1">Your Tools</p>
                <div className="grid grid-cols-3 gap-2">
                  {visibleTools.filter(t => t.member || t.premium || t.enterprise).map((tool, i) => (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, scale: 0.88 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04, duration: 0.18, ease: [0.33, 1, 0.68, 1] as const }}
                    >
                      <ToolCard tool={tool} onClick={() => handleToolClick(tool)} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Upsell hint when free or member tier */}
            {(tier === "free" || tier === "member") && (
              <div className="mx-3 mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/6">
                <Lock className="w-3 h-3 text-white/45 shrink-0" />
                <p className="text-[9px] text-white/45 leading-snug">{tierLabels[tier]}</p>
              </div>
            )}

            {/* Footer */}
            <div className="px-4 py-2.5 mt-3 border-t border-white/8 flex items-center justify-between">
              <p className="text-[9px] text-white/45">One Ecosystem. Every Layer of Impact.</p>
              <div className="flex gap-1">
                {visibleTools.map(t => (
                  <div
                    key={t.id}
                    className="h-1 w-1 rounded-full opacity-40"
                    style={{ backgroundColor: t.accentHex }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Re-export so existing imports from PeekView still work */
export { TOOLS };
export function LIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <rect x="2"  y="2"  width="7" height="7" rx="1.5" />
      <rect x="2"  y="11" width="7" height="7" rx="1.5" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" />
    </svg>
  );
}
