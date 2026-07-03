"use client";
import { motion } from "framer-motion";
import type { CommandOverviewData } from "@/mocks/sovereign";

interface Props { data: CommandOverviewData }

const g = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay: d } });

const ICONS = [
  <svg key="a" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v5c0 5.25 3.75 10.17 9 11.33C17.25 22.17 21 17.25 21 12V7L12 2z" stroke="#C9A84C" strokeWidth="1.5" fill="none" /><path d="M9 12l2 2 4-4" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" /></svg>,
  <svg key="b" width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="#C9A84C" strokeWidth="1.5" /><rect x="14" y="3" width="7" height="7" rx="1" stroke="#C9A84C" strokeWidth="1.5" /><rect x="3" y="14" width="7" height="7" rx="1" stroke="#C9A84C" strokeWidth="1.5" /><rect x="14" y="14" width="7" height="7" rx="1" stroke="#C9A84C" strokeWidth="1.5" /></svg>,
  <svg key="c" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 20 L3 8 L9 14 L12 6 L15 14 L21 8 L21 20 Z" stroke="#C9A84C" strokeWidth="1.5" fill="none" /><line x1="3" y1="20" x2="21" y2="20" stroke="#C9A84C" strokeWidth="1.5" /></svg>,
  <svg key="d" width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#C9A84C" strokeWidth="1.5" /><path d="M12 3 Q16 12 12 21" stroke="#C9A84C" strokeWidth="1.5" /><path d="M12 3 Q8 12 12 21" stroke="#C9A84C" strokeWidth="1.5" /><path d="M3 12 h18" stroke="#C9A84C" strokeWidth="1.5" /></svg>,
];

export default function CommandOverview({ data }: Props) {
  const cards = [
    { num: data.artifacts,       label: "Artifacts Translated into Live Operational Frameworks", note: data.artifactsNote,    icon: ICONS[0] },
    { num: data.governanceTiers, label: "Governance Tiers Activated",                             note: data.governanceNote,   icon: ICONS[1] },
    { num: data.thronePositions, label: "Throne Positions Mapped to Enterprise Systems",          note: data.throneNote,       icon: ICONS[2] },
    { num: data.realmPhases,     label: "Realm Activation Phases Initiated",                      note: data.realmNote,        icon: ICONS[3] },
  ];

  return (
    <section className="px-6 py-12" style={{ background: "#0a0e1a" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div {...g(0)} className="mb-8">
          <p className="text-[9px] tracking-[0.4em] uppercase text-[#C9A84C]/70 mb-1">Phase II — Command Overview</p>
          <h2 className="text-xl font-bold text-[#E8E0CC]" style={{ fontFamily: "Georgia, serif" }}>Command Overview</h2>
          <p className="text-xs text-[#E8E0CC]/40 mt-1">Four pillars define the post-Seal construction scope</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c, i) => (
            <motion.div key={i} {...g(i * 0.08)}
              className="border border-[#C9A84C]/15 bg-[#0d1422] p-6 relative overflow-hidden hover:border-[#C9A84C]/30 transition-colors">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
              <div className="mb-4 w-10 h-10 flex items-center justify-center border border-[#C9A84C]/20 bg-[#C9A84C]/6 rounded-sm">
                {c.icon}
              </div>
              <p className="text-5xl font-black text-[#C9A84C] mb-3 leading-none" style={{ fontFamily: "Georgia, serif" }}>{c.num}</p>
              <p className="text-sm font-semibold text-[#E8E0CC] leading-snug mb-2">{c.label}</p>
              <p className="text-[10px] text-[#E8E0CC]/40 leading-relaxed italic">{c.note}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
