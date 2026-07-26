"use client";
import { motion } from "framer-motion";
import type { OperatingModelEnterpriseProfile } from "@/mocks/operatingModel";

interface Props {
  enterprise: OperatingModelEnterpriseProfile;
  sealScore:  number;
  onAssess:   () => void;
  hasData:    boolean;
}

const g = (d = 0) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: d } });

export default function OperatingModelHero({ enterprise, sealScore, onAssess, hasData }: Props) {
  return (
    <div className="relative overflow-hidden border-b border-[#C9A84C]/15 px-6 py-16 text-center"
      style={{ background: "linear-gradient(180deg, #070b14 0%, #0a0e1a 100%)" }}>

      {/* Gold corner ornaments */}
      <div className="absolute top-4 left-4 w-16 h-16 border-t border-l border-[#C9A84C]/30" />
      <div className="absolute top-4 right-4 w-16 h-16 border-t border-r border-[#C9A84C]/30" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-b border-l border-[#C9A84C]/30" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-b border-r border-[#C9A84C]/30" />

      {/* Crown icon */}
      <motion.div {...g(0)} className="flex justify-center mb-4">
        <svg width="36" height="28" viewBox="0 0 36 28" fill="none" className="opacity-80">
          <path d="M3 24 L3 8 L12 16 L18 4 L24 16 L33 8 L33 24 Z" fill="#C9A84C" opacity="0.9" />
          <rect x="3" y="24" width="30" height="3" rx="1" fill="#C9A84C" opacity="0.7" />
        </svg>
      </motion.div>

      <motion.p {...g(0.05)} className="text-[10px] tracking-[0.5em] uppercase font-bold text-[#C9A84C] mb-2">
        Enterprise Operating Model
      </motion.p>

      <motion.h1 {...g(0.1)} className="text-4xl sm:text-5xl font-black text-[#E8E0CC] leading-tight mb-1"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "-0.02em" }}>
        ENTERPRISE OPERATING
      </motion.h1>
      <motion.h1 {...g(0.15)} className="text-4xl sm:text-5xl font-black text-[#E8E0CC] leading-tight mb-6"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "-0.02em" }}>
        MODEL
      </motion.h1>

      <motion.p {...g(0.2)} className="text-[#C9A84C] italic text-base mb-1"
        style={{ fontFamily: "Georgia, serif" }}>
        Phase {enterprise.phase} — Post-Approval Build
      </motion.p>
      <motion.p {...g(0.22)} className="text-[10px] tracking-[0.3em] uppercase text-[#E8E0CC]/40 mb-8">
        Translating the Seven Artifacts into Operational Frameworks, Governance Matrices &amp; Multi-Domain Activation Sequences
      </motion.p>

      {/* Divider dots */}
      <motion.div {...g(0.25)} className="flex items-center justify-center gap-2 mb-8">
        <div className="w-16 h-px bg-[#C9A84C]/30" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]/60" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]/60" />
        <div className="w-16 h-px bg-[#C9A84C]/30" />
      </motion.div>

      {hasData ? (
        <>
          {/* Status badge */}
          <motion.div {...g(0.3)} className="inline-flex items-center gap-2 border border-[#C9A84C]/30 bg-[#C9A84C]/8 px-5 py-2.5 rounded-sm mb-4">
            <span className="text-[#C9A84C]">✦</span>
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#C9A84C]">
              Phase {enterprise.phase} Is Now Active
            </span>
          </motion.div>

          <motion.p {...g(0.35)} className="text-[11px] text-[#E8E0CC]/45 tracking-widest mb-6">
            All leadership roles are assigned &nbsp;·&nbsp; All rolloutPhases await activation &nbsp;·&nbsp; The Enterprise Operating Model is operational
          </motion.p>

          {/* Operating model maturity score */}
          <motion.div {...g(0.4)} className="inline-flex flex-col items-center border border-[#C9A84C]/20 bg-[#C9A84C]/5 px-8 py-4 rounded-sm">
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#C9A84C]/70 mb-1">Operating Model Score</p>
            <p className="text-4xl font-black text-[#C9A84C]" style={{ fontFamily: "Georgia, serif" }}>{sealScore}</p>
            <p className="text-[9px] text-[#E8E0CC]/35 tracking-widest">/ 100</p>
          </motion.div>

          {/* Imperative */}
          <motion.p {...g(0.45)} className="mt-8 max-w-2xl mx-auto text-sm text-[#E8E0CC]/60 leading-relaxed italic"
            style={{ fontFamily: "Georgia, serif" }}>
            "{enterprise.imperativeStatement}"
          </motion.p>
        </>
      ) : (
        <>
          <motion.p {...g(0.3)} className="max-w-xl mx-auto text-sm text-[#E8E0CC]/55 leading-relaxed italic mb-6"
            style={{ fontFamily: "Georgia, serif" }}>
            "Phase II does not merely build systems — it consecrates a living architecture of authority, intelligence, and expansion. This enterprise does not follow order — it defines it."
          </motion.p>

          <motion.button {...g(0.35)} type="button" onClick={onAssess}
            className="inline-flex items-center gap-2 border border-[#C9A84C]/40 bg-[#C9A84C]/10 hover:bg-[#C9A84C]/18 px-8 py-3.5 transition-colors text-[11px] font-bold tracking-[0.3em] uppercase text-[#C9A84C]">
            ✦ Initiate Operating Model Assessment
          </motion.button>
        </>
      )}

      <motion.p {...g(0.5)} className="mt-6 text-[9px] tracking-[0.3em] text-[#E8E0CC]/25 uppercase">
        Enterprise Operating Model · Phase {enterprise.phase} · {enterprise.approvalStatus} · {enterprise.initiatedDate}
      </motion.p>
    </div>
  );
}
