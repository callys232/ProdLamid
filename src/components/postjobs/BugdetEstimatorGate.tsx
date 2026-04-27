"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles, TrendingUp, DollarSign, Clock, MapPin, ChevronRight, Lock } from "lucide-react";
import { mockJobs } from "@/mocks/mockJobs";
import type { Project } from "@/types/project";

interface AiEstimate {
  budgetMin: number;
  budgetMax: number;
  durationMonths: number;
  explanation: string;
}

interface Props {
  project: Partial<Project>;
  isPremiumUser?: boolean;
  onResult?: (data: AiEstimate) => void;
}

/* ── Score a mock job for similarity to the current project ──── */
function similarityScore(job: typeof mockJobs[0], project: Partial<Project>): number {
  let score = 0;
  if (job.category === project.category) score += 10;
  if (job.location === project.location) score += 2;
  const projectSkills = (project.skills ?? []).map((s) => s.toLowerCase());
  const jobSkills     = (job.skills    ?? []).map((s) => s.toLowerCase());
  projectSkills.forEach((ps) => {
    if (jobSkills.some((js) => js.includes(ps) || ps.includes(js))) score += 3;
  });
  return score;
}

function findSimilar(project: Partial<Project>, limit = 3) {
  if (!project.category && !project.skills?.length) return [];
  return [...mockJobs]
    .map((j) => ({ job: j, score: similarityScore(j, project) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ job }) => job);
}

function marketStats(jobs: typeof mockJobs) {
  const budgets = jobs.map((j) => j.budget).filter((b): b is number => b != null);
  if (!budgets.length) return null;
  return {
    min: Math.min(...budgets),
    max: Math.max(...budgets),
    avg: Math.round(budgets.reduce((a, b) => a + b, 0) / budgets.length),
    rates: jobs.map((j) => j.hourlyRate).filter((r): r is number => r != null),
  };
}

