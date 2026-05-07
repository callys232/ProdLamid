"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, ChevronDown, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

interface Milestone {
  title: string;
  description: string;
  durationDays: number;
  payment_percentage: number;
  acceptance_criteria: string;
}
interface Phase { name: string; duration: string; milestones: Milestone[] }
interface Plan {
  phases: Phase[];
  totalDurationWeeks: number;
  riskFlags: string[];
  recommendations: string;
}

interface AIMilestoneGeneratorProps {
  projectId?: string;
  title: string;
  description?: string;
  category?: string;
  skills?: string[];
  budget?: number;
  timeline?: string;
  onApply?: (phases: Phase[]) => void;
}

export default function AIMilestoneGenerator({
  title, description, category, skills, budget, timeline, onApply,
}: AIMilestoneGeneratorProps) {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const generate = async () => {
    setLoading(true); setError(""); setPlan(null);
    try {
      const res = await fetch("/api/ai/milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category, skills, budget, timeline }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPlan(data.plan);
      setExpanded(0);
    } catch (e: any) {
      setError(e.message || "Failed to generate milestones.");
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={generate}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 hover:bg-purple-600/30 hover:border-purple-400 transition text-sm font-medium disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {loading ? "Generating plan…" : "Generate AI Milestone Plan"}
      </button>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <AnimatePresence>
        {plan && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {/* Summary bar */}
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                <Clock className="h-3 w-3" /> {plan.totalDurationWeeks} weeks total
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                {plan.phases.length} phases · {plan.phases.reduce((s, p) => s + p.milestones.length, 0)} milestones
              </span>
            </div>

            {/* Phases */}
            {plan.phases.map((phase, pi) => (
              <div key={pi} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === pi ? null : pi)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm text-left"
                >
                  <span className="font-medium text-white">
                    Phase {pi + 1}: {phase.name}
                    <span className="ml-2 text-xs text-gray-400 font-normal">({phase.duration})</span>
                  </span>
                  <motion.span animate={{ rotate: expanded === pi ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {expanded === pi && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="px-4 pb-4 space-y-3 border-t border-white/10 pt-3">
                        {phase.milestones.map((ms, mi) => (
                          <div key={mi} className="rounded-lg bg-black/40 border border-white/10 p-3 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-white">{ms.title}</p>
                              <span className="text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                                {ms.payment_percentage}% payment
                              </span>
                            </div>
                            <p className="text-xs text-gray-400">{ms.description}</p>
                            <div className="flex items-center gap-3 text-[10px] text-gray-500">
                              <span><Clock className="inline h-3 w-3 mr-1" />{ms.durationDays}d</span>
                              <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" />{ms.acceptance_criteria}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* Risk flags */}
            {plan.riskFlags?.length > 0 && (
              <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 px-4 py-3">
                <p className="text-xs font-semibold text-orange-400 mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />Risk flags
                </p>
                <ul className="space-y-0.5">
                  {plan.riskFlags.map((r, i) => <li key={i} className="text-xs text-gray-400">• {r}</li>)}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {plan.recommendations && (
              <p className="text-xs text-gray-400 italic border-l-2 border-purple-500/40 pl-3">{plan.recommendations}</p>
            )}

            {/* Apply button */}
            {onApply && (
              <button
                onClick={() => onApply(plan.phases)}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" /> Apply this plan to project
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
