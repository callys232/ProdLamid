"use client";

import React from "react";
import type { Project, ActivityItem } from "@/types/project";
import { mockProjects } from "@/mocks/mockClientProfile";

function fmtDate(d?: string) {
    if (!d) return "N/A";
    try {
        return new Date(d).toLocaleString();
    } catch {
        return d;
    }
}

export default function ActivitySection({ project }: { project?: Project | null }) {
    const effectiveProject: Project = project && Object.keys(project).length > 0 ? project : mockProjects[0];
    const activities: ActivityItem[] = effectiveProject.activities ?? [];

    return (
        <div>
            <h4 className="text-sm font-semibold text-white">Activity Log</h4>

            {activities.length === 0 ? (
                <div className="text-xs text-gray-400 mt-2">No recent activity.</div>
            ) : (
                <ul className="mt-2 text-xs space-y-2">
                    {activities.map((a) => (
                        <li key={a.id} className="bg-gray-800 p-2 rounded border border-gray-700">
                            <div className="text-gray-200">{fmtDate(a.timestamp)} • <span className="font-medium">{a.user}</span></div>
                            <div className="text-gray-400">{a.action} {a.details ? `— ${a.details}` : ""}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
