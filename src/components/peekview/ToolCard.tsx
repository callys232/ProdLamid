"use client";

import { motion } from "framer-motion";

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  fallbackEmoji: string;
  href: string;
  border: string;
  bg: string;
  hover: string;
  glow: string;
  badge: string;
  badgeColor: string;
}

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
  compact?: boolean; // smaller variant for navbar dropdown
}

export default function ToolCard({ tool, onClick, compact = false }: ToolCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04, y: -2, boxShadow: `0 8px 24px ${tool.glow}` }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.18 }}
      className={`relative flex flex-col items-center text-center rounded-xl border cursor-pointer group transition-colors
        ${tool.border} ${tool.bg} ${tool.hover}
        ${compact ? "p-4" : "p-5 rounded-2xl"}`}
    >
      {/* Badge */}
      <span className={`absolute top-1.5 right-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded-full ${tool.badgeColor}`}>
        {tool.badge}
      </span>

      {/* Icon */}
      <div className={`flex items-center justify-center bg-black/30 border border-white/10 group-hover:border-white/20 transition overflow-hidden
        ${compact ? "w-9 h-9 rounded-lg mb-2" : "w-12 h-12 rounded-xl mb-3"}`}>
        <img
          src={tool.icon}
          alt={tool.name}
          className={`object-contain ${compact ? "w-6 h-6" : "w-8 h-8"}`}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
            const sibling = (e.target as HTMLImageElement).nextSibling as HTMLElement | null;
            if (sibling) sibling.classList.remove("hidden");
          }}
        />
        <span className={`hidden ${compact ? "text-lg" : "text-2xl"}`}>{tool.fallbackEmoji}</span>
      </div>

      <p className={`font-semibold text-white leading-tight ${compact ? "text-[10px]" : "text-xs"}`}>
        {tool.name}
      </p>
      {!compact && (
        <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">{tool.description}</p>
      )}
    </motion.button>
  );
}

/* ── Shared tools data ───────────────────────────────────────── */
export const TOOLS: Tool[] = [
  {
    id: "estimator",
    name: "Budget Estimator",
    description: "AI-powered project budget & timeline estimation",
    icon: "/pt-dollar-icon.png",
    fallbackEmoji: "💰",
    href: "/postjobs?tool=estimator",
    border: "border-yellow-500",
    bg: "bg-yellow-500/10",
    hover: "hover:border-yellow-400 hover:bg-yellow-500/15",
    glow: "rgba(234,179,8,0.3)",
    badge: "Free",
    badgeColor: "bg-emerald-500/20 text-emerald-400",
  },
  {
    id: "learning",
    name: "Lamid Learning",
    description: "Training modules, workshops & certifications",
    icon: "/hcdLogo.png",
    fallbackEmoji: "📘",
    href: "/hcd",
    border: "border-orange-500",
    bg: "bg-orange-500/10",
    hover: "hover:border-orange-400 hover:bg-orange-500/15",
    glow: "rgba(249,115,22,0.3)",
    badge: "HCD",
    badgeColor: "bg-orange-500/20 text-orange-400",
  },
  {
    id: "matcher",
    name: "AI Matcher",
    description: "Instantly match projects with vetted consultants",
    icon: "/bizLogo.png",
    fallbackEmoji: "🧠",
    href: "/jobs",
    border: "border-blue-500",
    bg: "bg-blue-500/10",
    hover: "hover:border-blue-400 hover:bg-blue-500/15",
    glow: "rgba(59,130,246,0.3)",
    badge: "AI",
    badgeColor: "bg-blue-500/20 text-blue-400",
  },
  {
    id: "proposal",
    name: "Proposal Drafter",
    description: "AI-generated consulting proposals in seconds",
    icon: "/pt-target-icon.png",
    fallbackEmoji: "📝",
    href: "/premium/proposal-drafter",
    border: "border-[#c21219]",
    bg: "bg-[#c21219]/10",
    hover: "hover:border-[#c21219] hover:bg-[#c21219]/15",
    glow: "rgba(194,18,25,0.3)",
    badge: "Premium",
    badgeColor: "bg-[#c21219]/20 text-[#c21219]",
  },
  {
    id: "files",
    name: "File System",
    description: "Secure document sharing, storage & collaboration",
    icon: "/pt-calendar-icon.png",
    fallbackEmoji: "📁",
    href: "/profile?tab=files",
    border: "border-purple-500",
    bg: "bg-purple-500/10",
    hover: "hover:border-purple-400 hover:bg-purple-500/15",
    glow: "rgba(168,85,247,0.3)",
    badge: "Workspace",
    badgeColor: "bg-purple-500/20 text-purple-400",
  },
  {
    id: "diagnostics",
    name: "Business Diagnostic",
    description: "AI-powered health check for your organisation",
    icon: "/biz-icon.png",
    fallbackEmoji: "🔬",
    href: "/biz",
    border: "border-emerald-500",
    bg: "bg-emerald-500/10",
    hover: "hover:border-emerald-400 hover:bg-emerald-500/15",
    glow: "rgba(16,185,129,0.3)",
    badge: "BIZ",
    badgeColor: "bg-emerald-500/20 text-emerald-400",
  },
];
