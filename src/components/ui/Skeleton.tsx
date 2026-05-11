"use client";

import { motion } from "framer-motion";

/* ── Base shimmer ─────────────────────────────────────────────── */
function Shimmer({ className }: { className?: string }) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
      className={`rounded-lg bg-white/8 ${className ?? ""}`}
    />
  );
}

/* ── Card skeleton ────────────────────────────────────────────── */
export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Shimmer className="h-10 w-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-3 w-3/4" />
          <Shimmer className="h-2.5 w-1/2" />
        </div>
      </div>
      <Shimmer className="h-2.5 w-full" />
      <Shimmer className="h-2.5 w-5/6" />
      <div className="flex gap-2 pt-1">
        <Shimmer className="h-6 w-16 rounded-full" />
        <Shimmer className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

/* ── Project card skeleton ────────────────────────────────────── */
export function ProjectCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3">
      <div className="flex justify-between">
        <Shimmer className="h-3 w-2/3" />
        <Shimmer className="h-5 w-16 rounded-full" />
      </div>
      <Shimmer className="h-2.5 w-full" />
      <Shimmer className="h-2.5 w-4/5" />
      <div className="flex gap-2">
        <Shimmer className="h-6 w-14 rounded-full" />
        <Shimmer className="h-6 w-18 rounded-full" />
        <Shimmer className="h-6 w-12 rounded-full" />
      </div>
      <div className="flex justify-between pt-1">
        <Shimmer className="h-3 w-24" />
        <Shimmer className="h-3 w-16" />
      </div>
    </div>
  );
}

/* ── Table row skeleton ───────────────────────────────────────── */
export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-3 px-4">
          <Shimmer className={`h-3 ${i === 0 ? "w-32" : "w-16 mx-auto"}`} />
        </td>
      ))}
    </tr>
  );
}

/* ── List of card skeletons ───────────────────────────────────── */
export function CardListSkeleton({ count = 6, type = "card" }: { count?: number; type?: "card" | "project" }) {
  const Comp = type === "project" ? ProjectCardSkeleton : CardSkeleton;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => <Comp key={i} />)}
    </div>
  );
}

/* ── Dashboard stat skeleton ──────────────────────────────────── */
export function StatSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
      <Shimmer className="h-7 w-7 rounded-lg" />
      <Shimmer className="h-6 w-20" />
      <Shimmer className="h-2.5 w-28" />
    </div>
  );
}

export function StatGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, i) => <StatSkeleton key={i} />)}
    </div>
  );
}
