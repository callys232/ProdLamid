"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import GetDignostics from "../forms/diagnostics/GetDiagnostic";
import EcosystemTag from "@/components/EcosystemTag";
import StartupEcosystemBoard from "@/components/biz/StartupEcosystemBoard";
import { useAuth } from "@/hooks/useAuth";
import AOS from "aos";
import "aos/dist/aos.css";

const FREE_TOOLS = [
  {
    id: "diagnostic",
    icon: "⚡",
    accent: "#b45309",
    title: "Business Diagnostic",
    desc: "AI-powered health check for your business — free, instant results.",
    href: "/premium/business-diagnostic",
  },
  {
    id: "bizprototype",
    icon: "⬡",
    accent: "#2563eb",
    title: "Biz Prototypes",
    desc: "Explore startup methodology, frameworks, and rapid build tools.",
    href: "/bizprototype",
  },
  {
    id: "talent",
    icon: "◈",
    accent: "#C12129",
    title: "Browse Consultants",
    desc: "Search LAMID's verified talent marketplace across every industry.",
    href: "/talent",
  },
  {
    id: "jobs",
    icon: "▣",
    accent: "#d97706",
    title: "Job Board",
    desc: "Explore open roles — contract, permanent, and short-term.",
    href: "/jobs",
  },
  {
    id: "events",
    icon: "✦",
    accent: "#7c3aed",
    title: "Events & Training",
    desc: "Browse upcoming HCD events, workshops, and training programs.",
    href: "/events",
  },
  {
    id: "sd",
    icon: "⬟",
    accent: "#16a34a",
    title: "Sustainability Hub",
    desc: "Community advancement tools and development resources.",
    href: "/sustainableDev",
  },
];

const toolStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const toolCard = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.33, 1, 0.68, 1] },
});

