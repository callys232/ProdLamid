"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Lock } from "lucide-react";

interface EngineResultsGateProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

/**
 * Wraps engine result sections. Authenticated users see results; unauthenticated
 * visitors see a blurred preview with a signup prompt.
 */
export default function EngineResultsGate({ isAuthenticated, children }: EngineResultsGateProps) {
  if (isAuthenticated) return <>{children}</>;

  return (
    <div className="relative">
      {/* Blurred preview of results */}
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
                <Lock className="w-5 h-5 text-[#2563EB]" strokeWidth={1.75} />
              </div>

              <h3 className="text-lg font-bold text-white mb-2">
                Sign up to see your results
              </h3>
              <p className="text-sm text-white/50 leading-relaxed mb-7">
                Create a free Engine account to access AI insights, diagnostics, and recommendations across CORE, GROW, and TALENT.
              </p>

              <div className="flex flex-col gap-3">
                <Link
                  href="/signup"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-colors"
                >
                  Create free account
                </Link>
                <Link
                  href="/signin"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium text-sm border border-white/15 text-white/70 hover:border-white/30 hover:text-white transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
