"use client";
import { motion } from "framer-motion";
import type { IntegrationStage } from "@/mocks/sovereign";

interface Props { stages: IntegrationStage[] }
const g = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay: d } });

const statusStyle: Record<string, { color: string; dot: string }> = {
  complete: { color: "#C9A84C", dot: "bg-[#C9A84C]" },
  active:   { color: "#7BC98C", dot: "bg-[#7BC98C]" },
  pending:  { color: "#2d3a52", dot: "bg-[#2d3a52]" },
};

export default function IntegrationPipeline({ stages }: Props) {
  return (
    <section className="px-6 py-12 border-t border-[#C9A84C]/10" style={{ background: "#070b14" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div {...g(0)} className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#C9A84C]/70 mb-1">Phase II · Framework</p>
            <h2 className="text-xl font-bold text-[#E8E0CC]" style={{ fontFamily: "Georgia, serif" }}>Structural Integration Logic</h2>
            <p className="text-xs text-[#E8E0CC]/40 mt-1">The five-stage pipeline connecting artifacts to live enterprise systems</p>
          </div>
          <div className="border border-[#C9A84C]/20 text-[9px] tracking-widest text-[#C9A84C]/60 px-3 py-1.5 uppercase">
            Five-Stage Integration Pipeline · Q3 2026
          </div>
        </motion.div>

        {/* Zigzag timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 -translate-x-0.5 top-6 bottom-6 w-px bg-[#C9A84C]/15 hidden md:block" />

          <div className="flex flex-col gap-6">
            {stages.map((s, i) => {
              const st = statusStyle[s.status] ?? statusStyle.pending;
              const isLeft = s.side === "left";
              return (
                <motion.div key={s.number} {...g(i * 0.1)}
                  className={`relative flex ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} gap-4 items-start`}>

                  {/* Content card */}
                  <div className={`flex-1 border bg-[#0d1422] p-5 hover:border-[#C9A84C]/25 transition-colors`}
                    style={{ borderColor: `${st.color}20` }}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-[9px] tracking-[0.25em] uppercase mb-0.5" style={{ color: `${st.color}80` }}>Stage 0{s.number}</p>
                        <p className="font-bold text-[#E8E0CC]">{s.name}</p>
                      </div>
                      <span className="text-[9px] border px-2 py-0.5" style={{ color: st.color, borderColor: `${st.color}25`, backgroundColor: `${st.color}08` }}>
                        {s.timeline}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#E8E0CC]/45 leading-relaxed">{s.description}</p>
                  </div>

                  {/* Center node */}
                  <div className="hidden md:flex w-8 items-center justify-center shrink-0 mt-4">
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center z-10"
                      style={{ borderColor: st.color, backgroundColor: s.status === "pending" ? "#070b14" : st.color }}>
                      {s.status !== "pending" && <div className="w-1.5 h-1.5 rounded-full bg-[#070b14]" />}
                    </div>
                  </div>

                  {/* Empty side */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Stage dots */}
        <motion.div {...g(0.55)} className="flex items-center justify-center gap-2 mt-6">
          {stages.map((s) => {
            const st = statusStyle[s.status] ?? statusStyle.pending;
            return <div key={s.number} className="w-2 h-2 rounded-full" style={{ backgroundColor: st.color }} />;
          })}
        </motion.div>
      </div>
    </section>
  );
}
