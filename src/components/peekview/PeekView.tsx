"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import ToolCard, { TOOLS } from "./ToolCard";

/* ── L-shaped icon ───────────────────────────────────────────── */
export function LIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <rect x="2"  y="2"  width="7" height="7" rx="1.5" />
      <rect x="2"  y="11" width="7" height="7" rx="1.5" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" />
    </svg>
  );
}

/* ── PeekView navbar dropdown ────────────────────────────────── */
export default function PeekView() {
  const [open, setOpen] = useState(false);
  const ref  = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onMouse);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouse);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <motion.button
        onClick={() => setOpen(v => !v)}
        whileTap={{ scale: 0.9 }}
        aria-label="Explore platform tools"
        aria-expanded={open}
        className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors
          ${open ? "text-white bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
      >
        <LIcon className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.33, 1, 0.68, 1] as const }}
            className="absolute right-0 top-full mt-2 w-80 bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-xs font-bold text-white">Platform Tools</p>
              <p className="text-[10px] text-gray-500">Click any tool to open</p>
            </div>
            <div className="p-4 grid grid-cols-3 gap-3">
              {TOOLS.map(tool => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  compact
                  onClick={() => { setOpen(false); router.push(tool.href); }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
