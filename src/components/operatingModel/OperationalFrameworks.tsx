"use client";
import { motion } from "framer-motion";
import type { OperationalFramework } from "@/mocks/operatingModel";

interface Props { frameworks: OperationalFramework[] }
const g = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay: d } });

const NUMERALS = ["I", "II", "III", "IV"];

export default function OperationalFrameworks({ frameworks }: Props) {
  return (
    <section className="px-6 py-12 border-t border-[#C9A84C]/10" style={{ background: "#0a0e1a" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div {...g(0)} className="mb-8">
          <p className="text-[9px] tracking-[0.4em] uppercase text-[#C9A84C]/70 mb-1">Phase II — Operational Architecture</p>
          <h2 className="text-xl font-bold text-[#E8E0CC]" style={{ fontFamily: "Georgia, serif" }}>Four Core Operational Frameworks</h2>
          <p className="text-xs text-[#E8E0CC]/40 mt-1">The structural translation of artifact wisdom into enterprise operations</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {frameworks.map((f, i) => (
            <motion.div key={f.number} {...g(i * 0.1)}
              className="border border-[#C9A84C]/12 bg-[#0d1422] p-6 relative overflow-hidden hover:border-[#C9A84C]/28 transition-colors">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />

              {/* Roman numeral */}
              <p className="text-5xl font-black text-[#C9A84C]/20 mb-4 leading-none" style={{ fontFamily: "Georgia, serif" }}>
                {NUMERALS[i]}
              </p>

              <p className="text-[9px] tracking-[0.25em] uppercase text-[#C9A84C]/60 mb-2">Framework {NUMERALS[i]}</p>
              <p className="text-sm font-bold text-[#E8E0CC] leading-snug mb-2">{f.name}</p>
              <p className="text-[9px] text-[#C9A84C]/60 mb-3 italic">Source: {f.source}</p>
              <p className="text-[10px] text-[#E8E0CC]/45 leading-relaxed">{f.description}</p>

              {/* Bottom faint icon */}
              <div className="absolute bottom-3 right-3 opacity-10">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  {f.icon === "constitution" && <rect x="8" y="6" width="24" height="28" rx="2" stroke="#C9A84C" strokeWidth="1.5" />}
                  {f.icon === "integration" && <><circle cx="12" cy="20" r="4" stroke="#C9A84C" strokeWidth="1.5" /><circle cx="28" cy="20" r="4" stroke="#C9A84C" strokeWidth="1.5" /><path d="M16 20h8" stroke="#C9A84C" strokeWidth="1.5" /></>}
                  {f.icon === "governance" && <path d="M20 6L10 12v8c0 7 4.5 12 10 14 5.5-2 10-7 10-14v-8L20 6z" stroke="#C9A84C" strokeWidth="1.5" fill="none" />}
                  {f.icon === "expansion" && <><circle cx="20" cy="20" r="12" stroke="#C9A84C" strokeWidth="1.5" /><path d="M20 8v24M8 20h24" stroke="#C9A84C" strokeWidth="1.5" /></>}
                </svg>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p {...g(0.45)} className="mt-4 text-[9px] text-center text-[#E8E0CC]/20 tracking-widest">
          Four Frameworks · Seven Artifacts Translated · Q3 2026
        </motion.p>
      </div>
    </section>
  );
}
