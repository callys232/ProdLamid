"use client";
import { motion } from "framer-motion";
import type { GovernanceTier } from "@/mocks/sovereign";

interface Props { tiers: GovernanceTier[] }
const g = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay: d } });

const ICONS: Record<string, React.ReactNode> = {
  crown: (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none"><path d="M2 14L2 5L7 9L10 2L13 9L18 5L18 14Z" fill="#C9A84C" opacity="0.8" /><rect x="2" y="14" width="16" height="1.5" rx="0.5" fill="#C9A84C" opacity="0.6" /></svg>
  ),
  shield: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L4 5v5c0 4.5 2.5 8 6 9.5C13.5 18 16 14.5 16 10V5L10 2z" stroke="#7BC98C" strokeWidth="1.3" fill="none" /></svg>
  ),
  compass: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#7B9EC9" strokeWidth="1.3" /><path d="M10 6l-2 4 2 1 2-1z" fill="#7B9EC9" opacity="0.6" /><path d="M10 14l2-4-2-1-2 1z" fill="#7B9EC9" opacity="0.3" /></svg>
  ),
};

export default function GovernanceMatrix({ tiers }: Props) {
  return (
    <section className="px-6 py-12 border-t border-[#C9A84C]/10" style={{ background: "#070b14" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div {...g(0)} className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#C9A84C]/70 mb-1">Governance Authority Matrix</p>
            <h2 className="text-xl font-bold text-[#E8E0CC]" style={{ fontFamily: "Georgia, serif" }}>Governance Authority Matrix</h2>
            <p className="text-xs text-[#E8E0CC]/40 mt-1">Tri-tier decision architecture defining who decides what, when, and how</p>
          </div>
          <div className="flex items-center gap-3 text-[9px] tracking-widest">
            {tiers.map((t) => (
              <span key={t.name} className="text-[#E8E0CC]/35 uppercase">
                {t.icon === "crown" ? "👑" : t.icon === "shield" ? "🛡" : "🧭"} {t.name.split(" ")[0]}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {tiers.slice(0, 2).map((t, i) => (
            <motion.div key={t.name} {...g(i * 0.1)}
              className={`border bg-[#0d1422] p-6 ${i === 0 ? "border-[#C9A84C]/25" : "border-[#C9A84C]/12"} hover:border-[#C9A84C]/30 transition-colors`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 flex items-center justify-center border border-[#C9A84C]/20 bg-[#C9A84C]/6">
                  {ICONS[t.icon]}
                </div>
                <div>
                  <p className="text-[9px] tracking-[0.25em] uppercase text-[#E8E0CC]/35">{t.name}</p>
                  <p className="font-bold text-[#C9A84C]">{t.body}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[10px]">
                <div>
                  <p className="text-[9px] tracking-widest text-[#E8E0CC]/30 uppercase mb-1.5">Decision Rights</p>
                  <ul className="flex flex-col gap-1">
                    {t.decisionRights.map((d) => (
                      <li key={d} className="flex items-start gap-1.5">
                        <span className="text-[#C9A84C]/50 mt-0.5 shrink-0">·</span>
                        <span className="text-[#E8E0CC]/55">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-[9px] tracking-widest text-[#E8E0CC]/30 uppercase mb-1">Holders</p>
                    {t.holders.map(h => <p key={h} className="text-[#E8E0CC]/55 py-0.5 px-2 border border-[#C9A84C]/15 inline-block mr-1 mb-1">{h}</p>)}
                  </div>
                  <div>
                    <p className="text-[9px] tracking-widest text-[#E8E0CC]/30 uppercase mb-1">Cadence</p>
                    <p className="text-[#E8E0CC]/55">{t.cadence}</p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-widest text-[#E8E0CC]/30 uppercase mb-1">Quorum</p>
                    <p className="text-[#C9A84C]">{t.quorum}</p>
                  </div>
                  {t.escalation && (
                    <div>
                      <p className="text-[9px] tracking-widest text-[#E8E0CC]/30 uppercase mb-1">Escalation</p>
                      <p className="text-[#E8E0CC]/40 text-[9px]">↑ {t.escalation}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tactical tier — full width */}
        {tiers[2] && (
          <motion.div {...g(0.2)} className="border border-[#C9A84C]/10 bg-[#0d1422] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {ICONS.compass}
              <div>
                <p className="text-[9px] tracking-widest text-[#E8E0CC]/30 uppercase">{tiers[2].name}</p>
                <p className="font-semibold text-[#7B9EC9]">{tiers[2].body}</p>
              </div>
            </div>
            <p className="text-[10px] text-[#E8E0CC]/45 max-w-lg">
              <span className="text-[#E8E0CC]/70 font-semibold">Individual authority</span> for day-to-day domain execution. {tiers[2].escalation}
            </p>
            <div className="flex items-center gap-6 text-[10px]">
              <div className="text-center"><p className="text-[#C9A84C] font-bold">Strategic</p><p className="text-[#E8E0CC]/35">Unanimous · Quarterly</p></div>
              <div className="text-center"><p className="text-[#7BC98C] font-bold">Operational</p><p className="text-[#E8E0CC]/35">2/3 Quorum · Monthly</p></div>
              <div className="text-center"><p className="text-[#7B9EC9] font-bold">Tactical</p><p className="text-[#E8E0CC]/35">Individual · 48h</p></div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
