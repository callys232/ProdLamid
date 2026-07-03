"use client";
import { motion } from "framer-motion";
import type { ExpansionVector } from "@/mocks/sovereign";

interface Props { vectors: ExpansionVector[] }
const g = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay: d } });

export default function ExpansionBlueprint({ vectors }: Props) {
  return (
    <section className="px-6 py-12 border-t border-[#C9A84C]/10" style={{ background: "#070b14" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div {...g(0)} className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#C9A84C]/70 mb-1">Phase II — Expansion Architecture</p>
            <h2 className="text-xl font-bold text-[#E8E0CC]" style={{ fontFamily: "Georgia, serif" }}>Enterprise Expansion Blueprint</h2>
            <p className="text-xs text-[#E8E0CC]/40 mt-1">Four sovereign growth vectors — horizontal, vertical, alliance, and digital</p>
          </div>
          <button type="button" className="flex items-center gap-2 border border-[#C9A84C]/25 bg-[#C9A84C]/6 px-4 py-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#C9A84C] hover:bg-[#C9A84C]/12 transition-colors">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1l-4 4 4 3-4 1 5 2V5l3-2z" fill="#C9A84C" /></svg>
            Expansion Chancellor
          </button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {vectors.map((v, i) => (
            <motion.div key={v.number} {...g(i * 0.1)}
              className="border border-[#C9A84C]/12 bg-[#0d1422] p-6 relative overflow-hidden hover:border-[#C9A84C]/28 transition-colors">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />
              <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full border border-[#C9A84C]/6 translate-x-8 translate-y-8" />

              <p className="text-[9px] tracking-[0.3em] uppercase text-[#C9A84C]/55 mb-2">{v.subtitle}</p>
              <p className="font-bold text-[#E8E0CC] leading-snug mb-3 text-sm">{v.name}</p>
              <p className="text-[10px] text-[#E8E0CC]/45 leading-relaxed mb-3">{v.description}</p>
              <p className="text-[10px] text-[#C9A84C] italic">{v.highlight}</p>
            </motion.div>
          ))}
        </div>

        <motion.div {...g(0.45)} className="mt-4 border border-[#C9A84C]/10 bg-[#0d1422] px-5 py-3 text-[10px] text-[#E8E0CC]/40">
          <span className="text-[#E8E0CC]/60 font-semibold">Authorization Required:</span> All expansion vectors require{" "}
          <span className="text-[#C9A84C]">Expansion Chancellor authorization</span> and{" "}
          <span className="text-[#C9A84C]">Sovereign Council ratification</span> prior to deployment.
        </motion.div>
      </div>
    </section>
  );
}
