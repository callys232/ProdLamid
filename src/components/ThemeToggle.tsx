"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <motion.button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to day mode" : "Switch to night mode"}
      whileTap={{ scale: 0.9 }}
      className="relative flex items-center justify-center w-8 h-8 rounded-lg border transition-colors duration-200 hover:border-[#C12129]/60"
      style={{
        borderColor: "var(--border-card)",
        background: "var(--bg-card)",
      }}
      title={isDark ? "Day mode" : "Night mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ opacity: 0, rotate: -20, scale: 0.7 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 20, scale: 0.7 }}
          transition={{ duration: 0.18 }}
          className="text-[14px] leading-none select-none"
          style={{ color: "var(--text-primary)" }}
        >
          {isDark ? "☀" : "🌙"}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
