"use client";
import { motion } from "framer-motion";
import type { RolloutPhase } from "@/mocks/operatingModel";

interface Props { rolloutPhases: RolloutPhase[] }
const g = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay: d } });

const statusColor: Record<string, string> = {
  complete: "#C9A84C",
  active:   "#7BC98C",
  pending:  "#2d3a52",
};
const statusText: Record<string, string> = {
  complete: "#C9A84C",
  active:   "#7BC98C",
  pending:  "#4a5a78",
};

export default function PhaseTimeline({ rolloutPhases }: Props) {
  return (
    <section className="px-6 py-12 border-t border-[#C9A84C]/10" style={{ background: "#070b14" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div {...g(0)} className="mb-8">
          <p className="text-[9px] tracking-[0.4em] uppercase text-[#C9A84C]/70 mb-1">Enterprise Operating Model — Phase II</p>
          <h2 className="text-xl font-bold text-[#E8E0CC]" style={{ fontFamily: "Georgia, serif" }}>Multi-Domain Activation Sequence</h2>
          <p className="text-xs text-[#E8E0CC]/40 mt-1">Five sequential rolloutPhases — each unlocking greater operating model capacity</p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-6 left-6 right-6 h-px bg-[#C9A84C]/15 hidden lg:block" />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {rolloutPhases.map((r, i) => (
              <motion.div key={r.number} {...g(i * 0.1)} className="relative">
                {/* Number circle */}
                <div className="flex items-center gap-3 mb-4 lg:flex-col lg:items-start">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black relative z-10 shrink-0"
                    style={{ backgroundColor: statusColor[r.status], color: r.status === "pending" ? "#4a5a78" : "#070b14" }}>
                    {["I","II","III","IV","V"][i]}
                  </div>
                </div>

                <div className="border border-[#C9A84C]/12 bg-[#0d1422] p-4 hover:border-[#C9A84C]/25 transition-colors">
                  <p className="text-[9px] tracking-[0.25em] uppercase mb-1" style={{ color: statusText[r.status] }}>
                    {r.name}
                  </p>
                  <p className="text-[10px] text-[#E8E0CC]/35 mb-3">{r.timeline}</p>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] text-[#E8E0CC]/30">Progress</span>
                      <span className="text-[9px] font-bold" style={{ color: statusColor[r.status] === "#2d3a52" ? "#4a5a78" : statusColor[r.status] }}>
                        {r.progress}%
                      </span>
                    </div>
                    <div className="h-px bg-[#1a2235] overflow-hidden">
                      <motion.div className="h-full"
                        style={{ backgroundColor: statusColor[r.status] === "#2d3a52" ? "#1a2235" : statusColor[r.status] }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${r.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 }} />
                    </div>
                  </div>

                  <ul className="flex flex-col gap-1.5">
                    {r.milestones.map((m, j) => (
                      <li key={j} className="flex items-start gap-1.5">
                        <span className="text-[#C9A84C]/50 text-[8px] mt-0.5 shrink-0">•</span>
                        <p className="text-[9px] text-[#E8E0CC]/40 leading-snug">{m}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div {...g(0.55)} className="flex items-center justify-between mt-4 text-[9px] text-[#E8E0CC]/25 tracking-widest flex-wrap gap-2">
          <span>Enterprise Operating Model — Phase II</span>
          <span>12-Month Activation Timeline</span>
          <span>Initiated: Q3 2026</span>
        </motion.div>
      </div>
    </section>
  );
}
