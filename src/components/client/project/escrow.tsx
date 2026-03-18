"use client";

import React from "react";
import type { Project, EscrowTransaction } from "@/types/project";
import { mockProjects } from "@/mocks/mockClientProfile";

function fmtDate(d?: string) {
    if (!d) return "N/A";
    try {
        return new Date(d).toLocaleDateString();
    } catch {
        return d;
    }
}

export default function EscrowSection({ project }: { project?: Project | null }) {
    const effectiveProject: Project = project && Object.keys(project).length > 0 ? project : mockProjects[0];
    const escrow: EscrowTransaction[] = effectiveProject.escrow ?? [];

    return (
        <div>
            <h4 className="text-sm font-semibold text-white">Escrow Transactions</h4>

            {escrow.length === 0 ? (
                <div className="text-xs text-gray-400 mt-2">No escrow activity.</div>
            ) : (
                <ul className="mt-2 text-xs space-y-2">
                    {escrow.map((tx) => (
                        <li key={tx.id} className="bg-gray-800 p-2 rounded border border-gray-700">
                            <div className="text-gray-200">
                                {tx.amount} {tx.currency ?? ""} <span className="text-gray-400">• {tx.status}</span>
                            </div>
                            <div className="text-gray-400 text-xs">
                                Milestone: {tx.milestoneId ?? "N/A"} • {fmtDate((tx as any).createdAt)}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
