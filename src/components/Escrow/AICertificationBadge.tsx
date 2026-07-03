"use client";

import { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaHourglassHalf,
  FaRobot,
  FaShieldAlt,
  FaGavel,
} from "react-icons/fa";

interface Props {
  status: string;
  aiCertified?: boolean;
  aiCertificationScore?: number;
  aiCertificationReport?: string;
  aiAutoReleaseAt?: string;
  releaseMethod?: string;
  compact?: boolean;
}

function useCountdown(targetIso: string | undefined) {
  const [display, setDisplay] = useState<string>("");

  useEffect(() => {
    if (!targetIso) return;

    const tick = () => {
      const diff = new Date(targetIso).getTime() - Date.now();
      if (diff <= 0) {
        setDisplay("Releasing now…");
        return;
      }
      const totalMinutes = Math.floor(diff / 60000);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      setDisplay(`${hours}h ${minutes}m`);
    };

    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [targetIso]);

  return display;
}

function releaseMethodLabel(method?: string): string {
  switch (method) {
    case "client_approved":
      return "Approved by Client";
    case "auto_release":
      return "Auto-Released";
    case "dispute_overruled":
      return "Dispute Overruled by AI";
    default:
      return method ?? "Released";
  }
}

export default function AICertificationBadge({
  status,
  aiCertified,
  aiCertificationScore,
  aiCertificationReport,
  aiAutoReleaseAt,
  releaseMethod,
  compact = false,
}: Props) {
  const countdown = useCountdown(aiAutoReleaseAt);

  // ── COMPACT mode — renders a single pill ─────────────────────────────────
  if (compact) {
    if (["pending", "started", "funded"].includes(status)) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-700/40 border border-gray-600/40 text-gray-400 text-xs font-medium">
          <FaHourglassHalf className="text-[10px]" />
          Awaiting Submission
        </span>
      );
    }

    if (status === "submitted") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium animate-pulse">
          <FaRobot className="text-[10px]" />
          AI Reviewing…
        </span>
      );
    }

    if (status === "ai_certified") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          <FaCheckCircle className="text-[10px]" />
          AI Certified ✓{aiCertificationScore !== undefined ? ` · ${aiCertificationScore}/100` : ""}
        </span>
      );
    }

    if (status === "ai_rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
          <FaTimesCircle className="text-[10px]" />
          Review Required
        </span>
      );
    }

    if (status === "dispute") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium animate-pulse">
          <FaGavel className="text-[10px]" />
          Under Dispute — AI Arbitrating
        </span>
      );
    }

    if (["approved", "completed", "released"].includes(status)) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          <FaShieldAlt className="text-[10px]" />
          Funds Released ✓ · {releaseMethodLabel(releaseMethod)}
        </span>
      );
    }

    return null;
  }

  // ── FULL CARD mode ────────────────────────────────────────────────────────

  // Awaiting Submission
  if (["pending", "started", "funded"].includes(status)) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
          <FaHourglassHalf className="text-gray-500" />
        </div>
        <div>
          <p className="text-white font-semibold">Awaiting Submission</p>
          <p className="text-gray-500 text-sm">The consultant has not yet submitted deliverables.</p>
        </div>
      </div>
    );
  }

  // AI Reviewing
  if (status === "submitted") {
    return (
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0 animate-pulse">
          <FaRobot className="text-amber-400" />
        </div>
        <div>
          <p className="text-amber-400 font-semibold">AI Reviewing…</p>
          <p className="text-amber-400/70 text-sm">
            Deliverables have been submitted and are being verified by our AI agent.
          </p>
        </div>
      </div>
    );
  }

  // AI Certified
  if (status === "ai_certified") {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <FaCheckCircle className="text-emerald-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <p className="text-emerald-400 font-semibold">AI Certified ✓</p>
              {aiCertificationScore !== undefined && (
                <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold px-2 py-0.5 rounded-full">
                  {aiCertificationScore}/100
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm mt-0.5">
              Deliverables passed AI verification and are pending client review.
            </p>
          </div>
        </div>

        {/* Score bar */}
        {aiCertificationScore !== undefined && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>AI Confidence</span>
              <span className="text-emerald-400 font-medium">{aiCertificationScore}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-emerald-400 h-2 rounded-full transition-all duration-700"
                style={{ width: `${aiCertificationScore}%` }}
              />
            </div>
          </div>
        )}

        {/* Report excerpt */}
        {aiCertificationReport && (
          <p className="text-gray-400 text-sm border-t border-emerald-500/10 pt-3">
            {aiCertificationReport}
          </p>
        )}

        {/* Countdown */}
        {aiAutoReleaseAt && countdown && (
          <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-4 py-2.5">
            <FaHourglassHalf className="text-emerald-400/70 text-sm flex-shrink-0" />
            <span className="text-emerald-400/90 text-sm">
              Auto-releases in:{" "}
              <span className="font-bold">{countdown}</span>
            </span>
          </div>
        )}
      </div>
    );
  }

  // AI Rejected
  if (status === "ai_rejected") {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center flex-shrink-0">
            <FaTimesCircle className="text-red-400" />
          </div>
          <div>
            <p className="text-red-400 font-semibold">Review Required</p>
            <p className="text-gray-400 text-sm mt-0.5">
              AI found issues with the submission. Please revise and resubmit.
            </p>
          </div>
        </div>
        {aiCertificationReport && (
          <p className="text-gray-400 text-sm border-t border-red-500/10 pt-3">
            {aiCertificationReport}
          </p>
        )}
      </div>
    );
  }

  // Under Dispute
  if (status === "dispute") {
    return (
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0 animate-pulse">
          <FaGavel className="text-amber-400" />
        </div>
        <div>
          <p className="text-amber-400 font-semibold">Under Dispute — AI Arbitrating</p>
          <p className="text-amber-400/70 text-sm mt-0.5">
            A dispute has been raised. Our AI is evaluating both sides and will issue a verdict shortly.
          </p>
        </div>
      </div>
    );
  }

  // Approved / Completed / Released
  if (["approved", "completed", "released"].includes(status)) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
          <FaShieldAlt className="text-emerald-400" />
        </div>
        <div>
          <p className="text-emerald-400 font-semibold">Funds Released ✓</p>
          <p className="text-gray-400 text-sm mt-0.5">{releaseMethodLabel(releaseMethod)}</p>
        </div>
      </div>
    );
  }

  // Fallback — unknown status
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
      <FaSpinner className="text-gray-500 animate-spin" />
      <p className="text-gray-500 text-sm">Loading status…</p>
    </div>
  );
}
