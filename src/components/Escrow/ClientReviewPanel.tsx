"use client";

import { useState, useEffect, useRef } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaClock,
  FaFileAlt,
  FaExclamationTriangle,
  FaCloudUploadAlt,
  FaFile,
  FaGavel,
  FaExternalLinkAlt,
} from "react-icons/fa";

interface Props {
  milestoneId: string;
  projectId: string;
  milestoneTitle: string;
  aiCertificationReport: string;
  aiCertificationScore: number;
  deliverableNotes: string;
  deliverableUrls: string[];
  aiAutoReleaseAt: string;
  onApproved?: () => void;
  onDisputed?: (result: any) => void;
}

function useCountdown(targetIso: string) {
  const [display, setDisplay] = useState<string>("");

  useEffect(() => {
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

function getFileLabel(url: string, index: number): string {
  try {
    const decoded = decodeURIComponent(url);
    const parts = decoded.split("/");
    const last = parts[parts.length - 1];
    return last.split("?")[0] || `Deliverable ${index + 1}`;
  } catch {
    return `Deliverable ${index + 1}`;
  }
}

type DisputeState = "idle" | "form" | "loading" | "invalid" | "valid";

export default function ClientReviewPanel({
  milestoneId,
  projectId,
  milestoneTitle,
  aiCertificationReport,
  aiCertificationScore,
  deliverableNotes,
  deliverableUrls,
  aiAutoReleaseAt,
  onApproved,
  onDisputed,
}: Props) {
  const countdown = useCountdown(aiAutoReleaseAt);

  const [isApproving, setIsApproving] = useState(false);
  const [approveError, setApproveError] = useState<string | null>(null);
  const [approved, setApproved] = useState(false);

  const [disputeState, setDisputeState] = useState<DisputeState>("idle");
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeFiles, setDisputeFiles] = useState<File[]>([]);
  const [disputeResult, setDisputeResult] = useState<any>(null);
  const [disputeError, setDisputeError] = useState<string | null>(null);
  const [isUploadingEvidence, setIsUploadingEvidence] = useState(false);

  const disputeFileRef = useRef<HTMLInputElement>(null);
  const disputeFormRef = useRef<HTMLDivElement>(null);

  // Scroll into view when dispute form opens
  useEffect(() => {
    if (disputeState === "form") {
      setTimeout(() => disputeFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [disputeState]);

  const handleApprove = async () => {
    setApproveError(null);
    setIsApproving(true);
    try {
      const res = await fetch(
        `/api/projects/${projectId}/milestones/${milestoneId}/approve`,
        { method: "PATCH", credentials: "include" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Approval failed.");
      setApproved(true);
      onApproved?.();
    } catch (err: any) {
      setApproveError(err.message || "Failed to approve. Please try again.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleDisputeSubmit = async () => {
    setDisputeError(null);
    if (disputeReason.trim().length < 30) {
      setDisputeError("Please provide at least 30 characters describing your dispute.");
      return;
    }

    setDisputeState("loading");
    try {
      const res = await fetch("/api/ai/dispute-check", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          milestoneId,
          projectId,
          disputeReason: disputeReason.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Dispute check failed.");
      setDisputeResult(data);
      setDisputeState(data.verdict === "invalid" ? "invalid" : "valid");
      onDisputed?.(data);
    } catch (err: any) {
      setDisputeError(err.message || "Failed to submit dispute.");
      setDisputeState("form");
    }
  };

  const scoreColor = aiCertificationScore >= 70 ? "bg-emerald-400" : aiCertificationScore >= 40 ? "bg-amber-400" : "bg-red-400";
  const scoreTextColor = aiCertificationScore >= 70 ? "text-emerald-400" : aiCertificationScore >= 40 ? "text-amber-400" : "text-red-400";

  // ── Approved state ─────────────────────────────────────────────────────────
  if (approved) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <FaCheckCircle className="text-emerald-400 text-3xl" />
        </div>
        <div>
          <h3 className="text-white font-bold text-xl">Funds Released</h3>
          <p className="text-emerald-400 text-sm mt-1">You approved the deliverables. Funds are being transferred to the consultant.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Header card ──────────────────────────────────────────────────── */}
      <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h2 className="text-white font-bold text-xl">Deliverable Review Required</h2>
            <p className="text-gray-400 text-sm mt-1">{milestoneTitle}</p>
          </div>
          {countdown && (
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2 flex-shrink-0">
              <FaClock className="text-amber-400 text-sm" />
              <span className="text-amber-400 text-sm font-semibold">{countdown} Remaining</span>
            </div>
          )}
        </div>
        <p className="text-gray-500 text-xs mt-3">
          If you take no action before the timer expires, funds will be automatically released to the consultant.
        </p>
      </div>

      {/* ── AI Report ────────────────────────────────────────────────────── */}
      <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-emerald-400" />
          <h3 className="text-white font-semibold">AI Verification Report</h3>
          <span className={`ml-auto text-sm font-bold ${scoreTextColor}`}>{aiCertificationScore}/100</span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>AI Confidence Score</span>
            <span className={scoreTextColor}>{aiCertificationScore}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-700 ${scoreColor}`}
              style={{ width: `${Math.max(aiCertificationScore, 2)}%` }}
            />
          </div>
        </div>

        <p className="text-gray-300 text-sm leading-relaxed">{aiCertificationReport}</p>
      </div>

      {/* ── Delivery Notes ───────────────────────────────────────────────── */}
      <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2">
          <FaFileAlt className="text-gray-500" />
          <h3 className="text-white font-semibold">Consultant Delivery Notes</h3>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{deliverableNotes}</p>
      </div>

      {/* ── Files ────────────────────────────────────────────────────────── */}
      {deliverableUrls.length > 0 && (
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <FaFile className="text-gray-500" />
            <h3 className="text-white font-semibold">Submitted Files</h3>
            <span className="text-xs text-gray-600 ml-auto">{deliverableUrls.length} file{deliverableUrls.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="space-y-2">
            {deliverableUrls.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl px-4 py-3 transition-colors group"
              >
                <FaFile className="text-gray-500 group-hover:text-white transition-colors flex-shrink-0" />
                <span className="text-gray-300 text-sm group-hover:text-white transition-colors truncate">
                  {getFileLabel(url, i)}
                </span>
                <FaExternalLinkAlt className="text-gray-600 group-hover:text-gray-400 transition-colors text-xs ml-auto flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── Approve error ─────────────────────────────────────────────────── */}
      {approveError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
          <FaTimesCircle className="text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{approveError}</p>
        </div>
      )}

      {/* ── Action buttons ────────────────────────────────────────────────── */}
      {disputeState === "idle" && (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleApprove}
            disabled={isApproving}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all"
          >
            {isApproving ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaCheckCircle />
            )}
            {isApproving ? "Releasing Funds…" : "✓ Approve & Release Funds"}
          </button>
          <button
            onClick={() => setDisputeState("form")}
            className="flex-1 flex items-center justify-center gap-2 border border-red-500/50 hover:bg-red-500/10 text-red-400 hover:text-red-300 font-semibold py-3.5 rounded-xl transition-all"
          >
            <FaTimesCircle />
            ✗ Dispute Deliverables
          </button>
        </div>
      )}

      {/* ── Dispute form ─────────────────────────────────────────────────── */}
      {(disputeState === "form" || disputeState === "loading") && (
        <div
          ref={disputeFormRef}
          className="bg-gray-950 border border-amber-500/20 rounded-2xl p-6 space-y-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
              <FaGavel className="text-amber-400 text-sm" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Raise a Dispute</h3>
              <p className="text-gray-500 text-xs">Our AI will evaluate your dispute against the submission.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-gray-300 text-sm font-medium">
              Reason for Dispute <span className="text-[#C12129]">*</span>
            </label>
            <textarea
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="Explain specifically what is missing or incorrect about the deliverables..."
              rows={5}
              disabled={disputeState === "loading"}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white placeholder-gray-600 text-sm resize-none focus:outline-none focus:border-amber-500/50 transition-colors disabled:opacity-50"
            />
            <div className="flex justify-between">
              <span className="text-xs text-gray-600">Minimum 30 characters</span>
              <span className={`text-xs ${disputeReason.length >= 30 ? "text-emerald-400" : "text-gray-600"}`}>
                {disputeReason.length} chars
              </span>
            </div>
          </div>

          {/* Evidence upload */}
          <div className="space-y-2">
            <label className="text-gray-400 text-sm">Evidence Files (optional)</label>
            <div
              onClick={() => disputeFileRef.current?.click()}
              className="border border-dashed border-gray-700 hover:border-gray-600 rounded-xl p-5 flex items-center gap-3 cursor-pointer transition-all"
            >
              <input
                ref={disputeFileRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) setDisputeFiles(Array.from(e.target.files));
                }}
              />
              <FaCloudUploadAlt className="text-gray-600 text-2xl" />
              <div>
                <p className="text-gray-400 text-sm">
                  {disputeFiles.length > 0
                    ? `${disputeFiles.length} file${disputeFiles.length !== 1 ? "s" : ""} selected`
                    : "Attach supporting evidence"}
                </p>
                <p className="text-gray-600 text-xs">Screenshots, documents, or any relevant files</p>
              </div>
            </div>
          </div>

          {disputeError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2">
              <FaTimesCircle className="text-red-400 text-sm flex-shrink-0" />
              <p className="text-red-400 text-sm">{disputeError}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleDisputeSubmit}
              disabled={disputeState === "loading"}
              className="flex-1 flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#C12129" }}
            >
              {disputeState === "loading" ? (
                <>
                  <FaSpinner className="animate-spin" />
                  AI is evaluating your dispute…
                </>
              ) : (
                <>
                  <FaGavel />
                  Submit Dispute
                </>
              )}
            </button>
            {disputeState === "form" && (
              <button
                onClick={() => {
                  setDisputeState("idle");
                  setDisputeReason("");
                  setDisputeFiles([]);
                  setDisputeError(null);
                }}
                className="px-5 py-3 rounded-xl border border-gray-700 hover:border-gray-600 text-gray-400 hover:text-white transition-all font-semibold text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Dispute verdict: invalid (overruled) ─────────────────────────── */}
      {disputeState === "invalid" && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
              <FaExclamationTriangle className="text-amber-400 text-sm" />
            </div>
            <h3 className="text-amber-400 font-semibold">Dispute Reviewed by AI</h3>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Your dispute was reviewed. AI determined the deliverables meet the milestone requirements.
            Funds will be released in 2 hours.
          </p>
          {disputeResult?.report && (
            <p className="text-gray-400 text-sm border-t border-amber-500/10 pt-3">{disputeResult.report}</p>
          )}
        </div>
      )}

      {/* ── Dispute verdict: valid (accepted) ────────────────────────────── */}
      {disputeState === "valid" && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <FaCheckCircle className="text-emerald-400 text-sm" />
            </div>
            <h3 className="text-emerald-400 font-semibold">Dispute Accepted</h3>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Your dispute has been accepted. The consultant has been notified and will need to revise their submission.
          </p>
          {disputeResult?.report && (
            <p className="text-gray-400 text-sm border-t border-emerald-500/10 pt-3">{disputeResult.report}</p>
          )}
        </div>
      )}
    </div>
  );
}
