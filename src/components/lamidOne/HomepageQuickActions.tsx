"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const FREE_TOOLS = [
  { id: "diagnostic",   icon: "⚡", accent: "#b45309", title: "Business Diagnostic",  desc: "AI-powered health check across 7 business dimensions — free, instant results.", href: "/premium/business-diagnostic" },
  { id: "proposal",     icon: "◈", accent: "#2563EB", title: "Proposal Drafter",      desc: "Generate a client-ready consulting proposal in seconds.",                         href: "/premium/proposal-drafter" },
  { id: "bizprototype", icon: "⬡", accent: "#2563eb", title: "Biz Prototypes",        desc: "Explore startup methodology, frameworks, and rapid build tools.",                 href: "/bizprototype" },
  { id: "talent",       icon: "◈", accent: "#2563EB", title: "Browse Consultants",    desc: "Search Lamid Core's verified talent marketplace across every industry.",             href: "/talent" },
  { id: "jobs",         icon: "▣", accent: "#d97706", title: "Job Board",             desc: "Explore open roles — contract, permanent, and short-term.",                       href: "/jobs" },
  { id: "events",       icon: "✦", accent: "#7c3aed", title: "Events & Training",     desc: "Browse upcoming Talent Development events, workshops, and training programs.",    href: "/events" },
  { id: "estimator",    icon: "▣", accent: "#eab308", title: "Budget Estimator",      desc: "AI-assisted project cost & timeline estimator — plan before you post.",           href: "/postjobs?tool=estimator" },
  { id: "biz",          icon: "◈", accent: "#4f46e5", title: "BIZ Portal",            desc: "Startup toolkits, growth diagnostics, and innovation coaching resources.",        href: "/biz" },
  { id: "hcd",          icon: "⬟", accent: "#f97316", title: "Talent Development",    desc: "Recruitment, capability building, and leadership development programs.",           href: "/hcd" },
];

const toolStagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } } };
const toolCard    = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } } };

export default function HomepageQuickActions() {
  const [showTools,  setShowTools]  = useState(false);
  const [hoveredId,  setHoveredId]  = useState<string | null>(null);
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

      {/* Free Tools Modal */}
      <AnimatePresence>
        {showTools && (
          <motion.div
            key="ft-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/85 backdrop-blur-sm px-4"
            onClick={() => setShowTools(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
            >
              <div className="h-[3px] bg-gradient-to-r from-[#2563EB] to-transparent" />
              <div className="px-6 pt-6 pb-7">
                <button type="button" onClick={() => setShowTools(false)}
                  className="absolute top-5 right-5 text-white/30 hover:text-white transition text-xl leading-none cursor-pointer">
                  ✕
                </button>
                <p className="lamidone-gradient-text text-[10px] tracking-[0.3em] uppercase font-bold mb-1">No credit card needed</p>
                <h2 className="text-xl font-bold text-white mb-1">All Free Tools</h2>
                <p className="text-white/45 text-xs mb-6">Use any tool instantly. Sign up to save your results.</p>
                <div className="h-px bg-white/8 mb-5" />
                <motion.div variants={toolStagger} initial="hidden" animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {FREE_TOOLS.map((tool) => {
                    const isHov = hoveredId === tool.id;
                    return (
                      <motion.div key={tool.id} variants={toolCard}>
                        <Link href={tool.href} onClick={() => setShowTools(false)}
                          onMouseEnter={() => setHoveredId(tool.id)}
                          onMouseLeave={() => setHoveredId(null)}
                          className="group relative flex items-start gap-3 p-4 rounded-xl border bg-white/[0.025] hover:bg-white/[0.06] transition-colors duration-200 overflow-hidden cursor-pointer"
                          style={{ borderColor: isHov ? `${tool.accent}55` : "rgba(255,255,255,0.07)" }}
                        >
                          <motion.div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl origin-top"
                            animate={{ scaleY: isHov ? 1 : 0, backgroundColor: tool.accent }}
                            transition={{ duration: 0.18 }} />
                          <span className="text-lg shrink-0 mt-0.5 lamidone-gradient-text">{tool.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white leading-tight">{tool.title}</p>
                            <p className="text-white/75 text-xs mt-0.5 leading-snug">{tool.desc}</p>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
