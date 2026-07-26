"use client";
import { motion } from "framer-motion";
import type { SovereignArtifact } from "@/mocks/sovereign";

interface Props { artifacts: SovereignArtifact[] }
const g = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay: d } });

const statusLabel: Record<string, { label: string; color: string }> = {
  sealed:      { label: "Sealed",       color: "#C9A84C" },
  translating: { label: "Translating",  color: "#7BC98C" },
  pending:     { label: "Pending",      color: "#7B9EC9" },
};

export default function ArtifactsPanel({ artifacts }: Props) {
  return (
    <section className="px-6 py-12 border-t border-[#C9A84C]/10" style={{ background: "#070b14" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div {...g(0)} className="mb-8">
          <p className="text-[9px] tracking-[0.4em] uppercase text-[#C9A84C]/70 mb-1">Phase I Legacy — Seven Artifacts</p>
          <h2 className="text-xl font-bold text-[#E8E0CC]" style={{ fontFamily: "Georgia, serif" }}>The Seven Artifacts — Phase I Foundation</h2>
          <p className="text-xs text-[#E8E0CC]/40 mt-1">Each artifact now maps to a Phase II operational construct</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {artifacts.map((a, i) => {
            const st = statusLabel[a.status] ?? statusLabel.pending;
            return (
              <motion.div key={a.id} {...g(i * 0.06)}
                className="border border-[#C9A84C]/12 bg-[#0d1422] p-5 relative hover:border-[#C9A84C]/25 transition-colors">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/25 to-transparent" />

                {/* Artifact number + status */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-[#C9A84C]/60 tracking-widest">0{a.id}</span>
                    <svg width="14" height="11" viewBox="0 0 14 11" fill="none"><path d="M2 9L2 3L5.5 6.5L7 2L8.5 6.5L12 3L12 9Z" fill="#C9A84C" opacity="0.7" /><rect x="2" y="9" width="10" height="1.5" rx="0.5" fill="#C9A84C" opacity="0.5" /></svg>
                  </div>
                  <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 border"
                    style={{ color: st.color, borderColor: `${st.color}30`, backgroundColor: `${st.color}10` }}>
                    {st.label}
                  </span>
                </div>

                <p className="text-sm font-bold text-[#E8E0CC] mb-0.5">{a.name}</p>
                <p className="text-[10px] text-[#C9A84C] mb-2 font-semibold">→ {a.translation}</p>
                <p className="text-[10px] text-[#E8E0CC]/45 leading-relaxed mb-3">{a.description}</p>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[9px] text-[#E8E0CC]/30 tracking-widest">TRANSLATION PROGRESS</p>
                    <p className="text-[9px] font-bold text-[#C9A84C]">{a.completionPct}%</p>
                  </div>
                  <div className="h-0.5 bg-[#C9A84C]/10 overflow-hidden">
                    <motion.div className="h-full" style={{ backgroundColor: st.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${a.completionPct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.05 }} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
