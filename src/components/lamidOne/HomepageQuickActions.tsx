"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import FreeToolsModal from "./FreeToolsModal";

export default function HomepageQuickActions() {
  const [showTools, setShowTools] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const btnCls = "flex-1 cursor-pointer border border-white/20 bg-white/5 hover:bg-[#2563EB] hover:border-[#2563EB] text-white font-medium text-sm px-6 py-4 rounded-xl transition-all duration-300 hover:text-white";

  return (
    <>
      <div className="lamidone-section py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4 relative z-10">
          <Link href="/biz" className={btnCls}>
            Build Right — Avoid costly trial and error
          </Link>
          <button type="button" onClick={() => setShowTools(true)} className={btnCls}>
            FREE TOOLS
          </button>
          <button
            type="button"
            onClick={() => router.push(!loading && isAuthenticated ? "/premium/business-diagnostic" : "/signup")}
            className={`${btnCls} font-semibold`}
          >
            Get Started — FREE Diagnostics
          </button>
        </div>
      </div>

      {/* The free intelligence tools, grouped by the suite each belongs to —
          the same browser the ecosystem section opens, so both entry points
          show one consistent catalogue. */}
      <FreeToolsModal open={showTools} onClose={() => setShowTools(false)} />
    </>
  );
}
