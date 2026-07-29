"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Network, TrendingUp, GraduationCap, Landmark, Building2, ArrowUpRight,
  History, Wrench, Pencil, Check,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useOrganizationProfile } from "@/hooks/useOrganizationProfile";
import { profileCompleteness, hasProfile } from "@/lib/profile/organizationProfile";
import { MODULE_REGISTRY } from "@/lib/intelligence/moduleRegistry";
import { handoffsFor } from "@/lib/intelligence/handoffs";

/**
 * The workspace.
 *
 * Before this existed, a member who finished a tool had nowhere to go: the
 * product was 245 URLs reached through a marketing catalogue, with run history
 * visible only inside the individual tool that produced it. This is the one
 * place that assembles what someone actually has — their profile, their runs
 * across every tool, and the next thing worth doing.
 */

const SUITES = [
  { id: "core",    label: "LAMID CORE",    kind: "Strategy & execution",   href: "/core",    colour: "#2563EB", Icon: Network },
  { id: "grow",    label: "LAMID GROW",    kind: "Customer & digital",     href: "/grow",    colour: "#047857", Icon: TrendingUp },
  { id: "talent",  label: "LAMID TALENT",  kind: "People intelligence",    href: "/talent",  colour: "#6D28D9", Icon: GraduationCap },
  { id: "finance", label: "LAMID FINANCE", kind: "Financial clarity",      href: "/finance", colour: "#B45309", Icon: Landmark },
];

/** Which suite a module belongs to, from its id prefix. */
function suiteOf(moduleId: string) {
  const c = moduleId.charAt(0).toUpperCase();
  if (c === "F") return SUITES[3];
  if (c === "A") return SUITES[2];
  if (c === "R" || c === "P" || c === "G") return SUITES[1];
  return SUITES[0];
}

interface Run {
  _id:               string;
  moduleId:          string;
  engineName:        string;
  organisationName?: string;
  href?:             string;
  runAt:             string;
  scores?:           { label: string; value: number }[];
}

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: d },
});

const INDUSTRIES = [
  "Financial Services", "Technology", "Healthcare", "FMCG & Retail", "Energy",
  "Manufacturing", "Professional Services", "Government", "NGO / Non-profit",
  "Education", "Real Estate", "Other",
];
const SIZES = ["1–50 employees", "51–200", "201–500", "500–2,000", "2,000–10,000", "10,000+"];

