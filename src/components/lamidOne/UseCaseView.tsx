"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Landmark, TrendingUp, GraduationCap, Network, ClipboardCheck,
  Calculator, TriangleAlert, ArrowRight, ArrowLeft,
} from "lucide-react";
import type { UseCase, UseCaseStage } from "@/lib/useCases";

const ACCENT = "#2563EB";

const ICONS = {
  finance:    Landmark,
  grow:       TrendingUp,
  talent:     GraduationCap,
  core:       Network,
  budget:     Calculator,
  assessment: ClipboardCheck,
} as const;

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.45, delay: d },
});

function Stage({ s, delay }: { s: UseCaseStage; delay: number }) {
  const Icon = ICONS[s.icon];
  return (
    <motion.section
      {...fadeUp(delay)}
      className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/12 dark:bg-white/[0.02] sm:p-7"
    >
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <Icon className="h-5 w-5 shrink-0" strokeWidth={2} style={{ color: s.colour }} />
        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-600 dark:text-white/55">
          {s.pillar}
        </span>
        <span
          className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
          style={{ background: `${s.colour}14`, color: s.colour }}
        >
          {s.archetype}
        </span>
      </div>

      <h2 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">{s.question}</h2>
      <p className="mb-1 text-xs font-semibold" style={{ color: s.colour }}>{s.engine}</p>
      <p className="mb-5 text-xs leading-relaxed text-gray-600 dark:text-white/55">
        <span className="font-semibold">Input:</span> {s.input}
      </p>

      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {s.stats.map((t) => (
          <div key={t.label}>
            <p
              className="text-lg font-bold leading-tight tabular-nums"
              style={{ color: t.bad ? "#DC2626" : undefined }}
            >
              <span className={t.bad ? "" : "text-gray-900 dark:text-white"}>{t.value}</span>
            </p>
            <p className="mt-1 text-[11px] font-semibold text-gray-600 dark:text-white/50">{t.label}</p>
            {t.sub && <p className="text-[10px] text-gray-600 dark:text-white/55">{t.sub}</p>}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-amber-400/30 bg-amber-50 p-4 dark:bg-amber-950/20">
        <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
          <TriangleAlert className="h-3 w-3" /> What the engine flagged
        </p>
        <ul className="flex flex-col gap-1.5">
          {s.findings.map((f) => (
            <li key={f} className="text-xs leading-relaxed text-amber-800 dark:text-amber-300/90">• {f}</li>
          ))}
        </ul>
      </div>

      <Link
        href={s.href}
        className="group mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-900 dark:text-white"
      >
        Run this tool on your own numbers
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
          strokeWidth={2} style={{ color: s.colour }}
        />
      </Link>
    </motion.section>
  );
}

export default function UseCaseView({ useCase }: { useCase: UseCase }) {
  const u = useCase;

  return (
    <main className="min-h-screen bg-white px-4 pb-16 pt-24 dark:bg-black">
      <div className="mx-auto max-w-4xl">

        <Link
          href="/use-case"
          className="mb-8 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 transition-colors hover:text-gray-900 dark:text-white/55 dark:hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All use cases
        </Link>

        <motion.div {...fadeUp(0)} className="mb-12">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: u.accent }}>
            {u.sector} · {u.size}
          </p>
          <h1 className="mb-4 text-3xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl">
            {u.ask}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-gray-600 dark:text-white/60">
            {u.name} put the question to the ecosystem. This is what came back —
            {" "}{u.stages.length} tools, {u.stages.length} kinds of input, one answer.
          </p>

          {/* The claim the page rests on. */}
          <div
            className="mt-7 flex items-start gap-3 rounded-xl border p-4"
            style={{ borderColor: `${ACCENT}33`, background: `${ACCENT}0A` }}
          >
            <Calculator className="mt-0.5 h-4 w-4 shrink-0" style={{ color: ACCENT }} />
            <p className="text-xs leading-relaxed text-gray-700 dark:text-white/65">
              Every figure below was produced by the same compute layers the product runs,
              from the inputs described at each step. The findings are the tools&apos; own
              output, quoted exactly. Nothing here was written to be persuasive.
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col gap-5">
          {u.stages.map((s, i) => <Stage key={s.engine + s.question} s={s} delay={i * 0.04} />)}
        </div>

        <motion.section
          {...fadeUp(0)}
          className="mt-8 rounded-2xl border-2 p-7"
          style={{ borderColor: `${u.accent}40`, background: `${u.accent}08` }}
        >
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: u.accent }}>
            What the ecosystem concluded
          </p>
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            {u.verdict}
          </h2>
          <div className="flex flex-col gap-3 text-sm leading-relaxed text-gray-700 dark:text-white/65">
            {u.closing.map((c) => <p key={c.slice(0, 40)}>{c}</p>)}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/premium/business-diagnostic"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: u.accent }}
            >
              Run the diagnostic on your business
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
            <Link
              href="/use-case"
              className="inline-flex items-center justify-center rounded-xl border border-[#2563EB]/30 bg-[#2563EB]/[0.06] px-7 py-3.5 text-sm font-semibold text-[#2563EB] transition-colors hover:bg-[#2563EB]/12"
            >
              See other use cases
            </Link>
          </div>
        </motion.section>

      </div>
    </main>
  );
}
