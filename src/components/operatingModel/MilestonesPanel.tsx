"use client";
import { motion } from "framer-motion";
import type { GovernanceMilestone } from "@/mocks/operatingModel";

interface Props { milestones: GovernanceMilestone[] }
const g = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay: d } });

const statusConfig: Record<string, { label: string; color: string; barColor: string }> = {
  initiated:  { label: "Initiated",         color: "#C9A84C", barColor: "#C9A84C" },
  scheduled:  { label: "Scheduled",         color: "#7BC98C", barColor: "#7BC98C" },
  pending:    { label: "Pending",           color: "#7B9EC9", barColor: "#7B9EC9" },
  complete:   { label: "Operating Model Complete", color: "#C9A84C", barColor: "#C9A84C" },
};

const MILESTONE_ICON: Record<string, React.ReactNode> = {
  initiated:  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="4" y="2" width="12" height="16" rx="1.5" stroke="#C9A84C" strokeWidth="1.3" fill="none" /><line x1="7" y1="6" x2="13" y2="6" stroke="#C9A84C" strokeWidth="1.3" /><line x1="7" y1="9" x2="13" y2="9" stroke="#C9A84C" strokeWidth="1.3" /></svg>,
  scheduled:  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="#7BC98C" strokeWidth="1.3" fill="none" /><path d="M7 10l2 2 4-4" stroke="#7BC98C" strokeWidth="1.3" strokeLinecap="round" /></svg>,
  pending:    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="#7B9EC9" strokeWidth="1.3" fill="none" /><circle cx="10" cy="10" r="2" fill="#7B9EC9" opacity="0.5" /></svg>,
  complete:   <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L4 5v5c0 4.5 2.5 8 6 9.5C13.5 18 16 14.5 16 10V5L10 2z" fill="#C9A84C" opacity="0.8" /></svg>,
};

export default function MilestonesPanel({ milestones }: Props) {
  return (
    <section className="px-6 py-12 border-t border-[#C9A84C]/10" style={{ background: "#0a0e1a" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div {...g(0)} className="mb-8">
          <p className="text-[9px] tracking-[0.4em] uppercase text-[#C9A84C]/70 mb-1">Enterprise Operating Model — Phase II</p>
          <h2 className="text-xl font-bold text-[#E8E0CC]" style={{ fontFamily: "Georgia, serif" }}>Phase II Governance Milestones</h2>
          <p className="text-xs text-[#E8E0CC]/40 mt-1">Four quarters — four transformation checkpoints</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {milestones.map((m, i) => {
            const st = statusConfig[m.status] ?? statusConfig.pending;
            return (
              <motion.div key={m.milestoneNum} {...g(i * 0.1)}
                className="border border-[#C9A84C]/12 bg-[#0d1422] overflow-hidden hover:border-[#C9A84C]/25 transition-colors">
                {/* Card header */}
                <div className="px-5 pt-5 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-4xl font-black leading-none" style={{ color: st.color, fontFamily: "Georgia, serif" }}>
                        {m.quarter}
                      </p>
                      <p className="text-xs text-[#E8E0CC]/35 mt-0.5">{m.year}</p>
                    </div>
                    <div className="w-9 h-9 flex items-center justify-center border border-[#C9A84C]/15 bg-[#C9A84C]/5">
                      {MILESTONE_ICON[m.status]}
                    </div>
                  </div>

                  <p className="font-bold text-[#E8E0CC] text-sm leading-snug mb-2">{m.title}</p>
                  <p className="text-[10px] text-[#E8E0CC]/40 leading-relaxed mb-3">{m.description}</p>

                  <ul className="flex flex-col gap-1">
                    {m.details.map((d) => (
                      <li key={d} className="flex items-start gap-1.5">
                        <span className="mt-0.5 shrink-0" style={{ color: st.color }}>·</span>
                        <p className="text-[9px] leading-snug" style={{ color: `${st.color}80` }}>{d}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Status bar */}
                <div className="border-t border-[#C9A84C]/10 px-5 py-3 flex items-center justify-between">
                  <p className="text-[9px] text-[#E8E0CC]/30 tracking-widest uppercase">Milestone {m.milestoneNum} of IV</p>
                  <span className="text-[9px] border px-2 py-0.5 font-bold"
                    style={{ color: st.color, borderColor: `${st.color}30`, backgroundColor: `${st.color}10` }}>
                    {st.label.toUpperCase()}
                  </span>
                </div>

                {/* Progress dots */}
                <div className="px-5 pb-3 flex items-center gap-1.5">
                  {milestones.map((_, j) => (
                    <div key={j} className="h-1.5 flex-1 rounded-sm"
                      style={{ backgroundColor: j <= i ? st.color : "#1a2235" }} />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div {...g(0.45)} className="flex items-center justify-between mt-4 text-[9px] text-[#E8E0CC]/25 tracking-widest flex-wrap gap-2">
          <span>Enterprise Operating Model — Phase II</span>
          <span>Governance Milestone Map · Q3 2026 — Q2 2027</span>
          <span>Classified — Phase II Operations</span>
        </motion.div>
      </div>
    </section>
  );
}
