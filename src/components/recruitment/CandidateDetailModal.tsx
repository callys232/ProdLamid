"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Loader2, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import type { CandidateData } from "./CandidateCard";

interface CandidateDetailModalProps {
  candidate: CandidateData | null;
  onClose:   () => void;
  onStageChange?: (candidate: CandidateData, newStage: string) => void;
}

const STAGES = ["applied", "screening", "interview", "offer", "hired", "rejected", "withdrawn"];

const STAGE_COLORS: Record<string, string> = {
  applied:   "bg-blue-500/20 text-blue-300 border-blue-500/40",
  screening: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  interview: "bg-violet-500/20 text-violet-300 border-violet-500/40",
  offer:     "bg-orange-500/20 text-orange-300 border-orange-500/40",
  hired:     "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  rejected:  "bg-red-500/20 text-red-300 border-red-500/40",
  withdrawn: "bg-gray-500/20 text-gray-400 border-gray-500/40",
};

export default function CandidateDetailModal({
  candidate, onClose, onStageChange,
}: CandidateDetailModalProps) {
  const [selectedStage, setSelectedStage] = useState("");
  const [stageNote,     setStageNote]     = useState("");
  const [moving,        setMoving]        = useState(false);

  if (!candidate) return null;

  const handleMoveStage = async () => {
    if (!selectedStage) { toast.error("Select a stage"); return; }
    setMoving(true);
    try {
      const res  = await fetch(`/api/recruitment/candidates/${candidate._id}/stage`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ stage: selectedStage, notes: stageNote }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message ?? "Move failed");

      toast.success(`Moved to ${selectedStage}`);
      onStageChange?.({ ...candidate, pipelineStage: selectedStage }, selectedStage);
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Move failed");
    } finally {
      setMoving(false);
    }
  };

  const jobTitle = typeof candidate.jobOpeningId === "object" && candidate.jobOpeningId
    ? (candidate.jobOpeningId as { title: string }).title
    : "—";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
        style={{ backgroundColor: "rgba(0,0,0,0.82)", backdropFilter: "blur(6px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative bg-[#0d0d0d] border border-white/10 rounded-t-2xl sm:rounded-2xl
                     w-full sm:w-[95%] md:w-[640px] max-h-[92vh] overflow-y-auto overscroll-contain"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-[#0d0d0d] border-b border-white/10 px-6 py-4 flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-white">{candidate.fullName}</h2>
              <p className="text-xs text-gray-400">{candidate.currentRole ?? candidate.email}</p>
              {jobTitle !== "—" && (
                <p className="text-[10px] text-orange-400 mt-0.5">Applied for: {jobTitle}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STAGE_COLORS[candidate.pipelineStage] ?? ""}`}>
                {candidate.pipelineStage}
              </span>
              <button type="button" aria-label="Close" onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-6">
            {/* Profile info */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
              {([
                ["Email",     candidate.email],
                ["Industry",  candidate.industry],
                ["Country",   (candidate as unknown as Record<string, string>).country],
                ["Exp",       (candidate as unknown as Record<string, string>).yearsExperience ? `${(candidate as unknown as Record<string, string>).yearsExperience} yrs` : null],
              ] as [string, string | null | undefined][]).filter(([, v]) => v).map(([label, value]) => (
                <div key={label}>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">{label}</p>
                  <p className="text-white truncate">{value}</p>
                </div>
              ))}
            </div>

            {/* LinkedIn + CV */}
            <div className="flex flex-wrap gap-3">
              {(candidate as unknown as Record<string, string>).linkedIn && (
                <a href={(candidate as unknown as Record<string, string>).linkedIn} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition">
                  <ExternalLink className="w-3.5 h-3.5" />LinkedIn Profile
                </a>
              )}
              {(candidate as unknown as Record<string, string>).cvUrl && (
                <a href={(candidate as unknown as Record<string, string>).cvUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 transition">
                  <ExternalLink className="w-3.5 h-3.5" />View CV
                </a>
              )}
            </div>

            {/* Motivation */}
            {(candidate as unknown as Record<string, string>).motivation && (
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1.5">Cover Note</p>
                <p className="text-sm text-gray-300 leading-relaxed bg-white/[0.03] rounded-lg p-3 border border-white/10">
                  {(candidate as unknown as Record<string, string>).motivation}
                </p>
              </div>
            )}

            {/* Stage history */}
            {candidate.stageHistory?.length > 0 && (
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-2">Stage History</p>
                <div className="flex flex-col gap-2">
                  {candidate.stageHistory.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                      <ChevronRight className="w-3 h-3 shrink-0 text-orange-500/60" />
                      <span className="capitalize font-medium text-white">{h.stage}</span>
                      <span className="text-gray-600">·</span>
                      <span>{new Date(h.movedAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Move stage */}
            <div className="border border-white/10 rounded-xl p-4 flex flex-col gap-3">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Move to Stage</p>
              <select
                value={selectedStage}
                aria-label="Move to stage"
                title="Move to stage"
                onChange={(e) => setSelectedStage(e.target.value)}
                className="bg-[#111111] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200
                           focus:outline-none focus:border-orange-500/60 transition"
              >
                <option value="" className="bg-[#111111] text-gray-200">Select stage…</option>
                {STAGES.filter((s) => s !== candidate.pipelineStage).map((s) => (
                  <option key={s} value={s} className="bg-[#111111] text-gray-200 capitalize">{s}</option>
                ))}
              </select>
              <textarea
                rows={2}
                value={stageNote}
                onChange={(e) => setStageNote(e.target.value)}
                placeholder="Optional note about this move…"
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white
                           placeholder-gray-600 resize-none focus:outline-none focus:border-orange-500/60 transition"
              />
              <button
                type="button"
                onClick={handleMoveStage}
                disabled={!selectedStage || moving}
                className="py-2.5 rounded-lg text-xs font-bold text-white
                           bg-gradient-to-r from-orange-500 to-orange-700
                           hover:from-orange-600 hover:to-orange-800
                           disabled:opacity-40 disabled:cursor-not-allowed
                           transition focus:outline-none"
              >
                {moving
                  ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin" />Moving…</span>
                  : `Confirm Move →`}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
