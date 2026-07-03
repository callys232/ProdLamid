"use client";
import { motion } from "framer-motion";
import type { DecisionType } from "@/mocks/sovereign";

interface Props { decisions: DecisionType[] }
const g = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay: d } });

const levelBadge: Record<string, string> = {
  unanimous:  "Unanimous",
  quorum:     "2/3 Quorum",
  individual: "Individual",
  override:   "Override",
};

export default function DecisionMatrix({ decisions }: Props) {
  return (
    <section className="px-6 py-12 border-t border-[#C9A84C]/10" style={{ background: "#0a0e1a" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div {...g(0)} className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#C9A84C]/70 mb-1">Governance Decision &amp; Accountability Matrix</p>
            <h2 className="text-xl font-bold text-[#E8E0CC]" style={{ fontFamily: "Georgia, serif" }}>Governance Decision &amp; Accountability Matrix</h2>
            <p className="text-xs text-[#E8E0CC]/40 mt-1">Clarity of authority at every level — no decision falls through the gaps</p>
          </div>
          <p className="text-[9px] italic text-[#E8E0CC]/30 max-w-xs text-right">
            No decision remains unresolved beyond <span className="text-[#C9A84C]">7 days.</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {decisions.map((d, i) => (
            <motion.div key={d.name} {...g(i * 0.1)}
              className="border bg-[#0d1422] p-6 relative hover:border-opacity-50 transition-colors"
              style={{ borderColor: `${d.color}20` }}>
              {d.name === "Emergency Protocol" && (
                <div className="absolute top-0 left-0 bottom-0 w-1" style={{ backgroundColor: d.color, opacity: 0.6 }} />
              )}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[9px] tracking-[0.25em] uppercase mb-0.5" style={{ color: `${d.color}80` }}>{d.name}</p>
                  <p className="font-bold" style={{ color: d.color }}>{d.body}</p>
                </div>
                <span className="text-[9px] font-bold border px-2 py-0.5"
                  style={{ color: d.color, borderColor: `${d.color}30`, backgroundColor: `${d.color}10` }}>
                  {levelBadge[d.level]}
                </span>
              </div>
              <p className="text-[10px] text-[#E8E0CC]/45 leading-relaxed">{d.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Escalation path */}
        <motion.div {...g(0.4)} className="mt-4 border border-[#C9A84C]/10 bg-[#0d1422] px-6 py-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <p className="text-[9px] tracking-widest uppercase text-[#C9A84C]/60 mb-0.5">Escalation Path</p>
              <p className="text-xs text-[#E8E0CC]/50">Unresolved Issue Routing</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap text-[10px]">
              {[
                { label: "Tactical", sub: "" },
                { label: "Operational", sub: "48h" },
                { label: "Strategic", sub: "72h" },
                { label: "Sovereign Review", sub: "Quarterly / Emergency", highlight: true },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center gap-2">
                  {i > 0 && <span className="text-[#C9A84C]/30">→</span>}
                  <div className={`px-3 py-1.5 border text-center ${s.highlight ? "border-[#C9A84C]/30 text-[#C9A84C] bg-[#C9A84C]/6" : "border-[#C9A84C]/12 text-[#E8E0CC]/45"}`}>
                    <p className="font-semibold">{s.label}</p>
                    {s.sub && <p className="text-[8px] opacity-60">{s.sub}</p>}
                  </div>
                </div>
              ))}
            </div>
            <div className="ml-auto">
              <span className="border border-[#C9A84C]/25 text-[#C9A84C] text-[9px] px-2 py-1 font-bold tracking-widest">7-DAY MAX</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
