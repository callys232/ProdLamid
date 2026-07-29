"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import CandidateCard, { type CandidateData } from "./CandidateCard";
import CandidateDetailModal from "./CandidateDetailModal";
import Link from "next/link";

const ENTERPRISE_TYPES = ["Enterprise", "Concierge", "Admin"];

const COLUMNS: { key: string; label: string; color: string }[] = [
  { key: "applied",   label: "Applied",   color: "border-blue-500/40"   },
  { key: "screening", label: "Screening", color: "border-yellow-500/40" },
  { key: "interview", label: "Interview", color: "border-violet-500/40" },
  { key: "offer",     label: "Offer",     color: "border-orange-500/40" },
  { key: "hired",     label: "Hired",     color: "border-emerald-500/40"},
];

interface PipelineData {
  pipeline: Record<string, CandidateData[]>;
  counts:   Record<string, number>;
  total:    number;
}

export default function PipelineTab() {
  const { user }       = useAuth();
  const isEnterprise   = ENTERPRISE_TYPES.includes(user?.accountType ?? "");

  const [pipeline,  setPipeline]  = useState<PipelineData | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState<CandidateData | null>(null);

  const fetchPipeline = async () => {
    try {
      const res  = await fetch("/api/recruitment/pipeline");
      const data = await res.json();
      if (data.success) setPipeline(data.data);
    } catch {
      // pipeline stays null
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEnterprise) fetchPipeline();
    else setLoading(false);
  }, [isEnterprise]);

  if (!isEnterprise) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <Lock className="w-6 h-6 text-orange-400" />
        </div>
        <h3 className="text-base font-bold text-white">Enterprise Feature</h3>
        <p className="text-sm text-gray-600 max-w-sm">
          The recruitment pipeline is available to Enterprise, Concierge, and Admin accounts.
          Upgrade to manage candidates through every hiring stage.
        </p>
        <Link
          href="/pricing?plan=enterprise"
          className="px-6 py-2.5 rounded-full text-sm font-bold bg-gradient-to-r from-orange-500 to-orange-700 text-white hover:from-orange-600 hover:to-orange-800 transition"
        >
          Upgrade to Enterprise
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-2 border-orange-500/40 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Stats bar */}
      {pipeline && (
        <div className="flex flex-wrap gap-3">
          {COLUMNS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <span className="text-[10px] text-gray-600 uppercase tracking-wide">{label}</span>
              <span className="text-sm font-bold text-white">{pipeline.counts[key] ?? 0}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 ml-auto">
            <span className="text-[10px] text-orange-300 uppercase tracking-wide">Total Active</span>
            <span className="text-sm font-bold text-orange-300">{pipeline.total}</span>
          </div>
        </div>
      )}

      {/* Kanban board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {COLUMNS.map(({ key, label, color }) => {
            const cards = pipeline?.pipeline[key] ?? [];
            return (
              <div
                key={key}
                className={`w-60 flex flex-col gap-3 rounded-xl p-3 bg-white/[0.025] border-t-2 ${color} border-l border-r border-b border-white/10`}
              >
                {/* Column header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{label}</span>
                  <span className="text-[10px] text-gray-500 bg-white/10 rounded-full px-2 py-0.5">
                    {cards.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-2 min-h-[80px]">
                  <AnimatePresence>
                    {cards.length === 0 ? (
                      <p className="text-[10px] text-gray-600 text-center mt-4">No candidates</p>
                    ) : (
                      cards.map((c) => (
                        <CandidateCard
                          key={c._id}
                          candidate={c}
                          onClick={setSelected}
                          onMove={setSelected}
                        />
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selected && (
        <CandidateDetailModal
          candidate={selected}
          onClose={() => setSelected(null)}
          onStageChange={() => { setSelected(null); fetchPipeline(); }}
        />
      )}
    </div>
  );
}
