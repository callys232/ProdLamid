"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Project, Milestone } from "@/types/project";
import ProjectModal from "./projectModal";
import { mockClient } from "@/mocks/mockClientProfile"; // ✅ import fallback

/* ---------------- Button ---------------- */
const Button = ({ children, onClick, variant = "default" }: any) => {
    const base =
        "px-3 py-2 rounded-md font-medium text-sm transition-all flex items-center gap-2";
    const styles =
        variant === "outline"
            ? "bg-transparent border border-gray-600 text-white hover:bg-gray-700"
            : "bg-red-600 text-white hover:bg-red-500";
    return (
        <button onClick={onClick} className={`${base} ${styles}`}>
            {children}
        </button>
    );
};

/* ---------------- Project Card ---------------- */
const ProjectCard = ({
    project,
    onClick,
}: {
    project: Project;
    onClick: () => void;
}) => {
    const milestones: Milestone[] = project.milestones ?? [];
    const completionRate =
        milestones.length > 0
            ? Math.round(
                milestones.reduce((acc, m) => acc + (m.progress ?? 0), 0) /
                milestones.length
            )
            : 0;

    const currentMilestone = project.currentMilestoneId
        ? milestones.find((m) => m.id === project.currentMilestoneId)
        : null;

    const paidMilestones = milestones.filter(
        (m) => m.status === "released" || m.status === "completed"
    ).length;
    const totalPaid =
        project.escrow
            ?.filter((tx) => tx.status === "released" || tx.status === "completed")
            .reduce((sum, tx) => sum + tx.amount, 0) || 0;

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-red-500"
            onClick={onClick}
        >
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-white font-semibold text-sm">{project.title}</h4>
                <span className="text-xs text-gray-400">{completionRate}% Complete</span>
            </div>

            <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
                <motion.div
                    className="bg-red-600 h-full"
                    style={{ width: `${completionRate}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ duration: 0.6 }}
                />
            </div>

            <p className="text-xs text-gray-400">Milestones: {milestones.length}</p>

            {/* Hover Info */}
            <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="mt-2 text-xs text-gray-300"
            >
                <p>Current Milestone: {currentMilestone?.title || "None"}</p>
                <p>Paid Milestones: {paidMilestones}</p>
                <p>Total Payments Made: ${totalPaid}</p>
            </motion.div>
        </motion.div>
    );
};

/* ---------------- Main Component ---------------- */
export default function ProjectsTab({ client }: { client: any }) {
    const [selectedType, setSelectedType] = useState<"team" | "individual" | null>(
        null
    );
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // ✅ Fallback to mockClient if db fails
    const safeClient = client ?? mockClient;

    const projects: Project[] =
        selectedType === "team"
            ? safeClient.teamMembers?.flatMap((m: any) => m.projects ?? []) ?? []
            : selectedType === "individual"
                ? safeClient.consultants?.flatMap((c: any) => c.projects ?? []) ?? []
                : [];

    return (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-red-600">
            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
                {["team", "individual"].map((type) => (
                    <Button
                        key={type}
                        onClick={() =>
                            setSelectedType(selectedType === type ? null : (type as "team" | "individual"))
                        }
                        variant={selectedType === type ? "default" : "outline"}
                    >
                        {type === "team" ? "Teams" : "Individuals"}
                        <ChevronDown size={14} />
                    </Button>
                ))}
            </div>

            {/* Projects */}
            <AnimatePresence>
                {selectedType && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-4"
                    >
                        {projects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {projects.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        onClick={() => setSelectedProject(project)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">
                                No {selectedType} projects available.
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal */}
            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                    premiumUser={true} // ✅ pass premium flag for alerts
                />
            )}
        </div>
    );
}
