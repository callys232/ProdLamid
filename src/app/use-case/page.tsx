"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calculator, ArrowRight, Layers } from "lucide-react";
import { USE_CASES } from "@/lib/useCases";

/**
 * Use case index.
 *
 * Each card leads to a worked example whose every figure came out of the
 * product's own compute layers. The card leads with the verdict rather than the
 * client name — the conclusion is the interesting part, and several of them
 * contradict what the organisation walked in expecting.
 */

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.45, delay: d },
});

const ACCENT = "#2563EB";

export default function UseCaseIndex() {
  return (
    <main className="min-h-screen bg-white px-4 pb-16 pt-24 dark:bg-black">
      <div className="mx-auto max-w-5xl">

        <motion.div {...fadeUp(0)} className="mb-12 max-w-2xl">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: ACCENT }}>
            Worked examples
          </p>
          <h1 className="mb-5 text-3xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl">
            Four organisations. One question each.
          </h1>
          <p className="text-base leading-relaxed text-gray-600 dark:text-white/60">
            Every figure in these came out of the same engines you can run yourself,
            from the inputs shown. Three of the four ended somewhere the organisation
            did not expect.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {USE_CASES.map((u, i) => (
            <motion.div key={u.slug} {...fadeUp(i * 0.06)}>
              <Link
                href={`/use-case/${u.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_1px_3px_rgba(16,24,40,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-[#2563EB]/40 hover:shadow-[0_12px_36px_rgba(37,99,235,0.12)] dark:border-white/12 dark:bg-white/[0.02] dark:shadow-none"
              >
                <div className="mb-4 flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: u.accent }}
                    aria-hidden="true"
                  />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">
                    {u.sector} · {u.size}
                  </span>
                </div>

                {/* The verdict leads — it is the part worth clicking for. */}
                <h2 className="mb-2 text-lg font-bold leading-snug text-gray-900 dark:text-white">
                  {u.verdict}
                </h2>
                <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-white/55">
                  {u.teaser}
                </p>

                <div className="mb-5 flex flex-wrap gap-1.5">
                  {[...new Set(u.stages.map((s) => s.archetype))].map((a) => (
                    <span
                      key={a}
                      className="rounded-full border border-gray-200 px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:border-white/12 dark:text-white/40"
                    >
                      {a}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-white/8">
                  <span className="text-[11px] text-gray-500 dark:text-white/40">
                    <span className="font-semibold text-gray-700 dark:text-white/60">{u.name}</span>
                    {" · "}{u.stages.length} engines
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-900 dark:text-white">
                    Read
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
                      strokeWidth={2} style={{ color: u.accent }}
                    />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          {...fadeUp(0.1)}
          className="mt-8 flex flex-col items-start gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: `${ACCENT}33`, background: `${ACCENT}0A` }}
        >
          <div className="flex items-start gap-3">
            <Calculator className="mt-0.5 h-4 w-4 shrink-0" style={{ color: ACCENT }} />
            <p className="max-w-xl text-xs leading-relaxed text-gray-700 dark:text-white/65">
              None of these numbers were written by hand. Each was produced by running the
              stated inputs through the engines, and the flagged findings are those
              functions&apos; own output, quoted exactly.
            </p>
          </div>
          <Link
            href="/ecosystem"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: ACCENT }}
          >
            <Layers className="h-4 w-4" /> See every engine
          </Link>
        </motion.div>

      </div>
    </main>
  );
}
