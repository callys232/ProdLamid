"use client";

import { motion } from "framer-motion";
import { Clock, Star } from "lucide-react";

export interface CandidateData {
  _id: string;
  fullName: string;
  email: string;
  currentRole?: string;
  industry?: string;
  matchScore: number;
  pipelineStage: string;
  createdAt: string;
  updatedAt: string;
  stageHistory: { stage: string; movedAt: string }[];
  jobOpeningId?: { title: string; department: string } | string | null;
}

interface CandidateCardProps {
  candidate: CandidateData;
  onMove:   (candidate: CandidateData) => void;
  onClick:  (candidate: CandidateData) => void;
}

function daysInStage(candidate: CandidateData): number {
  const history = candidate.stageHistory ?? [];
  const last    = history[history.length - 1];
  const since   = last ? new Date(last.movedAt) : new Date(candidate.createdAt);
  return Math.floor((Date.now() - since.getTime()) / 86_400_000);
}

export default function CandidateCard({ candidate, onMove, onClick }: CandidateCardProps) {
  const days  = daysInStage(candidate);
  const score = candidate.matchScore ?? 0;
  const scoreColor =
    score >= 75 ? "text-emerald-400" :
    score >= 50 ? "text-amber-400"   : "text-gray-400";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="group rounded-lg p-3 bg-white/[0.04] border border-white/10
                 hover:border-orange-500/40 cursor-pointer transition-all duration-200"
      onClick={() => onClick(candidate)}
    >
      {/* Name + score */}
      <div className="flex items-start justify-between gap-1 mb-1">
        <p className="text-xs font-semibold text-white leading-snug truncate">
          {candidate.fullName}
        </p>
        {score > 0 && (
          <span className={`shrink-0 flex items-center gap-0.5 text-[10px] font-bold ${scoreColor}`}>
            <Star className="w-2.5 h-2.5" />{score}
          </span>
        )}
      </div>

      <p className="text-[10px] text-gray-400 truncate">
        {candidate.currentRole ?? candidate.email}
      </p>

      {/* Days in stage */}
      <div className="flex items-center justify-between mt-2">
        <span className="flex items-center gap-0.5 text-[9px] text-gray-500">
          <Clock className="w-2.5 h-2.5" />{days}d in stage
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onMove(candidate); }}
          className="text-[9px] font-semibold text-orange-400 hover:text-orange-300 transition"
        >
          Move →
        </button>
      </div>
    </motion.div>
  );
}
