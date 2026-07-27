"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Trash2, TriangleAlert, CheckCircle2, ArrowUpRight, Loader2 } from "lucide-react";
import { computeCareerPath } from "@/lib/talent/careerPath";
import type { SkillHeld, CompletedLearning } from "@/lib/talent/careerPath";
import { TARGET_ROLES, requirementsFor } from "@/lib/talent/roleCatalogue";
import { LMS_ENTRY_ROUTE } from "@/lib/externalPlatforms";
import EngineResultsGate from "./EngineResultsGate";

/**
 * Career path readiness.
 *
 * Compares completed learning against what a target role asks for. A signed-in
 * user has their role and skills filled in from their profile; everyone else
 * types the same fields. The tool is fully usable either way — the gate sits
 * immediately before the results and nowhere else.
 *
 * Completed learning arrives from the LMS via LearningRecord where it has been
 * synced; anything taken elsewhere is still entered by hand. Historically it
 * lived only in the external LMS,
 * not in this database, and pretending otherwise would produce a readiness
 * score built on nothing.
 */

const ACCENT = "#6D28D9";      // LAMID TALENT

const inputCls =
  "w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-black " +
  "text-black dark:text-white text-sm px-3 py-2 placeholder-gray-500 dark:placeholder-white/40 " +
  "focus:outline-none focus:border-[#6D28D9] focus:ring-1 focus:ring-[#6D28D9]/30 transition";

