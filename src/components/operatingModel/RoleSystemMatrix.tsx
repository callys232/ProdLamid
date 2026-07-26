"use client";
import { motion } from "framer-motion";
import type { LeadershipRole } from "@/mocks/operatingModel";

interface Props { leadershipRoles: LeadershipRole[] }
const g = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay: d } });

const statusStyle: Record<string, string> = {
  active:   "text-[#C9A84C] border-[#C9A84C]/30 bg-[#C9A84C]/10",
  assigned: "text-[#7BC98C] border-[#7BC98C]/30 bg-[#7BC98C]/10",
  pending:  "text-[#7B9EC9] border-[#7B9EC9]/30 bg-[#7B9EC9]/10",
};

export default function RoleSystemMatrix({ leadershipRoles }: Props) {
  return (
    <section className="px-6 py-12 border-t border-[#C9A84C]/10" style={{ background: "#0a0e1a" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div {...g(0)} className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#C9A84C]/70 mb-1">Leadership Role-to-System Mapping Matrix</p>
            <h2 className="text-xl font-bold text-[#E8E0CC]" style={{ fontFamily: "Georgia, serif" }}>Leadership Role-to-System Mapping Matrix</h2>
            <p className="text-xs text-[#E8E0CC]/40 mt-1">Seven leadership roles — each anchored to a designated enterprise system</p>
          </div>
          <div className="border border-[#C9A84C]/20 px-3 py-1.5 text-[9px] tracking-[0.2em] uppercase text-[#C9A84C]/70">
            Phase II — Enterprise Operating Model
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {leadershipRoles.map((t, i) => (
            <motion.div key={t.number} {...g(i * 0.07)}
              className={`border bg-[#0d1422] p-5 relative hover:border-[#C9A84C]/30 transition-colors ${t.isFinalGate ? "border-[#C9A84C]/30 sm:col-span-2 lg:col-span-2" : "border-[#C9A84C]/12"}`}>

              {t.isFinalGate && (
                <div className="absolute top-3 right-3 text-[9px] border border-[#C9A84C]/30 text-[#C9A84C]/70 px-2 py-0.5 tracking-widest">
                  FINAL GATE
                </div>
              )}

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-black text-[#C9A84C]/50">{t.number}</span>
                <p className="text-[9px] tracking-[0.25em] uppercase text-[#E8E0CC]/35">Leadership Role Position</p>
              </div>

              <p className="font-bold text-[#C9A84C] mb-2 leading-snug">{t.title}</p>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-[#E8E0CC]/80">{t.system}</span>
                <span className="text-[9px] border border-[#C9A84C]/25 text-[#C9A84C]/70 px-1.5 py-0.5">{t.systemCode}</span>
              </div>

              <p className="text-[10px] text-[#E8E0CC]/40 leading-relaxed mb-3">{t.description}</p>

              <span className={`inline-block text-[9px] font-bold tracking-wider border px-2 py-0.5 ${statusStyle[t.status] ?? statusStyle.pending}`}>
                {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.p {...g(0.5)} className="mt-4 text-[10px] text-[#E8E0CC]/30 text-center tracking-widest">
          7 LEADERSHIP ROLES · 7 ENTERPRISE SYSTEMS BOUND · PHASE II OPERATIONAL
        </motion.p>
      </div>
    </section>
  );
}
