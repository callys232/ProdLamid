"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Layers } from "lucide-react";
import ToolCard, { TOOLS } from "./ToolCard";

/* ── PeekView navbar dropdown ────────────────────────────────── */
export default function PeekView() {
  const [open, setOpen] = useState(false);
  const ref             = useRef<HTMLDivElement>(null);
  const router          = useRouter();

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
            className="absolute right-0 top-full mt-2 w-72 bg-[#0b0b0b] border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/8">
              {/* LAMID logo mark */}
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#c21219]/20 border border-[#c21219]/30 flex-shrink-0">
                <span className="text-[10px] font-black text-[#c21219] leading-none">L</span>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-white leading-none">LAMID Platform</p>
                <p className="text-[9px] text-gray-500 mt-0.5">Quick access</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(false)}
                className="ml-auto text-gray-600 hover:text-gray-400 transition-colors text-xs leading-none"
                aria-label="Close"
              >
                ✕
              </motion.button>
            </div>

            {/* Tool grid — 3 per row */}
            <div className="p-3 grid grid-cols-3 gap-2">
              {TOOLS.map((tool, i) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.18, ease: [0.33, 1, 0.68, 1] as const }}
                >
                  <ToolCard
                    tool={tool}
                    onClick={() => { setOpen(false); router.push(tool.href); }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-white/8 flex items-center justify-between">
              <p className="text-[9px] text-gray-600">One Ecosystem. Every Layer of Impact.</p>
              <div className="flex gap-1">
                {TOOLS.map(t => (
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
