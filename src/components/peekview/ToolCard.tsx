"use client";

import { motion } from "framer-motion";

export interface Tool {
  id:            string;
  name:          string;
  description:   string;
  icon:          string;
  fallbackEmoji: string;
  href:          string;
  accent:        string;        // tailwind color token e.g. "yellow"
  accentHex:     string;        // raw hex for glow/border
  badge:         string;
  badgeColor:    string;
}

interface ToolCardProps {
  tool:    Tool;
  onClick: () => void;
}

export default function ToolCard({ tool, onClick }: ToolCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -3, boxShadow: `0 8px 20px ${tool.accentHex}30` }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.15 }}
      className="w-full flex flex-col items-center text-center rounded-xl py-3 px-1.5 gap-2 border border-transparent hover:border-white/8 transition-colors group"
      style={{ backgroundColor: `${tool.accentHex}0d` }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-center w-10 h-10 rounded-xl border overflow-hidden transition-transform group-hover:scale-110"
        style={{
          backgroundColor: `${tool.accentHex}20`,
          borderColor:     `${tool.accentHex}45`,
        }}
      >
        <img
          src={tool.icon}
          alt={tool.name}
          className="w-6 h-6 object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
            const fb = (e.target as HTMLImageElement).nextSibling as HTMLElement | null;
            if (fb) fb.classList.remove("hidden");
          }}
        />
        <span className="hidden text-xl leading-none">{tool.fallbackEmoji}</span>
      </div>

      {/* Name */}
      <p className="text-[10px] font-semibold text-white leading-tight line-clamp-2 w-full">
        {tool.name}
      </p>

      {/* Badge */}
      <span
        className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
        style={{ color: tool.accentHex, backgroundColor: `${tool.accentHex}25` }}
      >
        {tool.badge}
      </span>
    </motion.button>
  );
}

/* ── Tools data ──────────────────────────────────────────────── */
export const TOOLS: Tool[] = [
  {
    id:            "estimator",
    name:          "Budget Estimator",
    description:   "AI-powered project cost & timeline",
    icon:          "/pt-dollar-icon.png",
    fallbackEmoji: "💰",
    href:          "/postjobs?tool=estimator",
    accent:        "yellow",
    accentHex:     "#eab308",
    badge:         "Free",
    badgeColor:    "bg-emerald-500/20 text-emerald-400",
  },
  {
    id:            "learning",
    name:          "Lamid Learning",
    description:   "Training, workshops & certifications",
    icon:          "/hcdLogo.png",
    fallbackEmoji: "📘",
    href:          "/hcd",
    accent:        "orange",
    accentHex:     "#f97316",
    badge:         "HCD",
    badgeColor:    "bg-orange-500/20 text-orange-400",
  },
  {
    id:            "matcher",
    name:          "AI Matcher",
    description:   "Match projects with vetted consultants",
    icon:          "/bizLogo.png",
    fallbackEmoji: "🧠",
    href:          "/jobs",
    accent:        "blue",
    accentHex:     "#3b82f6",
    badge:         "AI",
    badgeColor:    "bg-blue-500/20 text-blue-400",
  },
  {
    id:            "proposal",
    name:          "Proposal Drafter",
    description:   "AI consulting proposals in seconds",
    icon:          "/pt-target-icon.png",
    fallbackEmoji: "📝",
    href:          "/premium/proposal-drafter",
    accent:        "red",
    accentHex:     "#c21219",
    badge:         "Premium",
    badgeColor:    "bg-[#c21219]/20 text-[#c21219]",
  },
  {
    id:            "files",
    name:          "File System",
    description:   "Secure document sharing & storage",
    icon:          "/pt-calendar-icon.png",
    fallbackEmoji: "📁",
    href:          "/profile?tab=files",
    accent:        "purple",
    accentHex:     "#a855f7",
    badge:         "Workspace",
    badgeColor:    "bg-purple-500/20 text-purple-400",
  },
  {
    id:            "diagnostics",
    name:          "Business Diagnostic",
    description:   "AI health check for your organisation",
    icon:          "/biz-icon.png",
    fallbackEmoji: "🔬",
    href:          "/biz",
    accent:        "emerald",
    accentHex:     "#10b981",
    badge:         "BIZ",
    badgeColor:    "bg-emerald-500/20 text-emerald-400",
  },
];
