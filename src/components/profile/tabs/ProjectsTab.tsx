"use client";

import React, { useState } from "react";
import ProjectCard from "@/components/projects/projectCard";
import { Project } from "@/types/project";

interface ProjectsTabProps {
    projects: Project[];
}

export default function ProjectsTab({ projects }: ProjectsTabProps) {
    const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

    const filteredProjects = projects.filter((p) => {
        if (filter === "all") return true;
        if (filter === "active") return p.status !== "completed";
        if (filter === "completed") return p.status === "completed";
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">My Projects</h2>
                <div className="flex gap-2 bg-gray-900 p-1 rounded-lg border border-gray-800">
                    {(["all", "active", "completed"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${filter === f
                                    ? "bg-red-600 text-white shadow-lg"
                                    : "text-gray-400 hover:text-white"
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <ProjectCard key={project._id || project.id} project={project} isRegisteredUser={true} />
                    ))}
                </div>
            ) : (
                <div className="bg-[#1a0d0d] border border-gray-800 rounded-xl p-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto text-3xl">📁</div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-white">No projects found</h3>
                        <p className="text-gray-400 max-w-sm mx-auto">
                            {filter === "all"
                                ? "You don't have any projects assigned to you yet."
                                : `No ${filter} projects found matching your selection.`}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
