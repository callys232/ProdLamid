
"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type {
    Project,
    WorkPhase,
    Milestone,
    ProjectDocument,
    ProjectConsultant,
    ActivityItem,
    EscrowTransaction,
} from "@/types/project";

/**
 * Import mocks directly and use them as a fallback when `project` is not provided
 * or when it's empty (e.g., DB/API down and caller passes nothing).
 */
import { mockProjects, mockClient } from "@/mocks/mockClientProfile";

const statusColors: Record<string, string> = {
    pending: "bg-gray-500",
    in_progress: "bg-blue-500",
    funded: "bg-yellow-500",
    released: "bg-green-500",
    completed: "bg-green-700",
    cancelled: "bg-orange-500",
    disputed: "bg-red-600",
};

const phaseColors: Record<string, string> = {
    pending: "text-gray-400",
    active: "text-red-500",
    completed: "text-green-500",
};

function getProgressColor(status?: string) {
    if (!status) return "bg-red-500";
    const s = status.toLowerCase();
    if (s === "completed") return "bg-green-500";
    if (s === "pending") return "bg-orange-500";
    if (s === "defaulting") return "bg-red-500";
    if (s === "under_review" || s === "disputed") return "bg-yellow-400";
    if (s === "in_progress") return "bg-blue-500";
    if (s === "funded" || s === "released") return "bg-green-500";
    return "bg-red-500";
}

function fmtDate(d?: string) {
    if (!d) return "N/A";
    try {
        return new Date(d).toLocaleString();
    } catch {
        return d;
    }
}

