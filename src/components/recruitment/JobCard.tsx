"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Users, Calendar, Briefcase } from "lucide-react";

export interface JobOpeningData {
  _id: string;
  title: string;
  department: string;
  track: string;
  type: string;
  delivery: string;
  location?: string;
  skills: string[];
  applicantCount: number;
  deadline?: string;
  description?: string;
  salaryRange?: { min?: number; max?: number; currency?: string };
  source?: "job" | "project";
}

interface JobCardProps {
  job: JobOpeningData;
  onApply: (job: JobOpeningData) => void;
}

const DELIVERY_COLORS: Record<string, string> = {
  Remote: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Onsite: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Hybrid: "bg-violet-500/15 text-violetent-400 border-violet-500/30",
};

const TYPE_LABELS: Record<string, string> = {
  "full-time":   "Full-time",
  "part-time":   "Part-time",
  contract:      "Contract",
  freelance:     "Freelance",
  internship:    "Internship",
};

export default function JobCard({ job, onApply }: JobCardProps) {
  const deadlineDate = job.deadline ? new Date(job.deadline) : null;
  const daysLeft     = deadlineDate
    ? Math.ceil((deadlineDate.getTime() - Date.now()) / 86_400_000)
    : null;

  const salary = job.salaryRange?.min
    ? `${job.salaryRange.currency ?? "USD"} ${job.salaryRange.min.toLocaleString()}${job.salaryRange.max ? `–${job.salaryRange.max.toLocaleString()}` : "+"}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      className="flex flex-col justify-between gap-4 rounded-xl p-5
                 bg-white/[0.03] border border-white/10
                 hover:border-orange-500/40 hover:bg-white/[0.06]
                 transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-white leading-snug">{job.title}</h3>
            {job.source === "project" && (
              <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/30 whitespace-nowrap">
                Project
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{job.department}</p>
        </div>
        <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${DELIVERY_COLORS[job.delivery] ?? "bg-white/10 text-gray-300 border-white/20"}`}>
          {job.delivery}
        </span>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-gray-400">
        <span className="flex items-center gap-1">
          <Briefcase className="w-3 h-3" />{TYPE_LABELS[job.type] ?? job.type}
        </span>
        {job.location && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />{job.location}
          </span>
        )}
        {daysLeft !== null && (
          <span className={`flex items-center gap-1 ${daysLeft <= 7 ? "text-orange-400" : ""}`}>
            <Calendar className="w-3 h-3" />
            {daysLeft > 0 ? `${daysLeft}d left` : "Closing soon"}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />{job.applicantCount} applied
        </span>
        {salary && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />{salary}
          </span>
        )}
      </div>

      {/* Track badge */}
      <p className="text-[10px] text-orange-400/80 font-semibold uppercase tracking-wider">
        {job.track}
      </p>

      {/* Skills */}
      {job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.skills.slice(0, 5).map((s) => (
            <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
              {s}
            </span>
          ))}
          {job.skills.length > 5 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
              +{job.skills.length - 5}
            </span>
          )}
        </div>
      )}

      {/* CTA */}
      <button
        type="button"
        onClick={() => onApply(job)}
        className="w-full mt-1 py-2 rounded-lg text-xs font-bold
                   bg-gradient-to-r from-orange-500 to-orange-700
                   hover:from-orange-600 hover:to-orange-800
                   text-white transition focus:outline-none focus:ring-2 focus:ring-orange-400"
      >
        Apply Now
      </button>
    </motion.div>
  );
}
