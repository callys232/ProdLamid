"use client";

import React from "react";
import { motion } from "framer-motion";
import { Project, Milestone } from "@/types/project";

type Props = {
    project: Project;
    onClick?: () => void;
    compact?: boolean;
};

export default function ProjectCard({ project, onClick, compact = false }: Props) {
    const milestones: Milestone[] = project.milestones ?? [];

    const completionRate =
        milestones.length > 0
            ? Math.round(
                milestones.reduce((acc, m) => acc + (m.progress ?? 0), 0) /
                milestones.length
            )
            : 0;

    const currentMilestone = project.currentMilestoneId
        ? milestones.find((m) => m.id === project.currentMilestoneId) ?? null
        : null;

    const paidMilestones = milestones.filter(
        (m) => m.status === "released" || m.status === "completed"
    ).length;

    const totalPaid =
        project.escrow
            ?.filter((tx) => tx.status === "released" || tx.status === "completed")
            .reduce((sum, tx) => sum + (tx.amount ?? 0), 0) ?? 0;

    const consultants = project.assignedConsultants ?? [];

    const completedMilestones = milestones.filter(
        (m) => m.status === "completed"
    ).length;

    const pendingMilestones = milestones.length - completedMilestones;

    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            className="group relative bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-red-500 overflow-hidden"
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onClick?.();
            }}
        >
            {/* Base Card */}
            <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                    <h4 className="text-white font-semibold text-sm truncate">
                        {project.title}
                    </h4>
                    <p className="text-xs text-gray-400 truncate">
                        {project.category} • {project.purpose}
                    </p>
                </div>

                <div className="text-xs text-gray-400">{completionRate}%</div>
            </div>

            {/* Progress */}
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden mt-3">
                <motion.div
                    className="bg-red-600 h-full"
                    style={{ width: `${completionRate}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ duration: 0.6 }}
                />
            </div>

            {!compact && (
                <div className="flex items-center justify-between text-xs text-gray-300 mt-2">
                    <div>
                        Milestones:{" "}
                        <span className="text-gray-200 font-medium">{milestones.length}</span>
                    </div>
                    <div>
                        Paid:{" "}
                        <span className="text-gray-200 font-medium">{paidMilestones}</span>
                    </div>
                </div>
            )}

            {/* Consultants */}
            {consultants.length > 0 && !compact && (
                <div className="mt-3 flex items-center gap-2">
                    <div className="text-xs text-gray-400">Consultants:</div>

                    <div className="flex -space-x-2">
                        {consultants.slice(0, 4).map((c, i) => (
                            <div
                                key={c.id ?? `${c.name}-${i}`}
                                className="w-7 h-7 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center text-xs text-white"
                                title={c.name}
                            >
                                {c.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .slice(0, 2)
                                    .join("")}
                            </div>
                        ))}

                        {consultants.length > 4 && (
                            <div className="w-7 h-7 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center text-xs text-gray-300">
                                +{consultants.length - 4}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Hover Overlay */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm p-4 opacity-0 group-hover:opacity-100 flex flex-col justify-center text-xs"
            >
                <div className="space-y-2 text-gray-300">

                    <div className="flex justify-between">
                        <span>Total Budget</span>
                        <span className="text-white font-medium">
                            ${project.budget ?? "N/A"}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>Total Paid</span>
                        <span className="text-white font-medium">${totalPaid}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Completed Milestones</span>
                        <span className="text-white font-medium">
                            {completedMilestones}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>Pending</span>
                        <span className="text-white font-medium">{pendingMilestones}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <span>Current Milestone</span>
                        <span className="text-white font-medium">
                            {currentMilestone?.title ?? "None"}
                        </span>
                    </div>

                    <div className="pt-4">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `/projects/${project._id || project.id}/workspace`;
                            }}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-bold transition-all"
                        >
                            Go to Workspace
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}