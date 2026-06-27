"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { Project } from "@/types/project";
import { ClientProfile } from "@/types/client";

import ProjectModal from "./projectModal";
import ProjectCard from "./cardProject";

import { mockClient } from "@/mocks/mockClientProfile";

type ButtonProps = {
    children: React.ReactNode;
    onClick: () => void;
    variant?: "default" | "outline";
};

const Button = ({ children, onClick, variant = "default" }: ButtonProps) => {
    const base =
        "px-3 py-2 rounded-md font-medium text-sm transition-all flex items-center gap-2";
    const styles =
        variant === "outline"
            ? "bg-transparent border border-gray-600 text-white hover:bg-gray-700"
            : "bg-red-600 text-white hover:bg-red-500";

    return (
        <button onClick={onClick} className={`${base} ${styles}`}>
            {children}
            <ChevronDown size={14} />
        </button>
    );
};

export default function ProjectsTab({ client }: { client?: ClientProfile }) {
    const [selectedType, setSelectedType] = useState<"team" | "individual" | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const safeClient: ClientProfile = client ?? mockClient;

    const projects: Project[] = useMemo(() => {
        const raw: Project[] =
            selectedType === "team"
                ? safeClient.teamMembers?.flatMap((t) => t.projects ?? []) ?? []
                : selectedType === "individual"
                    ? safeClient.consultants?.flatMap((c) => c.projects ?? []) ?? []
                    : [];

        const map = new Map<string, Project>();
        raw.forEach((p) => {
            if (p && p.id) map.set(p.id, p);
        });
        return Array.from(map.values());
    }, [selectedType, safeClient]);



    return (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-red-600">
            <div className="flex gap-2 flex-wrap mb-4">
                {(["team", "individual"] as const).map((type) => (
                    <Button
                        key={type}
                        onClick={() => setSelectedType(selectedType === type ? null : type)}
                        variant={selectedType === type ? "default" : "outline"}
                    >
                        {type === "team" ? "Teams" : "Individuals"}
                    </Button>
                ))}
            </div>

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
                            <p className="text-gray-400 text-sm">No {selectedType} projects available.</p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                    premiumUser={safeClient.isPremium ?? false}
                />
            )}
        </div>
    );
}
