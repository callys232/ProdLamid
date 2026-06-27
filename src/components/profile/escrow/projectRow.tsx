"use client";

import React, { useState } from "react";
import { Project } from "@/types/project";
import type { EscrowTransaction } from "@/types/escrow";

type ActionType = "release" | "refund" | "dispute";

interface ProjectRowProps {
    project: Project;
    heldAmount: number;
    currency: string;
    onOpen?: () => void;
    onAction: (type: ActionType, tx?: EscrowTransaction | null) => void;
}

export default function ProjectRow({ project, heldAmount, currency, onOpen, onAction }: ProjectRowProps) {
    const [expanded, setExpanded] = useState(false);

    const statusColor = project.status === "in_progress" ? "border-l-4 border-yellow-500" : project.status === "pending" ? "border-l-4 border-blue-500" : "border-l-4 border-green-500";

    return (
        <div className={`bg-gray-800 ${statusColor} rounded-md p-3 hover:bg-gray-750 transition`} role="group" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") setExpanded((s) => !s); }}>
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <div className="text-sm text-white font-semibold truncate">{project.title}</div>
                    <div className="text-xs text-gray-400">{project.id} • {project.category} • <span className="text-gray-300">{project.status}</span></div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-200 font-medium">{heldAmount} {currency}</div>
                    <button onClick={() => { setExpanded(!expanded); onOpen?.(); }} className="px-2 py-1 rounded-md bg-gray-900 text-xs text-gray-200">Details</button>
                    <div className="flex gap-2">
                        <button onClick={() => onAction("release", undefined)} className="px-2 py-1 rounded-md bg-green-600 text-xs text-white">Release</button>
                        <button onClick={() => onAction("refund", undefined)} className="px-2 py-1 rounded-md bg-yellow-700 text-xs text-white">Refund</button>
                    </div>
                </div>
            </div>

            {expanded && (
                <div className="mt-3 bg-gray-850 p-3 rounded-md border border-gray-700">
                    <div className="text-xs text-gray-300 mb-2">Milestones</div>
                    {project.milestones?.length ? (
                        project.milestones.map((m: any) => (
                            <div key={m.id} className="flex items-center justify-between text-xs text-gray-300 py-1">
                                <div className="truncate">{m.title} <span className="text-gray-400">• {m.dueDate ?? "no due date"}</span></div>
                                <div className="text-right">
                                    <div className="font-medium text-gray-200">{m.amount ?? "—"}</div>
                                    <div className="text-xs text-gray-400">{m.status}</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-xs text-gray-500">No milestones</div>
                    )}
                </div>
            )}
        </div>
    );
}