export default function WorkspacePage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { profile, update } = useOrganizationProfile();

  const [runs, setRuns]       = useState<Run[]>([]);
  const [totals, setTotals]   = useState({ totalRuns: 0, uniqueTools: 0 });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  /* Every run this member has made, across every tool — the view that only
     existed per-tool before. */
  useEffect(() => {
    if (authLoading || !isAuthenticated) { setLoading(false); return; }
    fetch("/api/tools/usage?limit=40", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.data) setRuns(d.data);
        if (d) setTotals({ totalRuns: d.totalRuns ?? 0, uniqueTools: d.uniqueTools ?? 0 });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, authLoading]);

  /** What to run next, derived from the most recent run's handoffs. */
  const suggested = useMemo(() => {
    for (const r of runs) {
      const h = handoffsFor(r.moduleId);
      if (h.length) return { from: r, next: h };
    }
    return null;
  }, [runs]);

  const completeness = profileCompleteness(profile);
  const inputCls =
    "w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-black " +
    "text-black dark:text-white text-sm px-3 py-2 focus:outline-none focus:border-[#2563EB] transition";

  return (
    <main className="min-h-screen bg-gray-50 px-4 pb-20 pt-24 dark:bg-black">
      <div className="mx-auto max-w-6xl">

        <motion.div {...fadeUp(0)} className="mb-8">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#2563EB]">
            Your workspace
          </p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            {profile.organisationName || "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-white/55">
            {totals.totalRuns > 0
              ? `${totals.totalRuns} run${totals.totalRuns === 1 ? "" : "s"} across ${totals.uniqueTools} tool${totals.uniqueTools === 1 ? "" : "s"}.`
              : "Run your first tool and it will show up here."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">

          {/* ── Main column ── */}
          <div className="flex flex-col gap-6">

            {/* Suggested next step */}
            {suggested && (
              <motion.section
                {...fadeUp(0.05)}
                className="rounded-2xl border border-[#2563EB]/25 bg-[#2563EB]/[0.05] p-6"
              >
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#2563EB]">
                  Suggested next
                </p>
                <p className="mb-4 text-xs text-gray-600 dark:text-white/50">
                  Following your {suggested.from.engineName} run.
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {suggested.next.map((h) => (
                    <Link
                      key={h.to}
                      href={h.href}
                      className="group rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2563EB]/50 dark:border-white/12 dark:bg-black"
                    >
                      <p className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-gray-900 group-hover:text-[#2563EB] dark:text-white">
                        {h.name}
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </p>
                      <p className="text-xs leading-relaxed text-gray-600 dark:text-white/55">{h.reason}</p>
                    </Link>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Recent runs — every tool, one list */}
            <motion.section
              {...fadeUp(0.1)}
              className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/12 dark:bg-white/[0.02]"
            >
              <p className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-white/50">
                <History className="h-3.5 w-3.5 text-[#2563EB]" />
                Recent runs
              </p>

              {loading ? (
                <p className="py-6 text-center text-sm text-gray-600 dark:text-white/55">Loading…</p>
              ) : runs.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="mb-4 text-sm text-gray-600 dark:text-white/50">
                    {isAuthenticated
                      ? "Nothing yet. Every tool you run is saved here so you can compare it later."
                      : "Sign in to keep your runs."}
                  </p>
                  <Link
                    href="/ecosystem"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1D4ED8]"
                  >
                    <Wrench className="h-3.5 w-3.5" /> Browse the tools
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col">
                  {runs.slice(0, 12).map((r) => {
                    const suite = suiteOf(r.moduleId);
                    const avg = r.scores?.length
                      ? Math.round(r.scores.reduce((s, x) => s + x.value, 0) / r.scores.length)
                      : null;
                    const href = r.href || MODULE_REGISTRY[r.moduleId]?.backHref || "/ecosystem";
                    return (
                      <li key={r._id} className="border-b border-gray-100 last:border-0 dark:border-white/8">
                        <Link href={href} className="group flex items-center gap-3 py-3 transition">
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ background: suite.colour }}
                            aria-hidden="true"
                          />
                          {avg !== null && (
                            <span className="w-9 shrink-0 rounded-md bg-gray-100 px-2 py-1 text-center font-mono text-[11px] font-bold tabular-nums text-gray-700 dark:bg-white/8 dark:text-white/70">
                              {avg}
                            </span>
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-gray-900 group-hover:text-[#2563EB] dark:text-white">
                              {r.engineName}
                            </span>
                            <span className="block truncate text-[11px] text-gray-600 dark:text-white/55">
                              {r.organisationName || "Untitled"} · {suite.label}
                            </span>
                          </span>
                          <span className="shrink-0 text-[11px] tabular-nums text-gray-600 dark:text-white/55">
                            {new Date(r.runAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </motion.section>

            {/* Suites */}
            <motion.section {...fadeUp(0.15)}>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-white/50">
                Your suites
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {SUITES.map((s) => (
                  <Link
                    key={s.id}
                    href={s.href}
                    className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2563EB]/40 dark:border-white/12 dark:bg-white/[0.02]"
                  >
                    <s.Icon className="h-5 w-5 shrink-0" strokeWidth={2} style={{ color: s.colour }} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-gray-900 dark:text-white">{s.label}</span>
                      <span className="block text-[11px] text-gray-600 dark:text-white/55">{s.kind}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-gray-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 dark:text-white/55" />
                  </Link>
                ))}
              </div>
            </motion.section>
          </div>

          {/* ── Organisation profile ── */}
          <motion.aside {...fadeUp(0.08)} className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/12 dark:bg-white/[0.02]">
              <div className="mb-4 flex items-start justify-between gap-2">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-white/50">
                  <Building2 className="h-3.5 w-3.5 text-[#2563EB]" />
                  Your organisation
                </p>
                <button
                  type="button"
                  onClick={() => setEditing((e) => !e)}
                  className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-[#2563EB] transition hover:opacity-70"
                >
                  {editing ? <><Check className="h-3 w-3" /> Done</> : <><Pencil className="h-3 w-3" /> Edit</>}
                </button>
              </div>

              <p className="mb-4 text-xs leading-relaxed text-gray-600 dark:text-white/50">
                Entered once. Every tool starts from these details instead of asking again.
              </p>

              {/* Completeness */}
              <div className="mb-5">
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/55">
                    Complete
                  </span>
                  <span className="text-[11px] font-bold tabular-nums text-[#2563EB]">{completeness}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-white/8">
                  <div
                    className="h-full rounded-full bg-[#2563EB] transition-all duration-500"
                    style={{ width: `${completeness}%` }}
                  />
                </div>
              </div>

              {editing ? (
                <div className="flex flex-col gap-3">
                  <div>
                    <label htmlFor="wp-org" className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/55">
                      Organisation
                    </label>
                    <input id="wp-org" className={inputCls} value={profile.organisationName}
                      onChange={(e) => update({ organisationName: e.target.value })}
                      placeholder="e.g. Horizon Capital" />
                  </div>
                  <div>
                    <label htmlFor="wp-ind" className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/55">
                      Industry
                    </label>
                    <select id="wp-ind" className={inputCls} value={profile.industry}
                      onChange={(e) => update({ industry: e.target.value })}>
                      <option value="">Select…</option>
                      {INDUSTRIES.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="wp-size" className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/55">
                      Size
                    </label>
                    <select id="wp-size" className={inputCls} value={profile.size}
                      onChange={(e) => update({ size: e.target.value })}>
                      <option value="">Select…</option>
                      {SIZES.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="wp-head" className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/55">
                        Headcount
                      </label>
                      <input id="wp-head" type="number" min={0} className={inputCls}
                        value={profile.headcount ?? ""}
                        onChange={(e) => update({ headcount: Number(e.target.value) || null })} />
                    </div>
                    <div>
                      <label htmlFor="wp-cur" className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/55">
                        Currency
                      </label>
                      <input id="wp-cur" className={inputCls} value={profile.currency}
                        onChange={(e) => update({ currency: e.target.value.toUpperCase().slice(0, 4) })} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="wp-reg" className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/55">
                      Region
                    </label>
                    <input id="wp-reg" className={inputCls} value={profile.region}
                      onChange={(e) => update({ region: e.target.value })}
                      placeholder="e.g. West Africa" />
                  </div>
                </div>
              ) : hasProfile(profile) ? (
                <dl className="flex flex-col gap-2.5">
                  {([
                    ["Organisation", profile.organisationName],
                    ["Industry",     profile.industry],
                    ["Size",         profile.size],
                    ["Headcount",    profile.headcount ? profile.headcount.toLocaleString() : ""],
                    ["Currency",     profile.currency],
                    ["Region",       profile.region],
                  ] as const)
                    .filter(([, v]) => Boolean(v))
                    .map(([k, v]) => (
                      <div key={k} className="flex items-baseline justify-between gap-3 border-b border-gray-100 pb-2 last:border-0 dark:border-white/8">
                        <dt className="shrink-0 text-[11px] text-gray-600 dark:text-white/55">{k}</dt>
                        <dd className="min-w-0 truncate text-right text-xs font-semibold text-gray-900 dark:text-white">{v}</dd>
                      </div>
                    ))}
                </dl>
              ) : (
                <p className="text-xs text-gray-600 dark:text-white/55">
                  Nothing saved yet. Fill this in and every tool will start from it.
                </p>
              )}
            </div>
          </motion.aside>
        </div>
      </div>
    </main>
  );
}
