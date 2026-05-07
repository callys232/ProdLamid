"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Loader2, Copy, CheckCheck, ChevronDown,
  FileText, Target, Layers, DollarSign, Clock, Shield, Star
} from "lucide-react";

/* ── Types ─────────────────────────────────────────────────────── */
interface Proposal {
  executiveSummary: string;
  problemStatement: string;
  proposedApproach: string;
  scope: { included: string[]; excluded: string[] };
  deliverables: string[];
  timeline: { phase: string; duration: string; activities: string }[];
  investment: { total: string; breakdown: { item: string; cost: string }[]; paymentTerms: string };
  whyLamid: string[];
  terms: string[];
  callToAction: string;
}

/* ── Section component ─────────────────────────────────────────── */
function Section({ icon: Icon, title, children, color = "text-[#c21219]" }: any) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left">
        <span className="flex items-center gap-2 text-sm font-semibold text-white">
          <Icon className={`h-4 w-4 ${color}`} />{title}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
            <div className="px-5 pb-5 border-t border-white/10 pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */
export default function ProposalDrafter() {
  const [form, setForm] = useState({
    projectTitle: "", clientName: "", companyName: "", category: "",
    description: "", budget: "", timeline: "", skills: "", deliverables: "",
  });
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const generate = async () => {
    if (!form.projectTitle) { setError("Project title is required."); return; }
    setLoading(true); setError(""); setProposal(null);
    try {
      const res = await fetch("/api/ai/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          skills: form.skills.split(",").map(s => s.trim()).filter(Boolean),
          deliverables: form.deliverables.split(",").map(s => s.trim()).filter(Boolean),
          budget: form.budget ? Number(form.budget) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProposal(data.proposal);
    } catch (e: any) {
      setError(e.message || "Failed to generate proposal.");
    } finally { setLoading(false); }
  };

  const copyAll = () => {
    if (!proposal) return;
    const text = `
PROPOSAL — ${form.projectTitle}
Prepared for: ${form.clientName || "Valued Client"}, ${form.companyName}

EXECUTIVE SUMMARY
${proposal.executiveSummary}

PROBLEM STATEMENT
${proposal.problemStatement}

PROPOSED APPROACH
${proposal.proposedApproach}

SCOPE INCLUDED
${proposal.scope.included.map(s => `• ${s}`).join("\n")}

SCOPE EXCLUDED
${proposal.scope.excluded.map(s => `• ${s}`).join("\n")}

DELIVERABLES
${proposal.deliverables.map(d => `• ${d}`).join("\n")}

TIMELINE
${proposal.timeline.map(t => `${t.phase} (${t.duration}): ${t.activities}`).join("\n")}

INVESTMENT
Total: ${proposal.investment.total}
${proposal.investment.breakdown.map(b => `• ${b.item}: ${b.cost}`).join("\n")}
Payment Terms: ${proposal.investment.paymentTerms}

WHY LAMID
${proposal.whyLamid.map(w => `• ${w}`).join("\n")}

TERMS
${proposal.terms.map(t => `• ${t}`).join("\n")}

NEXT STEPS
${proposal.callToAction}
    `.trim();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputCls = "w-full rounded-xl bg-black border border-white/10 text-white text-sm px-4 py-2.5 focus:outline-none focus:border-[#c21219]/60 placeholder-gray-600";

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10 md:px-12">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold tracking-widest text-[#c21219] uppercase border border-[#c21219]/30 bg-[#c21219]/10 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Star className="h-3 w-3" /> Premium Feature
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          AI Proposal & Scoping Drafter
        </h1>
        <p className="mt-2 text-sm text-gray-400 max-w-xl">
          Generate a professional, client-ready consulting proposal in seconds. Fill in the details and let AI do the drafting.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8">
        {/* LEFT — Form */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-300">Project Details</h2>

          <div className="space-y-3">
            {[
              { label: "Project Title *", key: "projectTitle", placeholder: "e.g. HR Transformation Programme" },
              { label: "Client Name", key: "clientName", placeholder: "e.g. John Adeyemi" },
              { label: "Company / Organisation", key: "companyName", placeholder: "e.g. GTBank Foundation" },
              { label: "Budget (USD)", key: "budget", placeholder: "e.g. 25000", type: "number" },
              { label: "Timeline", key: "timeline", placeholder: "e.g. 3 months" },
            ].map(({ label, key, placeholder, type }) => (
              <div key={key}>
                <label className="text-xs text-gray-400 mb-1 block">{label}</label>
                <input type={type || "text"} placeholder={placeholder} value={(form as any)[key]} onChange={set(key)} className={inputCls} />
              </div>
            ))}

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Category</label>
              <select value={form.category} onChange={set("category")} className={inputCls}>
                <option value="">Select category…</option>
                {["Strategy Consulting", "HR & Talent", "Technology", "Financial Advisory", "Sustainable Development", "Training & Capacity Building", "NGO Consulting", "Other"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Project Description</label>
              <textarea rows={3} value={form.description} onChange={set("description")} placeholder="Briefly describe the project goals and context…" className={`${inputCls} resize-none`} />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Key Skills (comma-separated)</label>
              <input type="text" value={form.skills} onChange={set("skills")} placeholder="e.g. Leadership training, Change management" className={inputCls} />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Expected Deliverables (comma-separated)</label>
              <input type="text" value={form.deliverables} onChange={set("deliverables")} placeholder="e.g. Training manual, Workshop report" className={inputCls} />
            </div>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button onClick={generate} disabled={loading}
            className="w-full py-3 rounded-xl bg-[#c21219] hover:bg-red-700 text-white font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Generating proposal…</> : <><Sparkles className="h-4 w-4" />Generate Proposal</>}
          </button>
        </div>

        {/* RIGHT — Proposal Output */}
        <div className="space-y-4">
          {!proposal && !loading && (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center p-12 text-center">
              <FileText className="h-10 w-10 text-gray-600 mb-3" />
              <p className="text-sm text-gray-500">Your AI-generated proposal will appear here</p>
            </div>
          )}

          {loading && (
            <div className="rounded-2xl border border-white/10 bg-white/5 flex flex-col items-center justify-center p-12">
              <Loader2 className="h-8 w-8 text-[#c21219] animate-spin mb-3" />
              <p className="text-sm text-gray-400">Crafting your proposal…</p>
            </div>
          )}

          <AnimatePresence>
            {proposal && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                {/* Copy button */}
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">Proposal ready — review and copy</p>
                  <button onClick={copyAll}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/15 text-gray-300 hover:border-white/40 hover:text-white transition">
                    {copied ? <><CheckCheck className="h-3.5 w-3.5 text-emerald-400" />Copied!</> : <><Copy className="h-3.5 w-3.5" />Copy all</>}
                  </button>
                </div>

                <Section icon={FileText} title="Executive Summary">
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line text-justify">{proposal.executiveSummary}</p>
                </Section>

                <Section icon={Target} title="Problem Statement" color="text-orange-400">
                  <p className="text-sm text-gray-300 leading-relaxed text-justify">{proposal.problemStatement}</p>
                </Section>

                <Section icon={Layers} title="Proposed Approach" color="text-blue-400">
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line text-justify">{proposal.proposedApproach}</p>
                </Section>

                <Section icon={CheckCheck} title="Scope" color="text-emerald-400">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-emerald-400 mb-2">Included</p>
                      <ul className="space-y-1">{proposal.scope.included.map((s, i) => <li key={i} className="text-xs text-gray-300">✓ {s}</li>)}</ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-red-400 mb-2">Excluded</p>
                      <ul className="space-y-1">{proposal.scope.excluded.map((s, i) => <li key={i} className="text-xs text-gray-400">✕ {s}</li>)}</ul>
                    </div>
                  </div>
                </Section>

                <Section icon={Clock} title="Timeline" color="text-purple-400">
                  <div className="space-y-2">
                    {proposal.timeline.map((t, i) => (
                      <div key={i} className="flex gap-3 text-sm">
                        <span className="text-purple-400 font-medium whitespace-nowrap">{t.phase}</span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-400 text-xs">{t.duration}</span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-300 text-xs">{t.activities}</span>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section icon={DollarSign} title="Investment" color="text-yellow-400">
                  <p className="text-lg font-bold text-yellow-400 mb-2">{proposal.investment.total}</p>
                  <ul className="space-y-1 mb-3">
                    {proposal.investment.breakdown.map((b, i) => (
                      <li key={i} className="flex justify-between text-xs text-gray-300">
                        <span>{b.item}</span><span className="text-yellow-300">{b.cost}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-400">{proposal.investment.paymentTerms}</p>
                </Section>

                <Section icon={Star} title="Why Lamid" color="text-[#c21219]">
                  <ul className="space-y-1.5">
                    {proposal.whyLamid.map((w, i) => <li key={i} className="text-xs text-gray-300 flex gap-2"><span className="text-[#c21219]">▸</span>{w}</li>)}
                  </ul>
                </Section>

                <Section icon={Shield} title="Terms" color="text-gray-400">
                  <ul className="space-y-1">
                    {proposal.terms.map((t, i) => <li key={i} className="text-xs text-gray-400">• {t}</li>)}
                  </ul>
                </Section>

                <div className="rounded-xl border border-[#c21219]/30 bg-[#c21219]/5 px-5 py-4">
                  <p className="text-sm text-gray-200 italic">{proposal.callToAction}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
