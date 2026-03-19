"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/types/project";
import { mockProjects } from "@/mocks/mockClientProfile";

import PhasesSection from "./project/workPhrases";
import ConsultantsSection from "./project/consultants";
import EscrowSection from "./project/escrow";
import ActivitySection from "./project/activityLog";

interface ProjectModalProps {
    project?: Project | null;
    onClose: () => void;
    premiumUser?: boolean; // add this line (optional) or boolean (required)
}

function fmtDate(d?: string) {
    if (!d) return "N/A";
    try {
        return new Date(d).toLocaleDateString();
    } catch {
        return d;
    }
}
export default function ProjectModal({ project, onClose, premiumUser = false }: ProjectModalProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        containerRef.current?.focus();
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const effectiveProject: Project = project && Object.keys(project).length > 0 ? project : mockProjects[0];
    const isFallback = !(project && Object.keys(project).length > 0);

    return (
        <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
                {isFallback && (
                    <div className="mb-4 px-3 py-2 bg-yellow-600 text-black text-xs rounded">
                        Showing mock project data while the service is unavailable.
                    </div>
                )}

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
                        <button onClick={onClose} aria-label="Close project details" className="px-3 py-2 rounded-md bg-gray-800 text-sm text-gray-200 hover:bg-gray-700 transition">
                            Close
                        </button>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 overflow-y-auto max-h-[65vh] pr-2">
                        <PhasesSection project={effectiveProject} />
                    </div>

                    <aside className="space-y-4">
                        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                            <ConsultantsSection project={effectiveProject} />
                        </div>

                        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                            <EscrowSection project={effectiveProject} />
                        </div>

                        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                            <ActivitySection project={effectiveProject} />
                        </div>
                    </aside>
                </div>
            </motion.div>
        </motion.div>
    );
}
