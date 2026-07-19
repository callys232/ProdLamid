"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Project, WorkPhase, Milestone } from "@/types/project";
import type { ProjectDocument } from "@/types/projectPosting";
import { mockProjects } from "@/mocks/mockClientProfile";

const STATUS_COLORS: Record<string, string> = {
    pending: "bg-gray-500",
    in_progress: "bg-blue-500",
    funded: "bg-yellow-500",
    released: "bg-green-500",
    completed: "bg-green-700",
    cancelled: "bg-orange-500",
    disputed: "bg-blue-600",
};

const PHASE_COLORS: Record<string, string> = {
    pending: "text-gray-400",
    active: "text-blue-500",
    completed: "text-green-500",
};

function getProgressColor(status?: string) {
    if (!status) return "bg-blue-500";
    const s = String(status).toLowerCase();
    if (s === "completed") return "bg-green-500";
    if (s === "pending") return "bg-orange-500";
    if (s === "in_progress") return "bg-blue-500";
    if (s === "funded" || s === "released") return "bg-green-500";
    if (s === "disputed" || s === "under_review") return "bg-yellow-400";
    return "bg-blue-500";
}

function fmtDate(d?: string) {
    if (!d) return "N/A";
    try {
        return new Date(d).toLocaleDateString();
    } catch {
        return d;
    }
}

export default function PhasesSection({ project }: { project?: Project | null }) {
    const effectiveProject: Project = project && Object.keys(project).length > 0 ? project : mockProjects[0];
    const phases: WorkPhase[] = effectiveProject.workPhases ?? [];
    const milestones: Milestone[] = effectiveProject.milestones ?? [];

    // --- SAFE docs collection (fixed)
    const milestoneDocs: ProjectDocument[] =
        (effectiveProject.milestones ?? []).flatMap((m) => m.documents ?? []);

    const projectLevelDocsRaw = (effectiveProject as any).documents ?? [];
    const projectLevelDocs: ProjectDocument[] = Array.isArray(projectLevelDocsRaw) ? projectLevelDocsRaw : [];

    const docsFromProject: ProjectDocument[] = [...milestoneDocs, ...projectLevelDocs];
    // --- end safe docs collection

    return (
        <div>
            <section aria-labelledby="phases-heading">
                <h3 id="phases-heading" className="text-lg font-semibold text-white mb-3">
                    Work Phases & Milestones
                </h3>

                {phases.length === 0 ? (
                    <div className="text-xs text-gray-400">No work phases defined.</div>
                ) : (
                    phases
                        .slice()
                        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                        .map((phase) => {
                            const phaseId = String(phase.id ?? "").trim();
                            const phaseMilestones = milestones.filter((m) => String(m.workPhaseId ?? "").trim() === phaseId);

                            return (
                                <div
                                    key={phase.id ?? phase.name}
                                    className="mb-4 bg-gray-900 border border-gray-700 rounded-xl p-4 hover:shadow-lg transition"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className={`text-md font-semibold ${PHASE_COLORS[phase.status ?? "pending"]}`}>
                                                {phase.name}
                                                {phase.duration ? <span className="text-xs text-gray-400 ml-2">• {phase.duration}</span> : null}
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
                                                                <span
                                                                    className={`px-2 py-0.5 rounded-full text-xs ${STATUS_COLORS[String(m.status ?? "pending")]}`}
                                                                    title={`Status: ${m.status}`}
                                                                >
                                                                    {m.status}
                                                                </span>
                                                            </div>

                                                            {m.description && <p className="text-xs text-gray-400 mt-1 truncate">{m.description}</p>}

                                                            <div className="text-xs text-gray-500 mt-2">
                                                                <span>Due: {fmtDate(m.dueDate)}</span>
                                                                <span className="mx-2">|</span>
                                                                <span>
                                                                    Amount: {effectiveProject.currency ?? "$"}
                                                                    {m.amount ?? 0}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="text-right text-xs text-gray-400">
                                                            <div>Progress</div>
                                                            <div className="text-sm text-gray-200 font-medium">{progress}%</div>
                                                        </div>
                                                    </div>

                                                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden mt-3">
                                                        <motion.div
                                                            className={`${progressColorClass} h-full`}
                                                            style={{ width: `${progress}%` }}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${progress}%` }}
                                                            transition={{ duration: 0.6, ease: "easeInOut" }}
                                                            role="progressbar"
                                                            aria-valuenow={progress}
                                                            aria-valuemin={0}
                                                            aria-valuemax={100}
                                                        />
                                                    </div>

                                                    {m.acceptanceCriteria && (
                                                        <div className="mt-3 text-xs text-gray-400">
                                                            <strong>Acceptance:</strong> {m.acceptanceCriteria}
                                                        </div>
                                                    )}

                                                    {m.documents && m.documents.length > 0 && (
                                                        <div className="mt-3">
                                                            <div className="text-xs text-gray-400 mb-1">Documents</div>
                                                            <ul className="space-y-1">
                                                                {m.documents.map((doc) => (
                                                                    <li key={doc.id ?? doc.url}>
                                                                        <a
                                                                            href={doc.url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-xs text-blue-500 hover:text-white underline"
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
                )}
            </section>

            <section className="mt-6" aria-labelledby="project-docs-heading">
                <h3 id="project-docs-heading" className="text-lg font-semibold text-white mb-2">
                    Project Documents
                </h3>
                {docsFromProject.length === 0 ? (
                    <div className="text-xs text-gray-400">No documents uploaded.</div>
                ) : (
                    <ul className="space-y-2">
                        {docsFromProject.map((d) => (
                            <li key={d.id ?? d.url} className="text-xs">
                                <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-white underline">
                                    {d.name}
                                </a>
                                <span className="ml-2 text-gray-500">• {fmtDate(d.uploadedAt)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
