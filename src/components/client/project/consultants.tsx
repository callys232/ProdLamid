"use client";

import React from "react";
import type { Project, ProjectConsultant } from "@/types/project";
import { mockProjects } from "@/mocks/mockClientProfile";

function fmtDate(d?: string) {
    if (!d) return "N/A";
    try {
        return new Date(d).toLocaleDateString();
    } catch {
        return d;
    }
}

export default function ConsultantsSection({ project }: { project?: Project | null }) {
    const effectiveProject: Project = project && Object.keys(project).length > 0 ? project : mockProjects[0];
    const consultants: ProjectConsultant[] = effectiveProject.assignedConsultants ?? [];

    return (
        <div>
            <h4 className="text-sm font-semibold text-white">Assigned Consultants</h4>

            {consultants.length === 0 ? (
                <div className="text-xs text-gray-400 mt-2">No consultants assigned.</div>
            ) : (
                <ul className="mt-2 space-y-2 text-xs">
                    {consultants.map((c) => (
                        <li key={c.id} className="flex flex-col bg-gray-800 p-2 rounded border border-gray-700">
                            <div className="font-medium text-gray-200">
                                {c.name} <span className="text-gray-400 text-xs">• {c.role}</span>
                            </div>
                            <div className="text-gray-400 text-xs">
                                {c.industry ? `${c.industry} • ` : ""}
                                {c.delivery ? `${c.delivery} • ` : ""}
                                Rate: {c.rate ?? "—"} • Rating: {c.rating ?? "—"}
                            </div>
                            <div className="text-gray-400 text-xs mt-1">
                                Schedule: {c.schedule ?? "—"} • Progress: {Math.max(0, Math.min(100, c.progress ?? 0))}%
                            </div>
                            {c.reminders && c.reminders.length > 0 && (
                                <div className="text-xs text-gray-500 mt-1">
                                    Reminder: {c.reminders[0].message} • {fmtDate(c.reminders[0].date)}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
