"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Loader2, Copy, CheckCheck, ChevronDown,
  FileText, Target, Layers, DollarSign, Clock, Shield,
  Star, TrendingUp, AlertTriangle, BarChart3,
} from "lucide-react";

/* ── Types ─────────────────────────────────────────────────────── */
interface Proposal {
  executiveSummary:   string;
  problemStatement:   string;
  proposedApproach:   string;
  scope:              { included: string[]; excluded: string[] };
  deliverables:       string[];
  kpis:               string[];
  timeline:           { phase: string; duration: string; activities: string; milestone: string }[];
  investment: {
    total:        string;
    breakdown:    { item: string; cost: string; note: string }[];
    paymentTerms: string;
    roi:          string;
  };
  whyLamid:           { point: string; detail: string }[];
  risksMitigations:   { risk: string; mitigation: string }[];
  terms:              string[];
  callToAction:       string;
}

/* ── Collapsible section ────────────────────────────────────────── */
function Section({
  icon: Icon, title, color = "text-[#c21219]", badge, children,
}: {
  icon: React.ElementType; title: string; color?: string; badge?: string; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.03] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gray-100 dark:hover:bg-white/[0.03] transition"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
          <Icon className={`h-4 w-4 shrink-0 ${color}`} />
          {title}
          {badge && (
            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10">
              {badge}
            </span>
          )}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-600" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            transition={{ duration: 0.22 }} style={{ overflow: "hidden" }}
          >
            <div className="px-5 pb-5 border-t border-gray-100 dark:border-white/[0.06] pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Pill list ──────────────────────────────────────────────────── */
function BulletList({ items, color = "text-gray-700 dark:text-gray-300", dot = "▸", dotColor = "text-[#c21219]" }: {
  items: string[]; color?: string; dot?: string; dotColor?: string;
}) {
  return (
    <ul className="space-y-1.5">
      {items.map((s, i) => (
        <li key={i} className={`text-xs ${color} flex gap-2 leading-relaxed`}>
          <span className={`${dotColor} shrink-0 mt-0.5`}>{dot}</span>{s}
        </li>
      ))}
    </ul>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */
export default function ProposalDrafter() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [form, setForm] = useState({
    projectTitle: "", clientName: "", companyName: "", category: "",
    description: "", budget: "", timeline: "", skills: "", deliverables: "",
  });
  const [proposal,  setProposal]  = useState<Proposal | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [copied,    setCopied]    = useState(false);

  const set = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const generate = async () => {
    if (!form.projectTitle) { setError("Project title is required."); return; }
    setLoading(true); setError(""); setProposal(null);
    try {
      const res  = await fetch("/api/ai/proposal", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          ...form,
          skills:       form.skills.split(",").map((s) => s.trim()).filter(Boolean),
          deliverables: form.deliverables.split(",").map((s) => s.trim()).filter(Boolean),
          budget:       form.budget ? Number(form.budget) : undefined,
        }),
      });
      const data = await res.json();
      if (res.status === 429) throw new Error(data.message + " Create a free account to keep going.");
      if (!res.ok) throw new Error(data.message);
      setProposal(data.proposal);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to generate proposal.");
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    if (!proposal) return;
    const lines: string[] = [
      `CONSULTING PROPOSAL — ${form.projectTitle.toUpperCase()}`,
      `Prepared for: ${form.clientName || "Valued Client"}${form.companyName ? `, ${form.companyName}` : ""}`,
      `Prepared by: LAMID ONE`,
      ``,
      `═══════════════════════════════════════`,
      `EXECUTIVE SUMMARY`,
      `═══════════════════════════════════════`,
      proposal.executiveSummary,
      ``,
      `PROBLEM STATEMENT`,
      `───────────────────────────────────────`,
      proposal.problemStatement,
      ``,
      `PROPOSED APPROACH`,
      `───────────────────────────────────────`,
      proposal.proposedApproach,
      ``,
      `SCOPE`,
      `───────────────────────────────────────`,
      `Included:`,
      ...proposal.scope.included.map((s) => `  ✓ ${s}`),
      ``,
      `Excluded:`,
      ...proposal.scope.excluded.map((s) => `  ✕ ${s}`),
      ``,
      `DELIVERABLES`,
      `───────────────────────────────────────`,
      ...proposal.deliverables.map((d) => `  • ${d}`),
      ``,
      `SUCCESS METRICS (KPIs)`,
      `───────────────────────────────────────`,
      ...(proposal.kpis ?? []).map((k) => `  → ${k}`),
      ``,
      `TIMELINE`,
      `───────────────────────────────────────`,
      ...proposal.timeline.map((t) => `${t.phase} (${t.duration})\n  Activities: ${t.activities}\n  Milestone: ${t.milestone || "—"}`),
      ``,
      `INVESTMENT`,
      `───────────────────────────────────────`,
      `Total: ${proposal.investment.total}`,
      ...proposal.investment.breakdown.map((b) => `  • ${b.item}: ${b.cost}${b.note ? ` — ${b.note}` : ""}`),
      `Payment Terms: ${proposal.investment.paymentTerms}`,
      proposal.investment.roi ? `ROI: ${proposal.investment.roi}` : "",
      ``,
      `WHY LAMID ONE`,
      `───────────────────────────────────────`,
      ...(proposal.whyLamid ?? []).map((w) =>
        typeof w === "string" ? `  ▸ ${w}` : `  ▸ ${w.point}: ${w.detail}`
      ),
      ``,
      `RISKS & MITIGATIONS`,
      `───────────────────────────────────────`,
      ...(proposal.risksMitigations ?? []).map((r) => `  Risk: ${r.risk}\n  Mitigation: ${r.mitigation}`),
      ``,
      `TERMS & CONDITIONS`,
      `───────────────────────────────────────`,
      ...proposal.terms.map((t) => `  • ${t}`),
      ``,
      `NEXT STEPS`,
      `───────────────────────────────────────`,
      proposal.callToAction,
    ];
    navigator.clipboard.writeText(lines.filter((l) => l !== undefined).join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const inputCls = "w-full rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm px-4 py-2.5 focus:outline-none focus:border-[#c21219]/60 focus:ring-1 focus:ring-[#c21219]/20 placeholder-gray-400 dark:placeholder-gray-600 transition";
  const selectCls = inputCls + " appearance-none cursor-pointer bg-white dark:bg-[#0a0a0a]";

  return (
    <div className="min-h-screen aivora-section text-gray-900 dark:text-white px-4 py-10 md:px-12">
      {/* ── Header ── */}
      <div className="max-w-6xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 rounded-full mb-3">
          <Star className="h-3 w-3" /> Free Tool
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
          AI Proposal & Scoping Drafter
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-xl">
          Generate a client-ready consulting proposal in seconds — powered by Claude Sonnet 4.6.
          Fill in the engagement brief and let AI do the strategic drafting.
        </p>

        {/* Model badge */}
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 text-[11px] text-gray-600 dark:text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Claude Sonnet 4.6 · via OpenRouter
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
        {/* ── LEFT: Form ── */}
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-gray-100 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.03] p-5 flex flex-col gap-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Engagement Brief</h2>

            {([
              { label: "Project Title",           key: "projectTitle",  ph: "e.g. HR Transformation Programme",    req: true },
              { label: "Client Name",             key: "clientName",    ph: "e.g. John Adeyemi" },
              { label: "Company / Organisation",  key: "companyName",   ph: "e.g. GTBank Foundation" },
              { label: "Budget (USD)",            key: "budget",        ph: "e.g. 25000", type: "number" },
              { label: "Desired Timeline",        key: "timeline",      ph: "e.g. 3 months" },
            ] as { label: string; key: string; ph: string; req?: boolean; type?: string }[]).map(({ label, key, ph, req, type }) => (
              <div key={key}>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block mb-1.5">
                  {label}{req && <span className="ml-0.5 text-[#c21219]">*</span>}
                </label>
                <input
                  type={type ?? "text"} placeholder={ph}
                  value={(form as Record<string, string>)[key]}
                  onChange={set(key)} className={inputCls}
                />
              </div>
            ))}

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block mb-1.5">Category</label>
              <select value={form.category} onChange={set("category")} className={selectCls} aria-label="Category" title="Category">
                <option value="">Select category…</option>
                {[
                  "Strategy Consulting", "HR & Talent", "Technology",
                  "Financial Advisory", "Sustainable Development",
                  "Training & Capacity Building", "NGO Consulting",
                  "Sales Enablement", "Digital Transformation", "Other",
                ].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block mb-1.5">Project Description</label>
              <textarea rows={3} value={form.description} onChange={set("description")}
                placeholder="Describe the goals, context, and key challenges…"
                className={inputCls + " resize-none"} />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block mb-1.5">Key Skills (comma-separated)</label>
              <input value={form.skills} onChange={set("skills")} placeholder="Leadership training, Change management…" className={inputCls} />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block mb-1.5">Expected Deliverables (comma-separated)</label>
              <input value={form.deliverables} onChange={set("deliverables")} placeholder="Training manual, Workshop report…" className={inputCls} />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 flex items-center gap-1.5 px-1">
              <span className="inline-block w-1 h-1 rounded-full bg-red-400" />{error}
            </p>
          )}

          <button
            type="button"
            onClick={generate}
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#c21219] to-red-700
                       hover:from-red-700 hover:to-red-800 text-white font-extrabold text-sm
                       shadow-[0_8px_32px_rgba(194,18,25,0.35)]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition flex items-center justify-center gap-2"
          >
            {loading
              ? <><Loader2 className="h-4 w-4 animate-spin" />Generating proposal…</>
              : <><Sparkles className="h-4 w-4" />Generate Proposal</>}
          </button>
        </div>

        {/* ── RIGHT: Output ── */}
        <div className="flex flex-col gap-4 min-h-[400px]">
          {!proposal && !loading && (
            <div className="flex-1 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center p-16 text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                <FileText className="h-7 w-7 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-400">Your proposal will appear here</p>
                <p className="text-xs text-gray-600 mt-1">Claude Sonnet 4.6 will draft all 10 sections</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col items-center justify-center p-16 gap-4">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-2 border-[#c21219]/20" />
                <div className="absolute inset-0 rounded-full border-t-2 border-[#c21219] animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-[#c21219]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-300">Crafting your proposal…</p>
                <p className="text-xs text-gray-600 mt-1">Claude is drafting 10 sections</p>
              </div>
            </div>
          )}

          <AnimatePresence>
            {proposal && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3"
              >
                {/* Toolbar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Proposal ready</span>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      10 sections
                    </span>
                  </div>
                  {!authLoading && isAuthenticated ? (
                    <button type="button" onClick={copyAll}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border border-white/15 text-gray-300 hover:border-white/40 hover:text-white transition">
                      {copied ? <><CheckCheck className="h-3.5 w-3.5 text-emerald-400" />Copied!</> : <><Copy className="h-3.5 w-3.5" />Copy all</>}
                    </button>
                  ) : (
                    <Link href="/signup"
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border border-[#C12129]/40 text-[#C12129] hover:bg-[#C12129]/10 transition">
                      <Copy className="h-3.5 w-3.5" />Sign up to save
                    </Link>
                  )}
                </div>

                {/* 1 — Executive Summary */}
                <Section icon={FileText} title="Executive Summary">
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line text-justify">
                    {proposal.executiveSummary}
                  </p>
                </Section>

                {/* 2 — Problem Statement */}
                <Section icon={Target} title="Problem Statement" color="text-orange-400">
                  <p className="text-sm text-gray-300 leading-relaxed text-justify">
                    {proposal.problemStatement}
                  </p>
                </Section>

                {/* 3 — Proposed Approach */}
                <Section icon={Layers} title="Proposed Approach" color="text-blue-400">
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line text-justify">
                    {proposal.proposedApproach}
                  </p>
                </Section>

                {/* 4 — Scope */}
                <Section icon={CheckCheck} title="Scope of Work" color="text-emerald-400">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400 mb-2">Included</p>
                      <BulletList items={proposal.scope.included} dot="✓" dotColor="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-red-400 mb-2">Excluded</p>
                      <BulletList items={proposal.scope.excluded} dot="✕" dotColor="text-red-400" color="text-gray-400" />
                    </div>
                  </div>
                </Section>

                {/* 5 — Deliverables */}
                <Section icon={FileText} title="Deliverables" color="text-cyan-400" badge="Specific outputs">
                  <BulletList items={proposal.deliverables} dot="→" dotColor="text-cyan-400" />
                </Section>

                {/* 6 — KPIs (NEW) */}
                {proposal.kpis?.length > 0 && (
                  <Section icon={BarChart3} title="Success Metrics & KPIs" color="text-amber-400" badge="New">
                    <BulletList items={proposal.kpis} dot="◎" dotColor="text-amber-400" />
                  </Section>
                )}

                {/* 7 — Timeline */}
                <Section icon={Clock} title="Delivery Timeline" color="text-purple-400">
                  <div className="flex flex-col gap-3">
                    {proposal.timeline.map((t, i) => (
                      <div key={i} className="rounded-xl bg-white/[0.03] border border-white/[0.07] px-4 py-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-bold text-purple-400">{t.phase}</span>
                          <span className="text-[10px] text-gray-500 bg-white/10 px-1.5 py-0.5 rounded-full">{t.duration}</span>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed mb-1">{t.activities}</p>
                        {t.milestone && (
                          <p className="text-[10px] text-purple-300/70 flex items-center gap-1">
                            <span className="text-purple-400">◆</span> Milestone: {t.milestone}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </Section>

                {/* 8 — Investment */}
                <Section icon={DollarSign} title="Investment" color="text-yellow-400">
                  <p className="text-2xl font-extrabold text-yellow-400 mb-3">{proposal.investment.total}</p>
                  <div className="flex flex-col gap-2 mb-3">
                    {proposal.investment.breakdown.map((b, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:justify-between gap-0.5 text-xs rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2">
                        <span className="text-gray-300 font-medium">{b.item}</span>
                        <div className="text-right">
                          <span className="text-yellow-300 font-bold">{b.cost}</span>
                          {b.note && <p className="text-gray-500 text-[10px]">{b.note}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    <span className="font-semibold text-gray-300">Payment: </span>{proposal.investment.paymentTerms}
                  </p>
                  {proposal.investment.roi && (
                    <div className="rounded-xl bg-yellow-500/[0.07] border border-yellow-500/20 px-3 py-2.5">
                      <p className="text-[10px] font-black uppercase tracking-wider text-yellow-400 mb-0.5">Expected ROI</p>
                      <p className="text-xs text-yellow-200/80">{proposal.investment.roi}</p>
                    </div>
                  )}
                </Section>

                {/* 9 — Why LAMID ONE */}
                <Section icon={Star} title="Why LAMID ONE" color="text-[#c21219]">
                  <div className="flex flex-col gap-3">
                    {(proposal.whyLamid ?? []).map((w, i) => {
                      const isObj = typeof w === "object" && w !== null;
                      return (
                        <div key={i} className="rounded-xl bg-white/[0.03] border border-white/[0.07] px-4 py-3">
                          {isObj ? (
                            <>
                              <p className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                                <span className="text-[#c21219]">▸</span>{(w as { point: string }).point}
                              </p>
                              <p className="text-xs text-gray-400 leading-relaxed">{(w as { detail: string }).detail}</p>
                            </>
                          ) : (
                            <p className="text-xs text-gray-300 flex gap-2"><span className="text-[#c21219] shrink-0">▸</span>{w as string}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Section>

                {/* 10 — Risks & Mitigations (NEW) */}
                {proposal.risksMitigations?.length > 0 && (
                  <Section icon={AlertTriangle} title="Risks & Mitigations" color="text-orange-400" badge="New">
                    <div className="flex flex-col gap-3">
                      {proposal.risksMitigations.map((r, i) => (
                        <div key={i} className="rounded-xl bg-white/[0.03] border border-white/[0.07] px-4 py-3">
                          <p className="text-xs font-semibold text-orange-400 mb-1 flex items-center gap-1.5">
                            <AlertTriangle className="w-3 h-3" />{r.risk}
                          </p>
                          <p className="text-xs text-gray-400 leading-relaxed flex gap-1.5">
                            <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>{r.mitigation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Terms */}
                <Section icon={Shield} title="Terms & Conditions" color="text-gray-400">
                  <BulletList items={proposal.terms} dot="•" dotColor="text-gray-500" color="text-gray-400" />
                </Section>

                {/* CTA */}
                <div className="rounded-2xl border border-[#c21219]/30 bg-gradient-to-br from-[#c21219]/[0.07] to-transparent px-6 py-5">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-[#c21219]" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#c21219]">Next Steps</p>
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed">{proposal.callToAction}</p>
                </div>

                {/* Sign-up banner for guests */}
                {!authLoading && !isAuthenticated && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="rounded-2xl border border-[#C12129]/40 bg-gradient-to-br from-[#C12129]/10 via-black to-black px-6 py-6 text-center"
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest aivora-gradient-text mb-2">Save your proposal</p>
                    <h3 className="text-base font-bold text-white mb-1">Create a free account to copy, share, and use this proposal.</h3>
                    <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                      Sign up to unlock the full copy, submit the proposal through LAMID ONE, and connect with the right consultants to deliver on it.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link href="/signup" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#C12129] text-white hover:bg-[#a01a20] transition-colors shadow-[0_0_18px_rgba(193,33,41,0.4)]">
                        Create Free Account
                      </Link>
                      <Link href="/signin" className="px-6 py-2.5 rounded-xl text-sm font-semibold border border-white/20 text-white/70 hover:border-white/40 hover:text-white transition-colors">
                        Sign In
                      </Link>
                    </div>
                  </motion.div>
                )}

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
