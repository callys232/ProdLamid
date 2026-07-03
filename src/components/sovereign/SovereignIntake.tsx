"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface Props {
  onSubmit: (ctx: Record<string, string>) => void;
  loading:  boolean;
  onUseMock: () => void;
}

const g = (d = 0) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: d } });

export default function SovereignIntake({ onSubmit, loading, onUseMock }: Props) {
  const [form, setForm] = useState({
    organisationName:  "",
    industry:          "",
    size:              "",
    currentChallenge:  "",
    sovereignGoal:     "",
    additionalContext: "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const inputCls = "w-full bg-[#0d1422] border border-[#C9A84C]/15 text-[#E8E0CC] text-sm px-4 py-3 focus:outline-none focus:border-[#C9A84C]/50 placeholder-[#E8E0CC]/20 transition-colors";
  const labelCls = "text-[9px] font-bold tracking-[0.3em] uppercase text-[#C9A84C]/60 block mb-2";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: "#070b14" }}>
      <div className="w-full max-w-xl">

        {/* Header */}
        <motion.div {...g(0)} className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
              <path d="M2 19L2 6L9 12.5L14 3L19 12.5L26 6L26 19Z" fill="#C9A84C" opacity="0.8" />
              <rect x="2" y="19" width="24" height="2" rx="1" fill="#C9A84C" opacity="0.5" />
            </svg>
          </div>
          <p className="text-[10px] tracking-[0.5em] uppercase text-[#C9A84C] mb-2">Sovereign Assessment</p>
          <h2 className="text-2xl font-black text-[#E8E0CC] mb-2" style={{ fontFamily: "Georgia, serif" }}>Initiate Your Sovereign Assessment</h2>
          <p className="text-[11px] text-[#E8E0CC]/40 leading-relaxed">
            Provide enterprise context to generate a personalised Sovereign Architecture assessment. Every score, milestone, and action plan will be specific to your organisation.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div {...g(0.1)} className="border border-[#C9A84C]/15 bg-[#0a0e1a] p-6">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" style={{ position: "relative" }} />

          <div className="flex flex-col gap-5">
            <div>
              <label className={labelCls}>Organisation Name <span className="text-[#C9A84C]">*</span></label>
              <input value={form.organisationName} onChange={set("organisationName")}
                placeholder="e.g. Horizon Capital Group" className={inputCls} disabled={loading} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Industry</label>
                <select value={form.industry} onChange={set("industry")} disabled={loading} className={inputCls + " appearance-none cursor-pointer"}>
                  <option value="">Select…</option>
                  {["Financial Services","Technology","Healthcare","Professional Services","Government","Manufacturing","NGO / Non-profit","Real Estate","Energy","Education","Other"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Organisation Size</label>
                <select value={form.size} onChange={set("size")} disabled={loading} className={inputCls + " appearance-none cursor-pointer"}>
                  <option value="">Select…</option>
                  {["1–50","51–200","201–500","500–2,000","2,000–10,000","10,000+"].map(o => <option key={o}>{o} employees</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>Current Sovereign Challenge <span className="text-[#C9A84C]">*</span></label>
              <textarea rows={2} value={form.currentChallenge} onChange={set("currentChallenge")} disabled={loading}
                placeholder="What is the primary governance or operational challenge this enterprise faces right now?"
                className={inputCls + " resize-none"} />
            </div>

            <div>
              <label className={labelCls}>Sovereign Goal <span className="text-[#C9A84C]">*</span></label>
              <textarea rows={2} value={form.sovereignGoal} onChange={set("sovereignGoal")} disabled={loading}
                placeholder="What does full sovereign operational governance look like for this enterprise?"
                className={inputCls + " resize-none"} />
            </div>

            <div>
              <label className={labelCls}>Additional Context</label>
              <textarea rows={2} value={form.additionalContext} onChange={set("additionalContext")} disabled={loading}
                placeholder="Current systems, governance structures, expansion targets, or any context that will sharpen the assessment…"
                className={inputCls + " resize-none"} />
            </div>

            {loading && (
              <div className="flex flex-col items-center gap-2 py-2">
                <div className="flex gap-1.5 items-center">
                  {[0,1,2,3].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <p className="text-[10px] text-[#C9A84C]/70 tracking-widest">Analysing your enterprise against the Sovereign Architecture…</p>
              </div>
            )}

            <button type="button"
              onClick={() => {
                if (!form.organisationName || !form.currentChallenge || !form.sovereignGoal) return;
                onSubmit(form);
              }}
              disabled={loading || !form.organisationName || !form.currentChallenge || !form.sovereignGoal}
              className="w-full py-4 border border-[#C9A84C]/40 bg-[#C9A84C]/10 hover:bg-[#C9A84C]/18 text-[#C9A84C] text-[11px] font-bold tracking-[0.3em] uppercase disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" />Generating Sovereign Assessment…</>
                : <>✦ Initiate Sovereign Assessment</>}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#C9A84C]/10" /></div>
              <div className="relative flex justify-center text-[9px] uppercase tracking-widest">
                <span className="bg-[#0a0e1a] px-3 text-[#E8E0CC]/25">or</span>
              </div>
            </div>

            <button type="button" onClick={onUseMock}
              className="w-full py-3 border border-[#C9A84C]/10 text-[#E8E0CC]/35 hover:text-[#E8E0CC]/55 hover:border-[#C9A84C]/20 text-[10px] tracking-widest uppercase transition-colors">
              Preview with Demo Data
            </button>
          </div>
        </motion.div>

        <motion.p {...g(0.3)} className="text-center text-[9px] text-[#E8E0CC]/20 tracking-widest mt-4">
          Sovereign Architecture · Phase II · Classified · Q3 2026
        </motion.p>
      </div>
    </div>
  );
}