/* ── Component ───────────────────────────────────────────────── */
export default function BudgetEstimatorGate({ project, isPremiumUser = true, onResult }: Props) {
  const [aiEstimate, setAiEstimate]   = useState<AiEstimate | null>(null);
  const [loading, setLoading]         = useState(false);
  const [source, setSource]           = useState<"ai" | "market" | null>(null);

  const similar = useMemo(() => findSimilar(project), [
    project.category,
    project.skills?.join(","),
    project.location,
  ]);

  const stats = useMemo(() => marketStats(similar), [similar]);

  const hasInput = !!(project.title || project.category);

  /* ── Call /api/projects/estimate whenever key fields change ── */
  useEffect(() => {
    if (!project.title || !project.category) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/projects/estimate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title:       project.title,
            category:    project.category,
            description: project.description,
            skills:      project.skills ?? [],
            location:    project.location,
          }),
        });

        if (res.ok) {
          const data: AiEstimate = await res.json();
          setAiEstimate(data);
          setSource("ai");
          onResult?.(data);
        } else {
          throw new Error("estimate api failed");
        }
      } catch {
        // Fallback: derive from similar projects
        if (stats) {
          const fallback: AiEstimate = {
            budgetMin:      stats.min,
            budgetMax:      stats.max,
            durationMonths: 3,
            explanation:    `Estimated from ${similar.length} comparable ${project.category ?? ""} project${similar.length !== 1 ? "s" : ""} on the platform.`,
          };
          setAiEstimate(fallback);
          setSource("market");
          onResult?.(fallback);
        }
      } finally {
        setLoading(false);
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [project.title, project.category, project.description, project.skills?.join(",")]);

  /* ── Empty state ─────────────────────────────────────────────── */
  if (!hasInput) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center space-y-2">
        <Sparkles className="mx-auto h-6 w-6 text-gray-600" />
        <p className="text-sm text-gray-500">
          Enter a project title and category to see AI budget estimates and similar projects.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* ── AI / Market Estimate ───────────────────────────────── */}
      <div className={`rounded-xl border p-5 ${source === "ai" ? "border-red-600/30 bg-red-600/5" : "border-blue-600/20 bg-blue-600/5"}`}>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-red-500" />
          <h3 className="text-sm font-semibold text-white">
            {source === "ai" ? "AI Budget Estimate" : "Market Estimate"}
          </h3>
          {loading && (
            <div className="ml-auto h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
          )}
          {source && !loading && (
            <span className={`ml-auto rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
              source === "ai" ? "bg-red-600/20 text-red-400" : "bg-blue-600/20 text-blue-400"
            }`}>
              {source === "ai" ? "AI powered" : "from platform data"}
            </span>
          )}
        </div>

        {loading && !aiEstimate ? (
          <div className="space-y-2">
            <div className="h-3.5 w-3/4 animate-pulse rounded bg-white/10" />
            <div className="h-3.5 w-1/2 animate-pulse rounded bg-white/10" />
          </div>
        ) : aiEstimate ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white/5 px-3 py-2.5 text-center">
                <div className="mb-0.5 flex items-center justify-center gap-1 text-[10px] text-gray-500">
                  <DollarSign className="h-3 w-3" /> Budget Range
                </div>
                <p className="text-sm font-bold text-white">
                  ${aiEstimate.budgetMin.toLocaleString()} – ${aiEstimate.budgetMax.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-white/5 px-3 py-2.5 text-center">
                <div className="mb-0.5 flex items-center justify-center gap-1 text-[10px] text-gray-500">
                  <Clock className="h-3 w-3" /> Duration
                </div>
                <p className="text-sm font-bold text-white">
                  {aiEstimate.durationMonths} month{aiEstimate.durationMonths !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {aiEstimate.explanation && (
              <p className="rounded-lg bg-white/5 px-3 py-2 text-xs leading-relaxed text-gray-400 italic">
                &ldquo;{aiEstimate.explanation}&rdquo;
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-500">Add a title and category to generate an estimate.</p>
        )}
      </div>

      {/* ── Similar Projects ───────────────────────────────────── */}
      {similar.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Similar Projects on Platform</h3>
            <span className="ml-auto text-[10px] text-gray-500">{similar.length} matched</span>
          </div>

          <div className="space-y-2">
            {similar.map((job) => (
              <div
                key={job.id}
                className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 px-3 py-2.5 transition hover:border-white/10"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-white">{job.title}</p>
                  <div className="mt-0.5 flex items-center gap-2 text-[10px] text-gray-500">
                    <span>{job.organization}</span>
                    {job.location && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-0.5">
                          <MapPin className="h-2.5 w-2.5" />{job.location}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0 text-right">
                  <p className="text-xs font-semibold text-green-400">
                    {job.budget
                      ? `$${job.budget.toLocaleString()}`
                      : job.hourlyRate
                      ? `$${job.hourlyRate}/hr`
                      : "—"}
                  </p>
                  {job.priority && (
                    <p className="text-[10px] capitalize text-gray-500">{job.priority} priority</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Market range summary */}
          {stats && (
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t border-white/10 pt-3 text-[10px] text-gray-500">
              <span>
                Range: <span className="text-white">${stats.min.toLocaleString()} – ${stats.max.toLocaleString()}</span>
              </span>
              <span>
                Avg: <span className="text-white">${stats.avg.toLocaleString()}</span>
              </span>
              {stats.rates.length > 0 && (
                <span>
                  Hourly: <span className="text-white">
                    ${Math.min(...stats.rates)} – ${Math.max(...stats.rates)}/hr
                  </span>
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Premium upsell ─────────────────────────────────────── */}
      {!isPremiumUser && (
        <div className="rounded-xl border border-yellow-600/30 bg-yellow-600/5 p-4">
          <div className="flex items-start gap-3">
            <Lock className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-yellow-400">Unlock Full AI Analysis</p>
              <p className="mt-0.5 text-xs text-gray-400">
                Detailed cost breakdowns, risk analysis, milestone scheduling, and real-time market comps.
              </p>
            </div>
          </div>
          <a
            href="/subscription"
            className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-[#c21219] px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 active:scale-95"
          >
            Upgrade to Premium <ChevronRight className="h-3.5 w-3.5" />
          </a>
        </div>
      )}
    </div>
  );
}
