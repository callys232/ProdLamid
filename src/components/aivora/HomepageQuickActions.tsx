"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const FREE_TOOLS = [
  { id: "diagnostic",   icon: "⚡", accent: "#b45309", title: "Business Diagnostic",  desc: "AI-powered health check across 7 business dimensions — free, instant results.", href: "/premium/business-diagnostic" },
  { id: "bizprototype", icon: "⬡", accent: "#2563eb", title: "Biz Prototypes",        desc: "Explore startup methodology, frameworks, and rapid build tools.",                href: "/bizprototype" },
  { id: "talent",       icon: "◈", accent: "#C12129", title: "Browse Consultants",    desc: "Search AIVORA's verified talent marketplace across every industry.",            href: "/talent" },
  { id: "jobs",         icon: "▣", accent: "#d97706", title: "Job Board",             desc: "Explore open roles — contract, permanent, and short-term.",                      href: "/jobs" },
  { id: "events",       icon: "✦", accent: "#7c3aed", title: "Events & Training",     desc: "Browse upcoming Talent Development events, workshops, and training programs.",   href: "/events" },
  { id: "estimator",    icon: "▣", accent: "#eab308", title: "Budget Estimator",      desc: "AI-assisted project cost & timeline estimator — plan before you post.",          href: "/postjobs?tool=estimator" },
  { id: "learning",     icon: "⬡", accent: "#ea580c", title: "Learning Platform",     desc: "Training, workshops, and certifications via the AIVORA Learning hub.",           href: "https://learn-by-lamid.vercel.app/", external: true },
  { id: "biz",          icon: "◈", accent: "#4f46e5", title: "BIZ Portal",            desc: "Startup toolkits, growth diagnostics, and innovation coaching resources.",       href: "/biz" },
  { id: "hcd",          icon: "⬟", accent: "#f97316", title: "Talent Development",    desc: "Recruitment, capability building, and leadership development programs.",          href: "/hcd" },
];

const toolStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const toolCard = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function HomepageQuickActions() {
  const [showFreeTools, setShowFreeTools] = useState(false);
  const [hoveredTool,   setHoveredTool]   = useState<string | null>(null);
  const { isAuthenticated, loading }      = useAuth();
  const router                            = useRouter();

  return (
    <>
      {/* ── Three action buttons ── */}
      <div className="aivora-section py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-3 relative z-10">

          <Link
            href="/biz"
            className="flex-1 text-center cursor-pointer border border-white/20 bg-white/5 hover:bg-[#C12129] hover:border-[#C12129] text-white font-medium text-sm px-5 py-3 rounded-xl transition-all duration-300 hover:text-white"
          >
            Build Right — Avoid costly trial and error
          </Link>

          <button
            type="button"
            onClick={() => setShowFreeTools(true)}
            className="flex-1 cursor-pointer border border-white/20 bg-white/5 hover:bg-[#C12129] hover:border-[#C12129] text-white font-medium text-sm px-5 py-3 rounded-xl transition-all duration-300 hover:text-white"
          >
            FREE TOOLS
          </button>

          <button
            type="button"
            onClick={() => router.push(!loading && isAuthenticated ? "/premium/business-diagnostic" : "/signup")}
            className="flex-1 cursor-pointer border border-white/20 bg-white/5 hover:bg-[#C12129] hover:border-[#C12129] text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all duration-300 hover:text-white"
          >
            Get Started — FREE Diagnostics
          </button>

        </div>
      </div>

      {/* ── Free Tools Modal ── */}
      <AnimatePresence>
        {showFreeTools && (
          <motion.div
            key="ft-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/85 backdrop-blur-sm px-4"
            onClick={() => setShowFreeTools(false)}
          >
            <motion.div
              key="ft-panel"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
            >
              <div className="h-[3px] bg-gradient-to-r from-[#C12129] to-transparent" />
              <div className="px-6 pt-6 pb-7">
                <button
                  type="button"
                  onClick={() => setShowFreeTools(false)}
                  className="absolute top-5 right-5 text-white/30 hover:text-white transition text-xl leading-none cursor-pointer"
                >
                  ✕
                </button>
                <p className="text-[#C12129] text-[10px] tracking-[0.3em] uppercase font-bold mb-1">
                  No credit card needed
                </p>
                <h2 className="text-xl font-bold text-white mb-1">Free Tools</h2>
                <p className="text-white/45 text-xs mb-6 leading-snug">
                  {isAuthenticated
                    ? "Jump straight in — all tools open directly."
                    : "Create a free account to unlock full access."}
                </p>
                <div className="h-px bg-white/8 mb-5" />
                <motion.div
                  variants={toolStagger}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
                >
                  {FREE_TOOLS.map((tool) => {
                    const isHov = hoveredTool === tool.id;
                    const dest  = tool.href;
                    return (
                      <motion.div key={tool.id} variants={toolCard}>
                        <Link
                          href={dest}
                          target={(tool as any).external && isAuthenticated ? "_blank" : undefined}
                          rel={(tool as any).external && isAuthenticated ? "noopener noreferrer" : undefined}
                          onClick={() => setShowFreeTools(false)}
                          onMouseEnter={() => setHoveredTool(tool.id)}
                          onMouseLeave={() => setHoveredTool(null)}
                          className="group relative flex items-start gap-3 p-4 rounded-xl border bg-white/[0.025] hover:bg-white/[0.06] transition-colors duration-200 overflow-hidden cursor-pointer"
                          style={{ borderColor: isHov ? `${tool.accent}55` : "rgba(255,255,255,0.07)" }}
                        >
                          <motion.div
                            className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
                            style={{ background: tool.accent }}
                            initial={{ scaleY: 0, originY: 0 }}
                            animate={{ scaleY: isHov ? 1 : 0 }}
                            transition={{ duration: 0.18 }}
                          />
                          <motion.span
                            className="text-lg shrink-0 mt-0.5"
                            style={{ color: tool.accent }}
                            animate={{ scale: isHov ? 1.2 : 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 18 }}
                          >
                            {tool.icon}
                          </motion.span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white leading-tight">{tool.title}</p>
                            <p className="text-white/75 text-xs mt-0.5 leading-snug">{tool.desc}</p>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
                {/* Sign up prompt shown only at results/download stage — not here */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
