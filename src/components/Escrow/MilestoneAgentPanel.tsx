"use client";

import { useEffect } from "react";
import {
  FaRobot,
  FaGavel,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

import DeliverableSubmitForm from "./DeliverableSubmitForm";
import AICertificationBadge from "./AICertificationBadge";
import ClientReviewPanel from "./ClientReviewPanel";

interface Milestone {
  _id: string;
  title: string;
  description: string;
  status: string;
  amount: number;
  aiCertified?: boolean;
  aiCertificationScore?: number;
  aiCertificationReport?: string;
  aiAutoReleaseAt?: string;
  deliverableNotes?: string;
  deliverableUrls?: string[];
  aiDisputeVerdict?: string;
  aiDisputeReport?: string;
  releaseMethod?: string;
  fundsReleasedAt?: string;
}

interface Project {
  _id: string;
  title?: string;
  ownerId: string;
}

interface Props {
  milestone: Milestone;
  project: Project;
  currentUserId: string;
  userRole: "client" | "seller" | "admin";
  onRefresh?: () => void;
}

const SELLER_SUBMIT_STATUSES = ["pending", "started", "funded"];
const SELLER_CERT_STATUSES = ["submitted", "ai_certified", "ai_rejected"];
const SELLER_RELEASED_STATUSES = ["approved", "completed", "released"];
const CLIENT_REVIEW_STATUS = "ai_certified";
const CLIENT_PENDING_STATUSES = ["pending", "started", "submitted", "funded"];
const CLIENT_RELEASED_STATUSES = ["approved", "completed", "released"];

export default function MilestoneAgentPanel({
  milestone,
  project,
  currentUserId,
  userRole,
  onRefresh,
}: Props) {
  // Trigger auto-release check on mount
  useEffect(() => {
    fetch("/api/escrow/auto-release", {
      method: "GET",
      credentials: "include",
    }).catch(() => {
      // Silently ignore — auto-release is best-effort
    });
  }, []);

  const status = milestone.status;

  // ── SELLER VIEW ────────────────────────────────────────────────────────────
  if (userRole === "seller") {

    // Step 1: Can submit deliverables
    if (SELLER_SUBMIT_STATUSES.includes(status)) {
      return (
        <DeliverableSubmitForm
          milestoneId={milestone._id}
          projectId={project._id}
          milestoneTitle={milestone.title}
          milestoneDescription={milestone.description}
          onSubmitted={onRefresh}
        />
      );
    }

    // Step 2: Submission made — show AI cert status
    if (SELLER_CERT_STATUSES.includes(status)) {
      return (
        <div className="space-y-4">
          <AICertificationBadge
            status={status}
            aiCertified={milestone.aiCertified}
            aiCertificationScore={milestone.aiCertificationScore}
            aiCertificationReport={milestone.aiCertificationReport}
            aiAutoReleaseAt={milestone.aiAutoReleaseAt}
            releaseMethod={milestone.releaseMethod}
          />

          {/* If rejected — prompt resubmit */}
          {status === "ai_rejected" && (
            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-sm">
                Please address the AI feedback above and use the form below to resubmit your deliverables.
              </p>
              <button
                onClick={onRefresh}
                className="mt-3 text-sm font-semibold underline text-[#C12129] hover:text-red-400 transition-colors"
              >
                Resubmit Deliverables →
              </button>
            </div>
          )}

          {/* If certified — waiting on client */}
          {status === "ai_certified" && (
            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5 flex items-start gap-3">
              <FaClock className="text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white font-semibold text-sm">Awaiting Client Review</p>
                <p className="text-gray-500 text-xs mt-1">
                  The client has been notified and has 12 hours to approve or dispute.
                  If they take no action, funds will auto-release.
                </p>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Step 3: Dispute active
    if (status === "dispute") {
      return (
        <div className="space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0 animate-pulse">
              <FaGavel className="text-amber-400" />
            </div>
            <div>
              <h3 className="text-amber-400 font-semibold text-lg">Dispute in Progress</h3>
              <p className="text-gray-400 text-sm mt-1">
                The client has raised a dispute. Our AI agent is reviewing both the deliverables and the dispute reason.
                You will be notified once a verdict is issued.
              </p>
              {milestone.aiDisputeReport && (
                <p className="text-gray-300 text-sm mt-3 border-t border-amber-500/10 pt-3">
                  {milestone.aiDisputeReport}
                </p>
              )}
            </div>
          </div>

          {/* Dispute verdict: overruled — funds releasing */}
          {milestone.aiDisputeVerdict === "invalid" && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-3">
              <FaCheckCircle className="text-emerald-400 flex-shrink-0" />
              <p className="text-emerald-400 text-sm">
                The dispute was overruled by AI. Funds will be released shortly.
              </p>
            </div>
          )}
        </div>
      );
    }

    // Step 4: Completed / released
    if (SELLER_RELEASED_STATUSES.includes(status)) {
      return (
        <div className="space-y-4">
          <AICertificationBadge
            status={status}
            aiCertified={milestone.aiCertified}
            aiCertificationScore={milestone.aiCertificationScore}
            aiCertificationReport={milestone.aiCertificationReport}
            releaseMethod={milestone.releaseMethod}
          />
          {milestone.fundsReleasedAt && (
            <p className="text-gray-500 text-xs text-center">
              Released on {new Date(milestone.fundsReleasedAt).toLocaleString()}
            </p>
          )}
        </div>
      );
    }
  }

  // ── CLIENT VIEW ────────────────────────────────────────────────────────────
  if (userRole === "client") {

    // Review required
    if (status === CLIENT_REVIEW_STATUS) {
      return (
        <div className="space-y-4">
          <ClientReviewPanel
            milestoneId={milestone._id}
            projectId={project._id}
            milestoneTitle={milestone.title}
            aiCertificationReport={milestone.aiCertificationReport ?? ""}
            aiCertificationScore={milestone.aiCertificationScore ?? 0}
            deliverableNotes={milestone.deliverableNotes ?? ""}
            deliverableUrls={milestone.deliverableUrls ?? []}
            aiAutoReleaseAt={milestone.aiAutoReleaseAt ?? ""}
            onApproved={onRefresh}
            onDisputed={onRefresh}
          />
          <AICertificationBadge
            status={status}
            aiCertified={milestone.aiCertified}
            aiCertificationScore={milestone.aiCertificationScore}
            aiAutoReleaseAt={milestone.aiAutoReleaseAt}
            compact
          />
        </div>
      );
    }

    // Awaiting consultant
    if (CLIENT_PENDING_STATUSES.includes(status)) {
      return (
        <div className="space-y-4">
          <AICertificationBadge
            status={status}
            aiCertified={milestone.aiCertified}
            aiCertificationScore={milestone.aiCertificationScore}
            aiCertificationReport={milestone.aiCertificationReport}
            aiAutoReleaseAt={milestone.aiAutoReleaseAt}
          />
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5 flex items-start gap-3">
            <FaRobot className="text-gray-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-white font-semibold text-sm">Awaiting Consultant Submission</p>
              <p className="text-gray-500 text-xs mt-1">
                The consultant is working on the deliverables. You will be notified when they submit
                and after AI verification is complete.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Dispute in progress
    if (status === "dispute") {
      return (
        <div className="space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0 animate-pulse">
              <FaGavel className="text-amber-400" />
            </div>
            <div>
              <h3 className="text-amber-400 font-semibold text-lg">Dispute Under AI Review</h3>
              <p className="text-gray-400 text-sm mt-1">
                Your dispute has been submitted. Our AI is evaluating the deliverables and your dispute reason.
                A verdict will be issued shortly — you will be notified.
              </p>
              {milestone.aiDisputeReport && (
                <p className="text-gray-300 text-sm mt-3 border-t border-amber-500/10 pt-3">
                  {milestone.aiDisputeReport}
                </p>
              )}
            </div>
          </div>

          <AICertificationBadge
            status={status}
            compact
          />
        </div>
      );
    }

    // Released
    if (CLIENT_RELEASED_STATUSES.includes(status)) {
      return (
        <div className="space-y-4">
          <AICertificationBadge
            status={status}
            releaseMethod={milestone.releaseMethod}
            aiCertificationScore={milestone.aiCertificationScore}
          />
          {milestone.fundsReleasedAt && (
            <p className="text-gray-500 text-xs text-center">
              Funds transferred on {new Date(milestone.fundsReleasedAt).toLocaleString()}
            </p>
          )}
        </div>
      );
    }
  }

  // ── ADMIN VIEW / Fallback ─────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <AICertificationBadge
        status={status}
        aiCertified={milestone.aiCertified}
        aiCertificationScore={milestone.aiCertificationScore}
        aiCertificationReport={milestone.aiCertificationReport}
        aiAutoReleaseAt={milestone.aiAutoReleaseAt}
        releaseMethod={milestone.releaseMethod}
      />

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-2">
        <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">Admin Info</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-400">
          <span>Status</span>
          <span className="text-white font-medium">{status}</span>
          <span>AI Certified</span>
          <span className={milestone.aiCertified ? "text-emerald-400" : "text-gray-500"}>
            {milestone.aiCertified ? "Yes" : "No"}
          </span>
          {milestone.aiCertificationScore !== undefined && (
            <>
              <span>AI Score</span>
              <span className="text-white">{milestone.aiCertificationScore}/100</span>
            </>
          )}
          {milestone.releaseMethod && (
            <>
              <span>Release Method</span>
              <span className="text-white">{milestone.releaseMethod}</span>
            </>
          )}
          {milestone.fundsReleasedAt && (
            <>
              <span>Released At</span>
              <span className="text-white">{new Date(milestone.fundsReleasedAt).toLocaleString()}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
