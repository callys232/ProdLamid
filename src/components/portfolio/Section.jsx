"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Briefcase, Flag, Cpu, Store, Users2 } from "lucide-react";
import EcosystemTag from "@/components/EcosystemTag";

const PILLARS = [
  {
    Icon: Briefcase,
    hex: "#c21219",
    glow: "rgba(194,18,25,0.28)",
    label: "Management",
    tags: ["Advisory", "Human Capital", "Leadership"],
    bold: "LAMID's Management comprises a core team of highly experienced and effective professionals.",
    body: " They design, coordinate, manage and lead human capital development and business advisory services to client organizations. Their strong business acumen sets that clients cannot acquire elsewhere, making them a definite rare of LAMID's services.",
  },
  {
    Icon: Flag,
    hex: "#3b82f6",
    glow: "rgba(59,130,246,0.28)",
    label: "Vision",
    tags: ["4,000 Talents", "25% Growth", "Africa Focus"],
    bold: 'Vision 2025: "To nurture 4,000 more of Africa\'s best talents to deliver excellence, grow and in-creating profitability and providing sustainable businesses by 2025. With client-focused and customized organizational growth and development models and support, because we commit to a shared outcome."',
    body: " Creating a growth of 25% annually.",
  },
  {
    Icon: Cpu,
    hex: "#10b981",
    glow: "rgba(16,185,129,0.28)",
    label: "Technology",
    tags: ["Web Tech", "AI-Enabled", "Latest Stack"],
    bold: "As business is increasingly transacted with technology on the rise, introducing capabilities and flexibility,",
    body: " technically infused presence and in the face of stiff competition in all markets, making it compelling for timely introduction of products, the use of old web technology is obsolete, our website is developed to conform with the latest technology.",
  },
];

const BIZ_PERKS = [
  "Access to exclusive business clinics",
  "Peer network of 3,000+ SMEs",
  "Free diagnostic care opportunities",
  "Expert mentorship and strategy sessions",
];

const BIZ_WHAT_TAGS  = [{ label: "Business Clinics", hex: "#c21219" }, { label: "SME Network", hex: "#c21219" }, { label: "Growth Hub", hex: "#c21219" }];
const BIZ_JOIN_TAGS  = [{ label: "SME Community", hex: "#3b82f6" }, { label: "Mentorship", hex: "#3b82f6" }, { label: "Strategy", hex: "#3b82f6" }];

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, type: "spring", stiffness: 260, damping: 22 },
  }),
};

/* ── Reusable animated tag ── */
function Tag({ label, hex }) {
  return (
    <motion.span
      whileHover={{
        scale: 1.12,
        y: -3,
        backgroundColor: `${hex}35`,
        borderColor: `${hex}80`,
        color: "#ffffff",
        boxShadow: `0 4px 14px ${hex}50`,
      }}
      transition={{ type: "spring", stiffness: 420, damping: 18 }}
      className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide cursor-default select-none"
      style={{ backgroundColor: `${hex}18`, color: hex, border: `1px solid ${hex}35` }}
    >
      {label}
    </motion.span>
  );
}

