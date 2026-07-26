"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const PILLARS = [
  {
    id: "acquisition",
    icon: "◈",
    number: "01",
    title: "Talent Acquisition Systems",
    tagline: "Attract the right people — consistently and predictably.",
    iconCls: "text-orange-400",
    openBorderCls: "border-orange-500/35",
    closedBorderCls: "border-white/8",
    expandBorderCls: "border-orange-500/20",
    dotCls: "bg-orange-400",
    ctaColorCls: "text-orange-400",
    items: [
      "Workforce planning and talent strategy",
      "Talent pipeline design",
      "Competency-based hiring frameworks",
      "Employer branding and attraction systems",
      "Digital recruitment process optimization",
      "Assessment Centre and Selection tools",
      "Early-career and graduate pipeline programs",
    ],
    cta: "Start Your Assessment",
    href: "/hcd/recruitment",
  },
  {
    id: "capability",
    icon: "⬡",
    number: "02",
    title: "Capability Development Systems",
    tagline: "Build the skills and leadership needed to grow.",
    iconCls: "text-violet-400",
    openBorderCls: "border-violet-500/35",
    closedBorderCls: "border-white/8",
    expandBorderCls: "border-violet-500/20",
    dotCls: "bg-violet-400",
    ctaColorCls: "text-violet-400",
    items: [
      "Learning and development strategy",
      "Training needs analysis",
      "Leadership development pathways",
      "Technical and soft-skills capability building",
      "Onboarding and capability acceleration programs",
      "Coaching and performance support systems",
      "Digital learning platforms (LMS, microlearning, AI-supported)",
    ],
    cta: "Explore Programs",
    href: "/hcd/recruitment",
  },
  {
    id: "lifecycle",
    icon: "⬟",
    number: "03",
    title: "Talent Lifecycle Integration",
    tagline: "One talent engine, end to end.",
    iconCls: "text-emerald-400",
    openBorderCls: "border-emerald-500/35",
    closedBorderCls: "border-white/8",
    expandBorderCls: "border-emerald-500/20",
    dotCls: "bg-emerald-400",
    ctaColorCls: "text-emerald-400",
    items: [
      "Succession planning",
      "Career pathways and mobility systems",
      "Performance management alignment",
      "Culture and engagement alignment",
      "Capability dashboards and metrics",
      "Talent analytics and workforce insights",
    ],
    cta: "Talk to an Expert",
    href: "/contact",
  },
  {
    id: "digital",
    icon: "⚡",
    number: "04",
    title: "Digital Talent Enablement",
    tagline: "Use data and technology to accelerate talent growth.",
    iconCls: "text-blue-400",
    openBorderCls: "border-blue-500/35",
    closedBorderCls: "border-white/8",
    expandBorderCls: "border-blue-500/20",
    dotCls: "bg-blue-400",
    ctaColorCls: "text-blue-400",
    items: [
      "Talent analytics and dashboards",
      "AI-supported recruitment tools",
      "Digital learning ecosystems",
      "Capability mapping and skills intelligence",
      "Talent OS — your future productized system",
    ],
    cta: "Explore Premium",
    href: "/premium",
  },
];

export default function TalentPillars() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="bg-black text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-orange-500 text-[10px] tracking-[0.35em] uppercase font-bold mb-2">
            Talent Development — LAMID ONE
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
            Four Pillars of a{" "}
            <span className="text-orange-400">Complete Talent System.</span>
          </h2>
          <p className="mt-2 text-white/50 text-sm max-w-lg leading-relaxed">
            Training, assessments, and learning pathways enhanced by trusted expertise and advanced AI.
          </p>
          <div className="mt-6 h-px bg-gradient-to-r from-orange-500/50 via-white/10 to-transparent" />
        </motion.div>

        {/* Pillar Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PILLARS.map((pillar, i) => {
            const isOpen = open === pillar.id;
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.42, delay: i * 0.09 }}
                className="flex flex-col"
              >
                {/* Card header — always visible */}
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : pillar.id)}
                  className={`group text-left w-full bg-white/[0.03] border rounded-xl px-6 py-5 hover:bg-white/[0.06] transition-colors duration-200 ${isOpen ? pillar.openBorderCls : pillar.closedBorderCls}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Number + icon */}
                    <div className="shrink-0 flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold text-white/25">{pillar.number}</span>
                      <motion.span
                        className={`text-2xl ${pillar.iconCls}`}
                        animate={{ scale: isOpen ? 1.2 : 1, rotate: isOpen ? 8 : 0 }}
                        transition={{ type: "spring", stiffness: 280, damping: 18 }}
                      >
                        {pillar.icon}
                      </motion.span>
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white leading-snug">{pillar.title}</h3>
                      <p className="text-white/45 text-xs mt-1 leading-snug">{pillar.tagline}</p>
                    </div>

                    {/* Arrow */}
                    <motion.span
                      className={`shrink-0 self-center text-sm font-bold ${pillar.iconCls}`}
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      ▶
                    </motion.span>
                  </div>
                </button>

                {/* Expanded content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28 }}
                      className="overflow-hidden"
                    >
                      <div className={`px-6 py-5 rounded-b-xl border-x border-b bg-white/[0.02] ${pillar.expandBorderCls}`}>
                        <div className="space-y-2 mb-5">
                          {pillar.items.map((item, idx) => (
                            <motion.div
                              key={item}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05, duration: 0.2 }}
                              className="flex items-center gap-2.5 text-sm text-white/70"
                            >
                              <span className={`w-1 h-1 rounded-full shrink-0 ${pillar.dotCls}`} />
                              {item}
                            </motion.div>
                          ))}
                        </div>
                        <Link
                          href={pillar.href}
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold hover:opacity-80 transition-opacity ${pillar.ctaColorCls}`}
                        >
                          {pillar.cta} →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
