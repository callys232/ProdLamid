"use client";

import { motion } from "framer-motion";
import { Project, Milestone, WorkPhase, ProjectDocument } from "@/types/project";

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

export default function ProjectModal({
    project,
    onClose,
    premiumUser,
}: {
    project: Project;
    onClose: () => void;
    premiumUser: boolean;
}) {
    return (
        <motion.div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <motion.div
                className="bg-gray-900 rounded-xl p-6 w-full max-w-4xl shadow-lg border border-red-600 overflow-y-auto max-h-[90vh]"
                initial={{ y: 50 }}
                animate={{ y: 0 }}
            >
                {/* Header */}
                <h2 className="text-xl font-bold text-white mb-2">{project.title}</h2>
                <p className="text-sm text-gray-400 mb-4">{project.description}</p>

                {/* Overview */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 mb-6">
                    <p><strong>Category:</strong> {project.category}</p>
                    <p><strong>Budget:</strong> ${project.budget || 0}</p>
                    <p><strong>Deadline:</strong> {project.deadline || "N/A"}</p>
                    <p><strong>Purpose:</strong> {project.purpose || "N/A"}</p>
                    {project.suggestedBidRange && (
                        <p><strong>Suggested Range:</strong> ${project.suggestedBidRange.min} – ${project.suggestedBidRange.max}</p>
                    )}
                </div>

                {/* Work Phases & Milestones */}
                <h3 className="text-lg text-white mb-2">Work Phases</h3>
                {project.workPhases?.map((phase: WorkPhase) => (
                    <div key={phase.id} className="mb-4">
                        <h4 className={`text-md font-semibold ${phaseColors[phase.status || "pending"]}`}>
                            {phase.name} ({phase.duration})
                        </h4>
                        <p className="text-xs text-gray-400">{phase.description}</p>

                        <ul className="space-y-2 mt-2">
                            {project.milestones
                                ?.filter((m) => m.workPhaseId === phase.id)
                                .map((m: Milestone) => (
                                    <li
                                        key={m.id}
                                        className="bg-gray-800 p-3 rounded-lg border border-gray-700 text-gray-300"
                                    >
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold">{m.title}</p>
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-xs ${statusColors[m.status || "pending"]}`}
                                            >
                                                {m.status}
                                            </span>
                                        </div>
                                        <p className="text-xs">{m.description}</p>
                                        <p className="text-xs text-gray-500">
                                            Due: {m.dueDate || "N/A"} | Amount: ${m.amount || 0}
                                        </p>
                                        {m.progress !== undefined && (
                                            <div className="h-1 bg-gray-700 rounded-full overflow-hidden mt-1">
                                                <motion.div
                                                    className="bg-blue-500 h-full"
                                                    style={{ width: `${m.progress}%` }}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${m.progress}%` }}
                                                    transition={{ duration: 0.6 }}
                                                />
                                            </div>
                                        )}
                                        {/* Documents */}
                                        {m.documents?.map((doc: ProjectDocument) => (
                                            <a
                                                key={doc.url}
                                                href={doc.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block mt-2 text-red-500 hover:text-white underline text-xs"
                                            >
                                                {doc.name}
                                            </a>
                                        ))}
                                    </li>
                                ))}
                        </ul>
                    </div>
                ))}

                {/* Consultants */}
                <h3 className="text-lg text-white mt-4 mb-2">Assigned Consultants</h3>
                {project.assignedConsultants?.map((c) => (
                    <div
                        key={c.id}
                        className="bg-gray-800 p-3 rounded-lg border border-gray-700 text-gray-300 mb-2"
                    >
                        <p className="font-semibold">{c.name} ({c.role})</p>
                        <p className="text-xs">Schedule: {c.schedule} | Progress: {c.progress}%</p>
                    </div>
                ))}

                {/* Escrow */}
                <h3 className="text-lg text-white mt-4 mb-2">Escrow Transactions</h3>
                {project.escrow?.map((tx) => (
                    <div key={tx.id} className="text-xs text-gray-400 mb-1">
                        {tx.amount} {tx.currency} – {tx.status} (Milestone: {tx.milestoneId || "N/A"})
                    </div>
                ))}

                {/* Activity Log */}
                <h3 className="text-lg text-white mt-4 mb-2">Activity Log</h3>
                {project.activities?.map((a) => (
                    <div key={a.id} className="text-xs text-gray-400 mb-1">
                        {a.timestamp}: {a.user} {a.action} – {a.details}
                    </div>
                ))}

                {/* Close */}
                <button
                    onClick={onClose}
                    className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                    Close
                </button>
            </motion.div>
        </motion.div>
    );
}