const BusinessInnovationZone = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showFreeTools, setShowFreeTools] = useState(false);
  const [hoveredTool, setHoveredTool] = useState(null);
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <div className="bg-black text-white pt-6 pb-6 px-3 sm:px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* BIZ Header — clicking navigates to the full BIZ page */}
        <Link href="/bizphere" className="block group mb-4">
          <motion.div
            {...fadeUp(0.1)}
            className="relative flex flex-col md:flex-row items-center md:items-start gap-6 p-5 pt-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm cursor-pointer group-hover:border-white/25 group-hover:bg-white/[0.08] transition-all duration-300"
          >
            <div className="absolute top-3 right-5">
              <EcosystemTag className="!mt-0 scale-90 origin-right" />
            </div>
            {/* BIZ Logo */}
            <div className="border border-blue-500/60 rounded-xl p-4 flex-shrink-0 group-hover:border-blue-400 group-hover:bg-blue-500/10 transition duration-300">
              <Image
                src="/biz-icon.png"
                alt="BIZ Logo"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>

            {/* BIZ Text */}
            <div className="flex flex-col justify-center w-full">
              <h2 className="text-3xl md:text-4xl font-bold text-left animate-rainbowPulse drop-shadow-md mb-3">
                Business Innovation Zone
              </h2>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed text-left">
                The one-stop place that rapidly nurtures and expands startups to
                deliver exceptional value — through digitalized, client-centered
                systems and processes.
              </p>
            </div>
          </motion.div>
        </Link>
        <motion.p
          className="text-sm md:text-base italic text-center mt-2 mb-6 cursor-default select-none"
          animate={{ color: ["#ffffff", "#9ca3af", "#ffffff"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.02, color: "#ffffff" }}
        >
          We help Organizations continously innovate around the client and adapt
          to the digital age for efficiency and competitiveness.
        </motion.p>
        {/* BEST Section */}
        <motion.div {...fadeUp(0.2)} className="mb-4">
          <div className="rounded-2xl border border-amber-500/50 bg-amber-900/10 p-5 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-amber-900/20 transition duration-300">
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-semibold text-left leading-snug">
                <span className="animate-rainbowPulse drop-shadow-[0_0_2px_cyan]">
                  B
                </span>
                usiness{" "}
                <span className="animate-rainbowPulse drop-shadow-[0_0_2px_cyan]">
                  E
                </span>
                xpansion{" "}
                <span className="animate-rainbowPulse drop-shadow-[0_0_2px_cyan]">
                  S
                </span>
                trategy &{" "}
                <span className="animate-rainbowPulse drop-shadow-[0_0_2px_cyan]">
                  T
                </span>
                echnology
                {" — "}
                <span className="animate-glitchPulse [animation-delay:0.6s] text-amber-400 font-bold">
                  BEST
                </span>{" "}
                — our all-in-one growth toolbox
              </h3>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed text-left mt-3">
                A portfolio of simple, easy-to-use Human-AI assisted management
                know-how that delivers sustainable growth
              </p>
              <p>
                by executing a lean plan on digitalized, client-centered systems
                and processes.
              </p>
            </div>
            <div className="flex-shrink-0 hover:scale-110 transition duration-300">
              <Image
                src="/best-icon.png"
                alt="BEST Icon"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          </div>
        </motion.div>

        {/* Startup Ecosystem Board */}
        <motion.div
          {...fadeUp(0.3)}
          className="mb-4 rounded-2xl overflow-hidden border border-white/10"
        >
          <StartupEcosystemBoard />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          {...fadeUp(0.4)}
          className="flex flex-col sm:flex-row gap-3 px-1"
        >
          <button className="flex-1 border border-white/20 bg-white/5 hover:bg-[#c21219] hover:border-[#c21219] text-white font-medium text-sm md:text-base px-5 py-3 rounded-xl transition duration-300">
            Build Right — Avoid costly trial and error
          </button>
          <button
            type="button"
            onClick={() => setShowFreeTools(true)}
            className="flex-1 border border-white/20 bg-white/5 hover:bg-[#C12129] hover:border-[#C12129] text-white font-medium text-sm md:text-base px-5 py-3 rounded-xl transition duration-300"
          >
            FREE TOOLS
          </button>
          <button
            onClick={() => setShowPopup(true)}
            className="flex-1 border border-white/20 bg-white/5 hover:bg-[#c21219] hover:border-[#c21219] text-white font-semibold text-sm md:text-base px-5 py-3 rounded-xl transition duration-300"
          >
            Get Started — FREE Diagnostics
          </button>
        </motion.div>
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
              className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              {/* Red top accent */}
              <div className="h-[3px] bg-gradient-to-r from-[#C12129] to-transparent" />

              <div className="px-6 pt-6 pb-7">
                {/* Header */}
                <button
                  type="button"
                  onClick={() => setShowFreeTools(false)}
                  className="absolute top-5 right-5 text-white/30 hover:text-white transition text-xl leading-none"
                >
                  ✕
                </button>

                <p className="text-[#C12129] text-[10px] tracking-[0.3em] uppercase font-bold mb-1">
                  No credit card needed
                </p>
                <h2 className="text-xl font-bold text-white mb-1">
                  Free Tools
                </h2>
                <p className="text-white/45 text-xs mb-6 leading-snug">
                  {isAuthenticated
                    ? "Jump straight in — all tools open directly."
                    : "Create a free account to unlock full access."}
                </p>

                <div className="h-px bg-white/8 mb-5" />

                {/* Tool Cards */}
                <motion.div
                  variants={toolStagger}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
                >
                  {FREE_TOOLS.map((tool) => {
                    const isHov = hoveredTool === tool.id;
                    const dest =
                      isAuthenticated || loading ? tool.href : "/signup";

                    return (
                      <motion.div key={tool.id} variants={toolCard}>
                        <Link
                          href={dest}
                          onClick={() => setShowFreeTools(false)}
                          onMouseEnter={() => setHoveredTool(tool.id)}
                          onMouseLeave={() => setHoveredTool(null)}
                          className="group relative flex items-start gap-3 p-4 rounded-xl border bg-white/[0.025] hover:bg-white/[0.06] transition-colors duration-200 overflow-hidden"
                          style={{
                            borderColor: isHov
                              ? `${tool.accent}55`
                              : "rgba(255,255,255,0.07)",
                          }}
                        >
                          {/* Left accent bar */}
                          <motion.div
                            className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
                            style={{ background: tool.accent }}
                            initial={{ scaleY: 0, originY: 0 }}
                            animate={{ scaleY: isHov ? 1 : 0 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                          />

                          {/* Glow */}
                          <motion.div
                            className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl pointer-events-none"
                            style={{ background: tool.accent }}
                            animate={{ opacity: isHov ? 0.12 : 0 }}
                            transition={{ duration: 0.25 }}
                          />

                          {/* Icon */}
                          <motion.span
                            className="text-lg shrink-0 mt-0.5"
                            style={{ color: tool.accent }}
                            animate={{
                              scale: isHov ? 1.22 : 1,
                              rotate: isHov ? 8 : 0,
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 18,
                            }}
                          >
                            {tool.icon}
                          </motion.span>

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white leading-tight">
                              {tool.title}
                            </p>
                            <p className="text-white/45 text-xs mt-0.5 leading-snug">
                              {tool.desc}
                            </p>
                            {!isAuthenticated && !loading && (
                              <motion.p
                                className="text-[10px] mt-1 font-medium"
                                style={{ color: tool.accent }}
                                animate={{
                                  opacity: isHov ? 1 : 0,
                                  y: isHov ? 0 : 4,
                                }}
                                transition={{ duration: 0.15 }}
                              >
                                Sign up to access →
                              </motion.p>
                            )}
                          </div>

                          {/* Arrow */}
                          <motion.span
                            className="shrink-0 self-center text-xs"
                            style={{ color: tool.accent }}
                            animate={{
                              opacity: isHov ? 1 : 0,
                              x: isHov ? 0 : -5,
                            }}
                            transition={{ duration: 0.15 }}
                          >
                            →
                          </motion.span>

                          {/* Bottom sweep */}
                          <motion.div
                            className="absolute bottom-0 left-0 h-[2px] rounded-b-xl"
                            style={{
                              background: `linear-gradient(to right, ${tool.accent}, transparent)`,
                            }}
                            animate={{ width: isHov ? "100%" : "0%" }}
                            transition={{ duration: 0.28, ease: "easeOut" }}
                          />
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Footer CTA for non-auth */}
                {!isAuthenticated && !loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-5 flex gap-2.5"
                  >
                    <Link
                      href="/signup"
                      onClick={() => setShowFreeTools(false)}
                      className="flex-1 text-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#C12129] text-white hover:bg-[#a01a20] transition-colors"
                    >
                      Create Free Account
                    </Link>
                    <Link
                      href="/signin"
                      onClick={() => setShowFreeTools(false)}
                      className="flex-1 text-center px-4 py-2.5 rounded-lg text-sm font-semibold border border-white/15 text-white/60 hover:text-white hover:border-white/40 transition-colors"
                    >
                      Sign In
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diagnostics Modal */}
      {showPopup && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black/70 backdrop-blur-md z-[999999]"
          onClick={() => setShowPopup(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="bg-[#0d0d0d] rounded-2xl shadow-2xl border border-white/10 w-[90%] sm:w-[70%] md:w-[50%] max-h-[70vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition text-xl"
            >
              ✕
            </button>
            <GetDignostics closeModal={() => setShowPopup(false)} />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BusinessInnovationZone;