const Section = () => {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: false, margin: "-12% 0px" });

  return (
    <motion.section
      ref={sectionRef}
      animate={{ backgroundColor: inView ? "rgba(194,18,25,0.04)" : "#000000" }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
      className="relative text-white py-20 px-4 md:px-8 lg:px-16 overflow-hidden"
    >
      {/* CSS pulse keyframes — loops continuously */}
      <style>{`
        @keyframes biz-radar {
          0%   { transform: scale(1);   opacity: 0.6; }
          60%  { transform: scale(2.6); opacity: 0;   }
          100% { transform: scale(1);   opacity: 0;   }
        }
        .biz-pulse-0 { animation: biz-radar 2.2s ease-out infinite 0s;    }
        .biz-pulse-1 { animation: biz-radar 2.2s ease-out infinite 0.55s; }
        .biz-pulse-2 { animation: biz-radar 2.2s ease-out infinite 1.1s;  }
        .biz-pulse-3 { animation: biz-radar 2.2s ease-out infinite 1.65s; }
      `}</style>

      {/* Subtle grid texture */}
      <div className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#c21219]/6 blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-16">

        {/* ── Three pillar cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.label}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -6, boxShadow: `0 20px 52px ${p.glow}` }}
              className="group relative flex flex-col gap-5 rounded-2xl p-6 overflow-hidden"
              style={{
                border: `1px solid ${p.hex}28`,
                background: `linear-gradient(145deg, ${p.hex}0d 0%, #0a0a0a 100%)`,
              }}
            >
              {/* Corner glow */}
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                style={{ backgroundColor: p.hex }} />
              {/* Shine sweep */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none" />

              {/* Icon + label */}
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.12 }}
                  transition={{ type: "spring", stiffness: 400, damping: 16 }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${p.hex}1a`, border: `1px solid ${p.hex}40` }}
                >
                  <p.Icon className="h-5 w-5" style={{ color: p.hex }} />
                </motion.div>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: p.hex }}>
                  {p.label}
                </span>
              </div>

              {/* Micro-service tags */}
              <div className="flex flex-wrap gap-2">
                {p.tags.map((tag) => <Tag key={tag} label={tag} hex={p.hex} />)}
              </div>

              {/* Text */}
              <p className="text-sm leading-relaxed text-gray-300 flex-1">
                <span className="font-bold text-white">{p.bold}</span>{p.body}
              </p>

              {/* Bottom accent */}
              <motion.div
                animate={{ width: "24px" }}
                whileHover={{ width: "60%" }}
                transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
                className="h-0.5 rounded-full mt-auto"
                style={{ backgroundColor: p.hex }}
              />
            </motion.div>
          ))}
        </div>

        {/* ── Bizphare / Bizclub bottom cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Left — What is Bizphare-Bizclub? */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="relative rounded-2xl overflow-hidden h-64 group"
            style={{ border: "1px solid rgba(194,18,25,0.25)" }}
          >
            <div className="absolute inset-0">
              <Image src="/pt-business-meeting.png" alt="Business meeting" fill
                className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between p-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#c21219]/25 border border-[#c21219]/50">
                  <Store className="h-4 w-4 text-[#c21219]" />
                </div>
                <span className="bg-[#c21219] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  What is Bizphare-Bizclub?
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {BIZ_WHAT_TAGS.map((t) => <Tag key={t.label} label={t.label} hex={t.hex} />)}
              </div>
            </div>
          </motion.div>

          {/* Right — Why Join Bizphere-Bizclub? */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 240, damping: 22, delay: 0.1 }}
            className="relative rounded-2xl p-6 flex flex-col justify-between gap-5 overflow-hidden"
            style={{
              border: "1px solid rgba(59,130,246,0.25)",
              background: "linear-gradient(145deg, rgba(59,130,246,0.07) 0%, #0a0a0a 100%)",
            }}
          >
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-blue-500/15 border border-blue-500/35">
                <Users2 className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Why Join</span>
                <p className="text-sm font-semibold text-white leading-tight">Bizphere-Bizclub?</p>
              </div>
            </div>

            <ul className="space-y-4 flex-1">
              {BIZ_PERKS.map((perk, i) => (
                <motion.li
                  key={perk}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.09, type: "spring", stiffness: 280, damping: 22 }}
                  className="flex items-start gap-4 cursor-default"
                >
                  {/* Radar-pulse bullet — pure CSS, loops indefinitely */}
                  <div className="relative flex-shrink-0 mt-1.5 w-2.5 h-2.5">
                    <span className={`biz-pulse-${i} absolute inset-0 rounded-full bg-blue-400/60`} />
                    <span className="relative block w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_7px_rgba(96,165,250,0.9)]" />
                  </div>
                  <span
                    className="text-sm sm:text-base text-white leading-snug"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {perk}
                  </span>
                </motion.li>
              ))}
            </ul>

            <div className="flex gap-2 flex-wrap">
              {BIZ_JOIN_TAGS.map((t) => <Tag key={t.label} label={t.label} hex={t.hex} />)}
            </div>
          </motion.div>
        </div>
        <EcosystemTag />

      </div>
    </motion.section>
  );
};

export default Section;