export default function ProjectModal({
    project,
    onClose,
    premiumUser,
}: {
    project?: Project | null;
    onClose: () => void;
    premiumUser?: boolean;
}) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        containerRef.current?.focus();
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    // Use provided project if valid, otherwise fall back to first mock project
    const isProjectValid = project && Object.keys(project).length > 0;
    const fallbackProject: Project = mockProjects[0];
    const effectiveProject: Project = isProjectValid ? (project as Project) : fallbackProject;
    const isFallback = !isProjectValid;

    const phases: WorkPhase[] = effectiveProject.workPhases ?? [];
    const milestones: Milestone[] = effectiveProject.milestones ?? [];
    const docsFromProject: ProjectDocument[] =
        (effectiveProject.milestones ?? []).flatMap((m) => m.documents ?? []).concat((effectiveProject as any).documents ?? []);

    return (
        <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.div
                ref={containerRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby="project-modal-title"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative z-10 w-full max-w-5xl bg-gray-900 rounded-xl p-6 shadow-xl border border-gray-700 overflow-hidden"
            >
                {/* Fallback banner */}
                {isFallback && (
                    <div className="mb-4 px-3 py-2 bg-yellow-600 text-black text-xs rounded">
                        Showing mock project data while the service is unavailable.
                    </div>
                )}

                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 id="project-modal-title" className="text-2xl font-semibold text-white">
                            {effectiveProject.title}
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">{effectiveProject.description}</p>
                        <div className="mt-3 text-xs text-gray-300 grid grid-cols-2 gap-2">
                            <div><strong>Category:</strong> {effectiveProject.category ?? "—"}</div>
                            <div><strong>Budget:</strong> {effectiveProject.currency ? `${effectiveProject.currency} ${effectiveProject.budget ?? 0}` : `$${effectiveProject.budget ?? 0}`}</div>
                            <div><strong>Deadline:</strong> {fmtDate(effectiveProject.deadline)}</div>
                            <div><strong>Purpose:</strong> {effectiveProject.purpose ?? "—"}</div>
                            {effectiveProject.suggestedBidRange && (
                                <div><strong>Suggested Range:</strong> {effectiveProject.currency ?? "$"}{effectiveProject.suggestedBidRange.min} – {effectiveProject.currency ?? "$"}{effectiveProject.suggestedBidRange.max}</div>
                            )}
                        </div>
                    </div>

                    <div className="flex-shrink-0">
                        <button
                            onClick={onClose}
                            aria-label="Close project details"
                            className="px-3 py-2 rounded-md bg-gray-800 text-sm text-gray-200 hover:bg-gray-700"
                        >
                            Close
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column: Phases & Milestones */}
                    <div className="lg:col-span-2 overflow-y-auto max-h-[65vh] pr-2">
                        <section aria-labelledby="phases-heading">
                            <h3 id="phases-heading" className="text-lg font-semibold text-white mb-3">Work Phases & Milestones</h3>

                            {phases.length === 0 && milestones.length === 0 && (
                                <div className="text-xs text-gray-400">No phases or milestones defined.</div>
                            )}

                            {phases.length > 0 ? (
                                phases
                                    .slice()
                                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                                    .map((phase) => {
                                        const phaseMilestones = milestones.filter((m) => m.workPhaseId === phase.id);
                                        return (
                                            <div key={phase.id ?? phase.name} className="mb-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className={`text-md font-semibold ${phaseColors[phase.status ?? "pending"]}`}>
                                                            {phase.name} {phase.duration ? <span className="text-xs text-gray-400">• {phase.duration}</span> : null}
                                                        </h4>
                                                        {phase.description && <p className="text-xs text-gray-400 mt-1">{phase.description}</p>}
                                                    </div>
                                                    <div className="text-xs text-gray-400">Milestones: {phaseMilestones.length}</div>
                                                </div>

                                                <ul className="mt-3 space-y-3">
                                                    {phaseMilestones.length === 0 && (
                                                        <li className="text-xs text-gray-500">No milestones for this phase.</li>
                                                    )}

                                                    {phaseMilestones.map((m) => {
                                                        const progress = Math.max(0, Math.min(100, m.progress ?? 0));
                                                        const progressColorClass = getProgressColor(m.status);
                                                        return (
                                                            <li
                                                                key={m.id ?? m.title}
                                                                className="bg-gray-800 p-3 rounded-lg border border-gray-700 text-gray-300"
                                                            >
                                                                <div className="flex items-start justify-between gap-3">
                                                                    <div className="min-w-0">
                                                                        <div className="flex items-center gap-2">
                                                                            <p className="font-semibold truncate">{m.title}</p>
                                                                            <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[m.status ?? "pending"]}`}>
                                                                                {m.status}
                                                                            </span>
                                                                        </div>
                                                                        {m.description && <p className="text-xs text-gray-400 mt-1 truncate">{m.description}</p>}
                                                                        <div className="text-xs text-gray-500 mt-2">
                                                                            <span>Due: {fmtDate(m.dueDate)}</span>
                                                                            <span className="mx-2">|</span>
                                                                            <span>Amount: {effectiveProject.currency ?? "$"}{m.amount ?? 0}</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="text-right text-xs text-gray-400">
                                                                        <div>Progress</div>
                                                                        <div className="text-sm text-gray-200 font-medium">{progress}%</div>
                                                                    </div>
                                                                </div>

                                                                {/* Progress bar with status-based color */}
                                                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden mt-3">
                                                                    <motion.div
                                                                        className={`${progressColorClass} h-full`}
                                                                        style={{ width: `${progress}%` }}
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${progress}%` }}
                                                                        transition={{ duration: 0.6 }}
                                                                        aria-valuenow={progress}
                                                                        aria-valuemin={0}
                                                                        aria-valuemax={100}
                                                                        role="progressbar"
                                                                    />
                                                                </div>

                                                                {/* Acceptance criteria */}
                                                                {m.acceptanceCriteria && (
                                                                    <div className="mt-3 text-xs text-gray-400">
                                                                        <strong>Acceptance:</strong> {m.acceptanceCriteria}
                                                                    </div>
                                                                )}

                                                                {/* Documents for milestone */}
                                                                {m.documents && m.documents.length > 0 && (
                                                                    <div className="mt-3">
                                                                        <div className="text-xs text-gray-400 mb-1">Documents</div>
                                                                        <ul className="space-y-1">
                                                                            {m.documents.map((doc: ProjectDocument) => (
                                                                                <li key={doc.id ?? doc.url}>
                                                                                    <a
                                                                                        href={doc.url}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="text-xs text-red-500 hover:text-white underline"
                                                                                    >
                                                                                        {doc.name} <span className="text-gray-500">• {fmtDate(doc.uploadedAt)}</span>
                                                                                    </a>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        );
                                    })
                            ) : (
                                <div>
                                    <ul className="space-y-3">
                                        {milestones.map((m) => {
                                            const progress = Math.max(0, Math.min(100, m.progress ?? 0));
                                            const progressColorClass = getProgressColor(m.status);
                                            return (
                                                <li key={m.id ?? m.title} className="bg-gray-800 p-3 rounded-lg border border-gray-700 text-gray-300">
                                                    <div className="flex justify-between items-center">
                                                        <p className="font-semibold">{m.title}</p>
                                                        <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[m.status ?? "pending"]}`}>{m.status}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-1">{m.description}</p>
                                                    <div className="text-xs text-gray-500 mt-2">Due: {fmtDate(m.dueDate)} | Amount: {effectiveProject.currency ?? "$"}{m.amount ?? 0}</div>

                                                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden mt-3">
                                                        <motion.div
                                                            className={`${progressColorClass} h-full`}
                                                            style={{ width: `${progress}%` }}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${progress}%` }}
                                                            transition={{ duration: 0.6 }}
                                                            role="progressbar"
                                                            aria-valuenow={progress}
                                                            aria-valuemin={0}
                                                            aria-valuemax={100}
                                                        />
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </section>

                        {/* Documents attached to project (not milestone-specific) */}
                        <section className="mt-6" aria-labelledby="project-docs-heading">
                            <h3 id="project-docs-heading" className="text-lg font-semibold text-white mb-2">Project Documents</h3>
                            {docsFromProject.length === 0 ? (
                                <div className="text-xs text-gray-400">No documents uploaded.</div>
                            ) : (
                                <ul className="space-y-2">
                                    {docsFromProject.map((d) => (
                                        <li key={d.id ?? d.url} className="text-xs">
                                            <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-white underline">
                                                {d.name}
                                            </a>
                                            <span className="ml-2 text-gray-500">• {fmtDate(d.uploadedAt)}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </div>

                    {/* Right column: consultants, escrow, activity */}
                    <aside className="space-y-4">
                        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 text-gray-300">
                            <h4 className="text-sm font-semibold text-white">Assigned Consultants</h4>
                            {effectiveProject.assignedConsultants && effectiveProject.assignedConsultants.length > 0 ? (
                                <ul className="mt-2 space-y-2 text-xs">
                                    {effectiveProject.assignedConsultants.map((c: ProjectConsultant) => (
                                        <li key={c.id} className="flex flex-col">
                                            <div className="font-medium text-gray-200">{c.name} <span className="text-gray-400 text-xs">• {c.role}</span></div>
                                            <div className="text-gray-400 text-xs">Schedule: {c.schedule} • Progress: {c.progress}%</div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-xs text-gray-400 mt-2">No consultants assigned.</div>
                            )}
                        </div>

                        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 text-gray-300">
                            <h4 className="text-sm font-semibold text-white">Escrow Transactions</h4>
                            {effectiveProject.escrow && effectiveProject.escrow.length > 0 ? (
                                <ul className="mt-2 text-xs space-y-2">
                                    {effectiveProject.escrow.map((tx: EscrowTransaction) => (
                                        <li key={tx.id}>
                                            <div className="text-gray-200">{tx.amount} {tx.currency} <span className="text-gray-400">• {tx.status}</span></div>
                                            <div className="text-gray-400 text-xs">Milestone: {tx.milestoneId ?? "N/A"} • {fmtDate((tx as any).createdAt)}</div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-xs text-gray-400 mt-2">No escrow activity.</div>
                            )}
                        </div>

                        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 text-gray-300">
                            <h4 className="text-sm font-semibold text-white">Activity Log</h4>
                            {effectiveProject.activities && effectiveProject.activities.length > 0 ? (
                                <ul className="mt-2 text-xs space-y-2">
                                    {effectiveProject.activities.map((a: ActivityItem) => (
                                        <li key={a.id}>
                                            <div className="text-gray-200">{fmtDate(a.timestamp)} • <span className="font-medium">{a.user}</span></div>
                                            <div className="text-gray-400">{a.action} {a.details ? `— ${a.details}` : ""}</div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-xs text-gray-400 mt-2">No recent activity.</div>
                            )}
                        </div>
                    </aside>
                </div>
            </motion.div>
        </motion.div>
    );
}
