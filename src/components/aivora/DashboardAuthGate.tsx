"use client";

import Link from "next/link";
import { Lock } from "lucide-react";

export default function DashboardAuthGate({
  pillar,
  backHref,
  backLabel,
}: {
  pillar: string;
  backHref: string;
  backLabel: string;
}) {
  return (
    <main className="aivora-section min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="w-14 h-14 rounded-2xl border border-[#2563EB]/25 bg-[#2563EB]/8 flex items-center justify-center mb-6">
        <Lock className="w-6 h-6 text-[#2563EB]" strokeWidth={2} />
      </div>
      <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">{pillar}</p>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Members only</h1>
      <p className="text-sm text-gray-500 dark:text-white/45 max-w-sm mb-8">
        Sign in to access your {pillar} dashboard.
      </p>
      <div className="flex items-center gap-3">
        <Link href="/signin" className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors shadow-[0_0_14px_rgba(37,99,235,0.35)]">
          Sign In
        </Link>
        <Link href="/signup" className="px-6 py-2.5 rounded-xl text-sm font-semibold border border-[#2563EB]/25 text-[#2563EB] hover:bg-[#2563EB]/8 transition-colors">
          Create Account
        </Link>
      </div>
      <Link href={backHref} className="text-xs text-gray-400 dark:text-white/30 hover:text-[#2563EB] transition-colors mt-8">
        ← {backLabel}
      </Link>
    </main>
  );
}
