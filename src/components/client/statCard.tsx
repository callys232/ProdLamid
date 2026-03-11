"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StatCardProps {
  value: string | number;
  label: string;
  details: string[];
}

export default function StatCard({ value, label, details }: StatCardProps) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const safeId = label.replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase();

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Focus first item on open
  useEffect(() => {
    if (open && itemsRef.current[0]) itemsRef.current[0].focus();
  }, [open]);

  // Focus trap
  useEffect(() => {
    if (!open) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = itemsRef.current.filter(Boolean) as HTMLElement[];
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
  };

  const handleItemKeyDown = (
    e: React.KeyboardEvent<HTMLLIElement>,
    idx: number
  ) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = itemsRef.current[idx + 1] || itemsRef.current[0];
      next?.focus();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev =
        itemsRef.current[idx - 1] ||
        itemsRef.current[itemsRef.current.length - 1];
      prev?.focus();
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        className="w-full bg-gray-800 rounded-lg p-4 text-center shadow-md
             hover:ring-2 hover:ring-red-500 hover:shadow-lg
             transition transform hover:scale-105 cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-expanded={Boolean(open)} // ✅ explicit boolean
        aria-controls={safeId} // ✅ sanitized valid ID
        aria-haspopup="true"
        aria-label={`${label} stat card`}
      >
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-gray-400">{label}</p>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={safeId}
            role="menu"
            aria-label={`${label} details`}
            initial={{ opacity: 0, y: isMobile ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isMobile ? 10 : -10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56
                       bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-10 text-left"
          >
            <ul role="menu" className="divide-y divide-gray-700">
              {details.map((item, idx) => (
                <li
                  key={idx}
                  ref={(el) => {
                    itemsRef.current[idx] = el;
                  }}
                  role="menuitem"
                  tabIndex={-1}
                  onKeyDown={(e) => handleItemKeyDown(e, idx)}
                  className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 focus:bg-gray-800 focus:outline-none transition"
                >
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
