"use client";

import { Project } from "@/types/project";
import { motion } from "framer-motion";

function getProgressColor(status?: string) {

    if (!status) return "bg-red-500";

    const s = status.toLowerCase();

    if (s === "completed") return "bg-green-500";
    if (s === "pending") return "bg-orange-500";
    if (s === "in_progress") return "bg-blue-500";

    return "bg-gray-500";
}

export default function MilestonesSection({
    project,
    phaseId,
}: {
    project: Project;
    phaseId?: string;
}) {

    const milestones =
        (project.milestones ?? []).filter(
            (m) => m.workPhaseId === phaseId
        );

    if (!milestones.length)
        return <p className="text-xs text-neutral-400 mt-2">No milestones.</p>;

    return (
        <ul className="mt-4 space-y-3">

            {milestones.map((m) => {

                const progress = Math.max(0, Math.min(100, m.progress ?? 0));
                const color = getProgressColor(m.status);

                return (
                    <motion.li
                        key={m.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 hover:border-blue-500 transition"
                    >

                        <div className="flex justify-between items-center">

                            <p className="text-white font-medium">{m.title}</p>

                            <span className="text-xs text-neutral-400">
                                {m.status}
                            </span>

                        </div>

                        <div className="h-2 bg-neutral-700 rounded-full overflow-hidden mt-3">
                            <motion.div
                                className={`${color} h-full`}
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>

                    </motion.li>
                );
            })}

        </ul>
    );
}