const uid = () => `r-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export default function CareerPathTool() {
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole,  setTargetRole]  = useState(TARGET_ROLES[0]);
  const [skills,   setSkills]   = useState<(SkillHeld & { id: string })[]>([
    { id: uid(), name: "", level: 3 },
  ]);
  const [learning, setLearning] = useState<(CompletedLearning & { id: string })[]>([
    { id: uid(), title: "", covers: [], hours: 0, certified: false },
  ]);
  const [prefilled, setPrefilled] = useState<null | boolean>(null);
  const [syncedCount, setSyncedCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  /* Fill in what we already know. A visitor gets an empty form and the same
     tool — never a wall asking them to sign in first. */
  useEffect(() => {
    let cancelled = false;
    fetch("/api/talent/career-path/prefill", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled || !d) { setPrefilled(false); return; }
        if (d.currentRole) setCurrentRole(d.currentRole);
        if (Array.isArray(d.skills) && d.skills.length) {
          setSkills(d.skills.map((s: SkillHeld) => ({ ...s, id: uid() })));
        }
        /* Courses the LMS has reported. Replaces the blank starter row rather
           than appending to it, so the user is not left deleting an empty line. */
        if (Array.isArray(d.learning) && d.learning.length) {
          setLearning(d.learning.map((l: CompletedLearning) => ({ ...l, id: uid() })));
          setSyncedCount(d.learning.length);
        }
        setPrefilled(Boolean(d.signedIn && (d.currentRole || d.skills?.length || d.learning?.length)));
      })
      .catch(() => setPrefilled(false));
    return () => { cancelled = true; };
  }, []);

  const requirements = useMemo(() => requirementsFor(targetRole), [targetRole]);

  const result = useMemo(
    () => computeCareerPath({
      currentRole, targetRole,
      skills:   skills.filter((s) => s.name.trim()),
      learning: learning.filter((l) => l.title.trim()),
      requirements,
    }),
    [currentRole, targetRole, skills, learning, requirements],
  );

  const canSubmit = skills.some((s) => s.name.trim()) || learning.some((l) => l.title.trim());

  const setSkill = (id: string, patch: Partial<SkillHeld>) =>
    setSkills((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const setCourse = (id: string, patch: Partial<CompletedLearning>) =>
    setLearning((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <div className="min-h-screen bg-white px-4 pb-16 pt-24 text-black dark:bg-black dark:text-white">
      <div className="mx-auto max-w-5xl">

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }} className="mb-10"
        >
          <p className="lamidone-gradient-text mb-3 text-[10px] font-bold uppercase tracking-[0.4em]">
            LAMID TALENT
          </p>
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl" style={{ color: ACCENT }}>
            Career Path Assessment
          </h1>
          <p className="max-w-2xl text-sm text-gray-600 dark:text-white/60">
            Measure what you have learned against what your target role actually asks for.
            Every figure is computed from what you enter — nothing is estimated.
          </p>
        </motion.div>

        {prefilled && (
          <div className="mb-6 flex items-start gap-2 rounded-xl border border-[#6D28D9]/30 bg-[#6D28D9]/[0.06] p-4 text-xs text-[#6D28D9] dark:text-[#C4B5FD]">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Your role and skills came from your profile
            {syncedCount > 0 && `, and ${syncedCount} completed ${syncedCount === 1 ? "course" : "courses"} from your learning record`}.
            Adjust any level that is not right — the profile records the skill, not the depth.
          </div>
        )}

        {/* ── Roles ── */}
        <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/15 dark:bg-black">
          <p className="mb-5 text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
            Where you are, where you are going
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cp-current" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50">
                Current role
              </label>
              <input id="cp-current" className={inputCls} value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)} placeholder="e.g. Business Analyst" />
            </div>
            <div>
              <label htmlFor="cp-target" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50">
                Target role
              </label>
              <select id="cp-target" className={inputCls} value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}>
                {TARGET_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-gray-600 dark:text-white/45">
            {targetRole} is measured on {requirements.length} skills, weighted by how much the role depends on each.
          </p>
        </section>

        {/* ── Skills held ── */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/15 dark:bg-black">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-white/15">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
              Skills you hold
            </p>
            <p className="mt-1 text-[11px] text-gray-600 dark:text-white/50">
              Rate honestly. 0 is none, 3 is competent, 5 is what you would be hired for.
            </p>
          </div>
          <div className="flex flex-col">
            {skills.map((s) => (
              <div key={s.id} className="flex items-center gap-3 border-b border-gray-100 px-6 py-2.5 last:border-0 dark:border-white/8">
                <input className={inputCls + " flex-1"} value={s.name} placeholder="Skill"
                  aria-label="Skill name"
                  onChange={(e) => setSkill(s.id, { name: e.target.value })} />
                <input type="range" min={0} max={5} value={s.level}
                  aria-label={`${s.name || "Skill"} level`}
                  onChange={(e) => setSkill(s.id, { level: Number(e.target.value) })}
                  className="w-28 shrink-0 accent-[#6D28D9]" />
                <span className="w-6 shrink-0 text-center text-sm font-bold tabular-nums">{s.level}</span>
                <button type="button" aria-label={`Remove ${s.name || "skill"}`}
                  onClick={() => setSkills((r) => r.filter((x) => x.id !== s.id))}
                  className="p-1 text-gray-400 transition hover:text-red-500 dark:text-white/30">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 px-6 py-3 dark:border-white/15">
            <button type="button"
              onClick={() => setSkills((r) => [...r, { id: uid(), name: "", level: 3 }])}
              className="inline-flex items-center gap-1.5 text-xs font-semibold transition hover:opacity-70"
              style={{ color: ACCENT }}>
              <Plus className="h-3.5 w-3.5" /> Add skill
            </button>
          </div>
        </section>

        {/* ── Completed learning ── */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/15 dark:bg-black">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-white/15">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
              Learning completed
            </p>
            <p className="mt-1 text-[11px] text-gray-600 dark:text-white/50">
              Courses and certifications you have finished. List the skills each one evidences,
              separated by commas.
            </p>
          </div>
          <div className="flex flex-col">
            {learning.map((c) => (
              <div key={c.id} className="grid grid-cols-1 gap-2 border-b border-gray-100 px-6 py-3 last:border-0 sm:grid-cols-[1.2fr_1.4fr_auto_auto_auto] sm:items-center dark:border-white/8">
                <input className={inputCls} value={c.title} placeholder="Course or certification"
                  aria-label="Course title"
                  onChange={(e) => setCourse(c.id, { title: e.target.value })} />
                <input className={inputCls} value={(c.covers ?? []).join(", ")}
                  placeholder="Skills it covers"
                  aria-label="Skills covered"
                  onChange={(e) => setCourse(c.id, { covers: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} />
                <input type="number" min={0} className={inputCls + " sm:w-20"} value={c.hours ?? 0}
                  aria-label="Hours"
                  onChange={(e) => setCourse(c.id, { hours: Number(e.target.value) || 0 })} />
                <label className="flex shrink-0 items-center gap-1.5 text-[11px] text-gray-600 dark:text-white/50">
                  <input type="checkbox" checked={Boolean(c.certified)} className="accent-[#6D28D9]"
                    onChange={(e) => setCourse(c.id, { certified: e.target.checked })} />
                  Certified
                </label>
                <button type="button" aria-label={`Remove ${c.title || "course"}`}
                  onClick={() => setLearning((r) => r.filter((x) => x.id !== c.id))}
                  className="p-1 text-gray-400 transition hover:text-red-500 dark:text-white/30">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-6 py-3 dark:border-white/15">
            <button type="button"
              onClick={() => setLearning((r) => [...r, { id: uid(), title: "", covers: [], hours: 0, certified: false }])}
              className="inline-flex items-center gap-1.5 text-xs font-semibold transition hover:opacity-70"
              style={{ color: ACCENT }}>
              <Plus className="h-3.5 w-3.5" /> Add course
            </button>
            <Link href={LMS_ENTRY_ROUTE}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-600 hover:underline dark:text-white/50">
              Find your completed courses in the LMS <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </section>

        {!submitted ? (
          <button type="button" disabled={!canSubmit} onClick={() => setSubmitted(true)}
            className="w-full rounded-2xl py-3.5 text-sm font-extrabold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
            style={{ background: ACCENT }}>
            {prefilled === null
              ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Loading your profile…</span>
              : <>See how ready you are</>}
          </button>
        ) : (
          /* The gate sits here and nowhere else — everything above stayed open. */
          <EngineResultsGate>
            <div className="flex flex-col gap-6">

              <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  { label: "Requirements met", value: `${result.met.length}/${result.met.length + result.gaps.length}` },
                  { label: "Readiness",         value: `${result.readinessPct}%` },
                  { label: "Weighted readiness", value: `${result.weightedReadiness}%` },
                  { label: "Learning logged",   value: `${result.totalHours}h · ${result.certifiedCount} certified` },
                ].map((t) => (
                  <div key={t.label} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/15 dark:bg-black">
                    <p className="mb-1.5 text-lg font-bold leading-none tabular-nums">{t.value}</p>
                    <p className="text-[11px] text-gray-600 dark:text-white/50">{t.label}</p>
                  </div>
                ))}
              </section>

              {result.warnings.length > 0 && (
                <section className="rounded-2xl border border-amber-400/40 bg-amber-50 p-5 dark:bg-amber-950/20">
                  <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                    <TriangleAlert className="h-3.5 w-3.5" />Worth knowing
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {result.warnings.map((w) => (
                      <li key={w} className="text-sm text-amber-800 dark:text-amber-300/90">• {w}</li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/15 dark:bg-black">
                <p className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
                  Gaps, most consequential first
                </p>
                {result.gaps.length === 0 ? (
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    Every requirement for {targetRole} is met at the level the role asks for.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {result.gaps.map((g) => (
                      <li key={g.skill}>
                        <div className="mb-1 flex items-baseline justify-between gap-3 text-xs">
                          <span className="font-semibold text-black dark:text-white">{g.skill}</span>
                          <span className="tabular-nums text-gray-600 dark:text-white/45">
                            at {g.held} · needs {g.needed} · weight {g.weight}
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (g.held / g.needed) * 100)}%`, background: ACCENT }} />
                        </div>
                        {g.evidencedBy.length > 0 && (
                          <p className="mt-1 text-[10px] text-gray-600 dark:text-white/40">
                            Partial evidence: {g.evidencedBy.join(", ")}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {result.nextSteps.length > 0 && (
                <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/15 dark:bg-black">
                  <p className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
                    Do these three next
                  </p>
                  <ol className="flex flex-col gap-2.5">
                    {result.nextSteps.map((s, i) => (
                      <li key={s} className="flex gap-3 text-sm text-gray-700 dark:text-white/70">
                        <span className="shrink-0 font-bold" style={{ color: ACCENT }}>{i + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ol>
                  <Link href={LMS_ENTRY_ROUTE}
                    className="mt-5 inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
                    style={{ background: ACCENT }}>
                    Find programmes for these gaps <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </section>
              )}

              <button type="button" onClick={() => setSubmitted(false)}
                className="self-start text-xs font-semibold text-gray-600 hover:underline dark:text-white/50">
                ← Change your answers
              </button>
            </div>
          </EngineResultsGate>
        )}
      </div>
    </div>
  );
}
