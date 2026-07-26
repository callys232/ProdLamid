"use client";

import { useState, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Users, X, Plus, Star, AlertCircle, ArrowUpRight, Loader2, BookOpen } from "lucide-react";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";

type PageState = "form" | "loading" | "result";

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

/* ── Tag input ── */
function TagInput({ label, tags, onAdd, onRemove, placeholder }: {
  label: string;
  tags: string[];
  onAdd: (v: string) => void;
  onRemove: (v: string) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const v = draft.trim();
    if (v && !tags.includes(v)) onAdd(v);
    setDraft("");
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); commit(); }
  };

  return (
    <div>
      <label className="text-xs font-semibold text-gray-600 dark:text-white/60 mb-1.5 block">{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-2 empty:hidden">
        {tags.map(t => (
          <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#2563EB]/10 border border-[#2563EB]/25 text-[#2563EB]">
            {t}
            <button type="button" onClick={() => onRemove(t)} className="cursor-pointer opacity-60 hover:opacity-100">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={onKey}
          placeholder={placeholder}
          className="flex-1 px-3 py-2.5 rounded-xl text-sm bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-[#2563EB]/50 transition-colors"
        />
        <button
          type="button"
          onClick={commit}
          className="px-3 py-2.5 rounded-xl border border-[#2563EB]/25 text-[#2563EB] hover:bg-[#2563EB]/8 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <p className="text-[10px] text-gray-400 dark:text-white/25 mt-1">Press Enter or comma to add</p>
    </div>
  );
}

/* ── Mentor card ── */
function MentorCard({ match, delay }: { match: any; delay: number }) {
  const { mentor, score, matchReasons } = match;
  const initials = (mentor.name || "?").split(" ").map((p: string) => p[0]).join("").slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="lamidone-card border rounded-2xl p-5 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#2563EB]/12 border border-[#2563EB]/25 flex items-center justify-center shrink-0 overflow-hidden">
          {mentor.avatar
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
            : <span className="text-sm font-bold lamidone-gradient-text">{initials}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight line-clamp-1">{mentor.name}</h3>
          <p className="text-[11px] text-gray-500 dark:text-white/40 mt-0.5 line-clamp-1">{mentor.title}</p>
        </div>
        {/* Score badge */}
        <div className="shrink-0 flex flex-col items-center">
          <span className="text-lg font-extrabold lamidone-gradient-text leading-none">{score}%</span>
          <span className="text-[9px] text-gray-400 dark:text-white/30">match</span>
        </div>
      </div>

      {/* Rating + experience */}
      {(mentor.rating > 0 || mentor.experience > 0) && (
        <div className="flex items-center gap-3">
          {mentor.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs font-semibold text-gray-700 dark:text-white/70">{Number(mentor.rating).toFixed(1)}</span>
            </div>
          )}
          {mentor.experience > 0 && (
            <span className="text-xs text-gray-500 dark:text-white/40">{mentor.experience} yrs experience</span>
          )}
        </div>
      )}

      {/* Skills */}
      {mentor.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {mentor.skills.slice(0, 4).map((s: string) => (
            <span key={s} className="text-[9px] font-bold px-2 py-0.5 rounded-full border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/40">
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Match reasons */}
      {matchReasons?.length > 0 && (
        <div className="flex flex-col gap-1">
          {matchReasons.map((r: string, i: number) => (
            <div key={i} className="flex items-start gap-1.5">
              <span className="lamidone-gradient-text text-xs shrink-0 mt-0.5">✓</span>
              <p className="text-[11px] text-gray-600 dark:text-white/55 leading-snug">{r}</p>
            </div>
          ))}
        </div>
      )}

      <Link
        href={`/consultant/${mentor.id}`}
        className="mt-auto w-full text-center py-2.5 rounded-xl text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors shadow-[0_0_12px_rgba(37,99,235,0.3)]"
      >
        View Profile
      </Link>
    </motion.div>
  );
}

/* ── Page content ── */
function MentorshipContent() {
  const [state, setState]   = useState<PageState>("form");
  const [error, setError]   = useState("");
  const [matches, setMatches] = useState<any[]>([]);

  const [goals, setGoals]         = useState("");
  const [currentSkills, setCurrent] = useState<string[]>([]);
  const [growSkills, setGrow]     = useState<string[]>([]);
  const [industry, setIndustry]   = useState("");
  const [format, setFormat]       = useState("Either");

  const canSubmit = goals.trim().length > 0;

  const submit = async () => {
    if (!canSubmit) return;
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/talent/mentorship", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goals, currentSkills, skillsToGrow: growSkills, industryFocus: industry, preferredFormat: format }),
      });
      const data = await res.json();
      if (data.success) { setMatches(data.matches ?? []); setState("result"); }
      else { setError(data.message || "Matching failed."); setState("form"); }
    } catch { setError("Network error. Please try again."); setState("form"); }
  };

  if (state === "loading") {
    return (
      <main className="lamidone-section min-h-screen flex items-center justify-center">
        <motion.div {...fadeUp()} className="flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/25 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-[#2563EB] animate-spin" />
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Finding your ideal mentors…</p>
          <p className="text-xs text-gray-500 dark:text-white/40">Matching against the LAMID expert network</p>
        </motion.div>
      </main>
    );
  }

  if (state === "result") {
    return (
      <main className="lamidone-section min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp(0)} className="mb-8">
            <p className="lamidone-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">LAMID TALENT · Mentorship Matching</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Mentor Matches</h1>
            <p className="text-sm text-gray-500 dark:text-white/45">
              {matches.length > 0
                ? `Found ${matches.length} experts aligned with your development goals.`
                : "No matches found yet — try broadening your goals or skill list."}
            </p>
          </motion.div>

          {matches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {matches.map((m, i) => <MentorCard key={m.mentor.id} match={m} delay={i * 0.05} />)}
            </div>
          ) : (
            <motion.div {...fadeUp(0.05)} className="lamidone-card border rounded-2xl p-10 text-center mb-8">
              <Users className="w-10 h-10 text-[#2563EB]/40 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-white/40">No mentors matched your criteria yet.</p>
              <p className="text-xs text-gray-400 dark:text-white/25 mt-1">Try broadening your skill list or adjusting your industry focus.</p>
            </motion.div>
          )}

          <motion.div {...fadeUp(0.1)} className="flex flex-wrap gap-3">
            <button type="button" onClick={() => { setState("form"); setMatches([]); }}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors shadow-[0_0_14px_rgba(37,99,235,0.35)]">
              Refine Search
            </button>
            <Link href="/talent/capability-diagnostics" className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#2563EB]/25 text-[#2563EB] hover:bg-[#2563EB]/8 transition-colors inline-flex items-center gap-1.5">
              Capability Diagnostic <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="lamidone-section min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div {...fadeUp(0)} className="mb-10">
          <p className="lamidone-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">LAMID TALENT · Mentorship</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Mentorship Matching Engine</h1>
          <p className="text-sm text-gray-500 dark:text-white/45 max-w-lg">
            Tell us your growth goals and we'll match you with experts from the LAMID network who can accelerate your development.
          </p>
        </motion.div>

        {error && (
          <motion.div {...fadeUp()} className="mb-6 flex items-start gap-3 rounded-2xl border border-[#2563EB]/20 bg-[#2563EB]/5 px-5 py-4">
            <AlertCircle className="w-4 h-4 text-[#2563EB] mt-0.5 shrink-0" />
            <p className="text-sm text-gray-700 dark:text-white/70">{error}</p>
          </motion.div>
        )}

        <motion.div {...fadeUp(0.05)} className="lamidone-card border rounded-2xl p-6 flex flex-col gap-5">
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-white/60 mb-1.5 block">Development Goals *</label>
            <textarea
              value={goals}
              onChange={e => setGoals(e.target.value)}
              rows={3}
              placeholder="What do you want to achieve? (e.g. move into a leadership role, develop financial modelling skills, launch a new venture…)"
              className="w-full px-3 py-2.5 rounded-xl text-sm bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-[#2563EB]/50 transition-colors resize-none"
            />
          </div>

          <TagInput
            label="Current Skills"
            tags={currentSkills}
            onAdd={v => setCurrent(p => [...p, v])}
            onRemove={v => setCurrent(p => p.filter(t => t !== v))}
            placeholder="e.g. Project Management"
          />

          <TagInput
            label="Skills You Want to Grow"
            tags={growSkills}
            onAdd={v => setGrow(p => [...p, v])}
            onRemove={v => setGrow(p => p.filter(t => t !== v))}
            placeholder="e.g. Executive Communication"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-white/60 mb-1.5 block">Industry Focus</label>
              <input
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                placeholder="e.g. Technology, Finance"
                className="w-full px-3 py-2.5 rounded-xl text-sm bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-[#2563EB]/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-white/60 mb-1.5 block">Preferred Format</label>
              <select
                value={format}
                onChange={e => setFormat(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-[#2563EB]/50 transition-colors"
              >
                {["Either", "Online", "In-person"].map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className="self-start px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors shadow-[0_0_14px_rgba(37,99,235,0.35)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Users className="w-4 h-4" /> Find My Mentors
          </button>
        </motion.div>

        <motion.div {...fadeUp(0.12)} className="mt-6 flex flex-wrap gap-3">
          <Link href="/talent/capability-diagnostics" className="text-xs text-gray-500 dark:text-white/40 hover:text-[#2563EB] transition-colors inline-flex items-center gap-1">
            Capability Diagnostic <ArrowUpRight className="w-3 h-3" />
          </Link>
          <span className="text-gray-300 dark:text-white/15">·</span>
          <Link href="/talent/lms" className="text-xs text-gray-500 dark:text-white/40 hover:text-[#2563EB] transition-colors inline-flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> Learning Platform
          </Link>
        </motion.div>
      </div>
    </main>
  );
}

export default function MentorshipPage() {
  return (
    <DashboardTierGate pillar="LAMID TALENT" backHref="/talent" backLabel="Back to LAMID TALENT">
      <MentorshipContent />
    </DashboardTierGate>
  );
}
