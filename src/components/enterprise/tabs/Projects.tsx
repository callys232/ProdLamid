"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FolderPlus, MapPin, Clock, DollarSign } from "lucide-react";
import { mockJobs } from "@/mocks/mockJobs";

const STATUS_FILTERS = ["All", "open", "ongoing", "completed"];

const STATUS_STYLE: Record<string, string> = {
  open:      "border-blue-500/30 bg-blue-500/10 text-blue-400",
  ongoing:   "border-green-500/30 bg-green-500/10 text-green-400",
  completed: "border-gray-500/30 bg-gray-500/10 text-gray-400",
  cancelled: "border-red-500/30 bg-red-500/10 text-red-400",
};

interface Props { tier: string }

export default function Projects({ tier }: Props) {
  const [filter, setFilter] = useState("All");
  const activeLimit = tier === "enterprise_plus" ? Infinity : 12;

  const projects = filter === "All"
    ? mockJobs
    : mockJobs.filter(j => j.status === filter);

  const activeCount = mockJobs.filter(j => j.status === "open" || j.status === "ongoing").length;

  return (
    <div className="space-y-5 p-6">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">Project Portfolio</h2>
          <p className="text-xs text-gray-500">
            {activeCount} active{activeLimit !== Infinity ? ` / ${activeLimit} slots` : ""}
          </p>
        </div>
        <motion.a
          href="/postjobs"
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 rounded-lg bg-[#c12129] px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          <FolderPlus className="h-4 w-4" /> Post a Project
        </motion.a>
      </div>

      {/* Active slot bar */}
      {activeLimit !== Infinity && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-2 flex justify-between text-xs text-gray-500">
            <span>Active project slots</span>
            <span>{Math.min(activeCount, activeLimit)} / {activeLimit}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-[#c12129]"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((activeCount / activeLimit) * 100, 100)}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {STATUS_FILTERS.map(f => (
          <motion.button
            key={f}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 rounded-full border px-3 py-1 text-xs font-medium capitalize transition ${
              filter === f
                ? "border-[#c12129]/50 bg-[#c12129]/15 text-[#c12129]"
                : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
            }`}
          >
            {f}
          </motion.button>
        ))}
      </div>

      {/* Project grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((p, i) => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ y: -3, scale: 1.01 }}
            className="group cursor-pointer rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-[#c12129]/30 hover:bg-[#c12129]/5"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-white leading-snug">{p.title}</h3>
              <span className={`flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${STATUS_STYLE[p.status ?? "open"]}`}>
                {p.status ?? "open"}
              </span>
            </div>
            <p className="mb-3 line-clamp-2 text-xs text-gray-500">{p.description}</p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
              {p.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />{p.location}
                </span>
              )}
              {p.budget && (
                <span className="flex items-center gap-1 text-green-400">
                  <DollarSign className="h-3 w-3" />${p.budget.toLocaleString()}
                </span>
              )}
              {p.deadline && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />{p.deadline}
                </span>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {(p.skills ?? []).slice(0, 3).map(s => (
                <span key={s} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-gray-400">
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
