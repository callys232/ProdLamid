"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X, ArrowUpRight } from "lucide-react";
import { MODULE_REGISTRY } from "@/lib/intelligence/moduleRegistry";
import { MODULE_ROUTES } from "@/lib/intelligence/moduleRoutes";

const ACCENT = "#2563EB";

/** Derived from the registry at module load — cannot drift out of sync. */
const ALL = Object.values(MODULE_REGISTRY)
  .map((m) => ({
    id:      m.id,
    name:    m.engineName,
    purpose: m.purpose,
    series:  m.seriesName,
    href:    MODULE_ROUTES[m.id] ?? null,
    typed:   Boolean(m.inputs),
  }))
  .filter((m) => m.href)
  .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

const SERIES = [...new Set(ALL.map((m) => m.series))].sort();

export default function ModuleBrowser() {
  const [q, setQ] = useState("");
  const [series, setSeries] = useState<string | null>(null);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return ALL.filter((m) => {
      if (series && m.series !== series) return false;
      if (!term) return true;
      return (
        m.id.toLowerCase().includes(term) ||
        m.name.toLowerCase().includes(term) ||
        m.purpose.toLowerCase().includes(term)
      );
    });
  }, [q, series]);

  return (
    <section className="bg-white dark:bg-black text-black dark:text-white px-4 py-16">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: ACCENT }}>
            All Intelligence Modules
          </p>
          <h2 className="text-2xl font-bold sm:text-3xl">
            {ALL.length} engines. Search or filter to find yours.
          </h2>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-white/40" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or what it does…"
            aria-label="Search intelligence modules"
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-10 text-sm text-black transition placeholder-gray-500 focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]/30 dark:border-white/20 dark:bg-black dark:text-white dark:placeholder-white/40"
          />
          {q && (
            <button type="button" onClick={() => setQ("")} aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-black dark:text-white/40 dark:hover:text-white">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Series filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button type="button" onClick={() => setSeries(null)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              series === null
                ? "text-white"
                : "border border-gray-300 text-gray-700 hover:border-[#2563EB] dark:border-white/20 dark:text-white/60"
            }`}
            style={series === null ? { background: ACCENT } : undefined}>
            All ({ALL.length})
          </button>
          {SERIES.map((s) => {
            const count = ALL.filter((m) => m.series === s).length;
            const active = series === s;
            return (
              <button key={s} type="button" onClick={() => setSeries(active ? null : s)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "text-white"
                    : "border border-gray-300 text-gray-700 hover:border-[#2563EB] dark:border-white/20 dark:text-white/60"
                }`}
                style={active ? { background: ACCENT } : undefined}>
                {s.split("—")[0].trim()} ({count})
              </button>
            );
          })}
        </div>

        <p className="mb-4 text-xs text-gray-600 dark:text-white/50">
          {results.length} {results.length === 1 ? "module" : "modules"}
          {q && ` matching “${q}”`}
        </p>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 py-16 text-center dark:border-white/15">
            <p className="text-sm text-gray-600 dark:text-white/50">
              No modules match that search. Try a broader term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((m) => (
              <Link key={m.id} href={m.href!}
                className="group flex flex-col rounded-xl border border-gray-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#2563EB]/50 hover:shadow-[0_8px_24px_rgba(37,99,235,0.10)] dark:border-white/15 dark:bg-black">
                <div className="mb-2 flex items-center gap-2">
                  {/* The series, not the module code — codes are an internal key. */}
                  <span className="rounded-md px-1.5 py-0.5 text-[10px] font-bold"
                    style={{ background: `${ACCENT}14`, color: ACCENT }}>
                    {m.series.split(" — ")[0]}
                  </span>
                  {m.typed && (
                    <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                      Data input
                    </span>
                  )}
                  <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 text-gray-400 opacity-0 transition group-hover:opacity-100 dark:text-white/30" />
                </div>
                <p className="mb-1 text-sm font-semibold leading-snug text-black group-hover:text-[#2563EB] dark:text-white">
                  {m.name}
                </p>
                <p className="line-clamp-2 text-[11px] leading-relaxed text-gray-600 dark:text-white/50">
                  {m.purpose}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
