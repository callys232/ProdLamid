"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Lock, Building2, Crown } from "lucide-react";
import { useGate, GateMode } from "@/contexts/GateContext";
import { currentReturnPath } from "@/lib/intelligence/pendingRun";

interface EngineResultsGateProps {
  children: React.ReactNode;
}

const GATE_CONTENT: Record<Exclude<GateMode, "full">, {
  icon: React.ElementType;
  heading: string;
  body: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}> = {
  "preview-auth": {
    icon: Lock,
    heading: "Sign up to see your results",
    body: "Create a free LAMID account to access AI insights, diagnostics, and recommendations across all four suites.",
    primaryLabel: "Create free account",
    primaryHref: "/signup",
    secondaryLabel: "Sign in",
    secondaryHref: "/signin",
  },
  "preview-tier": {
    icon: Lock,
    heading: "Upgrade to see your results",
    body: "This intelligence module requires a LAMID membership. Upgrade your plan to view AI insights, download reports, and access full analysis.",
    primaryLabel: "View plans",
    primaryHref: "/pricing",
    secondaryLabel: "Book a demo",
    secondaryHref: "/contact",
  },
  "preview-enterprise": {
    icon: Building2,
    heading: "Enterprise access required",
    body: "This module is exclusive to LAMID Enterprise clients. Contact our enterprise team to discuss access for your organisation.",
    primaryLabel: "Contact enterprise team",
    primaryHref: "/contact",
    secondaryLabel: "View plans",
    secondaryHref: "/pricing",
  },
  "preview-concierge": {
    icon: Crown,
    heading: "Concierge access required",
    body: "This module is exclusive to LAMID Concierge members. Reach out to learn more about Concierge membership.",
    primaryLabel: "Contact us",
    primaryHref: "/contact",
    secondaryLabel: "View plans",
    secondaryHref: "/pricing",
  },
};

/**
 * Wraps result sections. Members with the right tier see results; everyone else
 * sees a blurred preview with the appropriate gate prompt.
 */
/**
 * Sends the auth pages back where the user came from.
 *
 * Without this the gate was a one-way door: sign up, land on a dashboard, and
 * the analysis you were three clicks into is gone.
 */
function withReturn(href: string): string {
  if (!href.startsWith("/signin") && !href.startsWith("/signup")) return href;
  const back = currentReturnPath();
  return back === "/" ? href : `${href}?next=${encodeURIComponent(back)}`;
}

export default function EngineResultsGate({ children }: EngineResultsGateProps) {
  const { mode } = useGate();

  if (mode === "full") return <>{children}</>;

  const gate = GATE_CONTENT[mode];
  const Icon = gate.icon;

  return (
    <div className="relative">
      {/* Blurred preview */}
      <div className="pointer-events-none select-none blur-[6px] opacity-40" aria-hidden="true">
        {children}
      </div>

      {/* Gate overlay */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center px-4"
        >
          <div className="relative w-full max-w-sm rounded-2xl border border-[#2563EB]/30 bg-black/80 backdrop-blur-xl p-8 text-center shadow-[0_0_60px_rgba(37,99,235,0.18)]">
            {/* Glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#2563EB]/8 to-transparent pointer-events-none" />

            <div className="relative z-10">
              <div className="mx-auto mb-5 w-12 h-12 rounded-xl flex items-center justify-center border border-[#2563EB]/30 bg-[#2563EB]/10">
                <Icon className="w-5 h-5 text-[#2563EB]" strokeWidth={1.75} />
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{gate.heading}</h3>
              <p className="text-sm text-white/50 leading-relaxed mb-7">{gate.body}</p>

              <div className="flex flex-col gap-3">
                <Link
                  href={withReturn(gate.primaryHref)}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors"
                >
                  {gate.primaryLabel}
                </Link>
                <Link
                  href={withReturn(gate.secondaryHref)}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium text-sm border border-white/15 text-white/70 hover:border-white/30 hover:text-white transition-colors"
                >
                  {gate.secondaryLabel}
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
