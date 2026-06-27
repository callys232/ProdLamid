"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import SectionWrapper from "./wrapper";
import PremiumCard from "./card";
import UploadZone from "./upload";

type Project = {
    id: number;
    title: string;
    status: string;
    type: "team" | "individual";
    dueDate?: string;
    docUrl?: string;
};

const projectsMock: Project[] = [
    { id: 1, title: "Website Redesign", status: "In Progress", type: "team", dueDate: "2026-04-01" },
    { id: 2, title: "Mobile App Launch", status: "Pending", type: "individual", dueDate: "2026-05-15" },
];

interface ProjectsSectionProps {
    projects?: any[];
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects: initialProjects }) => {
    const [projects, setProjects] = useState<Project[]>(() => {
        if (initialProjects && initialProjects.length > 0) {
            return initialProjects.map((p) => ({
                id: p._id || p.id,
                title: p.title || "Untitled Project",
                status: p.status || "Pending",
                type: p.type === 1 ? "individual" : "team",
                dueDate: p.deadline || p.dueDate,
                docUrl: p.docUrl
            }));
        }
        return projectsMock;
    });
    const [selectedType, setSelectedType] = useState<"team" | "individual" | null>(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = (file: File) => {
        setLoading(true);
        setTimeout(() => {
            const newProject: Project = {
                id: projects.length + 1,
                title: file.name,
                status: "Uploaded",
                type: "team",
                docUrl: URL.createObjectURL(file),
            };
            setProjects([...projects, newProject]);
            setLoading(false);
        }, 1000);
    };

    const filteredProjects = selectedType
        ? projects.filter((p) => p.type === selectedType)
        : projects;

    return (
        <SectionWrapper title="Projects">
            {/* Filters */}
            <motion.div
                data-guide="client-project-display"
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 flex flex-col shadow-xl border border-red-600"
            >
                <div
                    data-guide="client-project-filters"
                    className="flex gap-2 flex-wrap mb-6"
                >
                    {["team", "individual"].map((type) => (
                        <button
                            key={type}
                            onClick={() =>
                                setSelectedType(
                                    selectedType === type ? null : (type as "team" | "individual")
                                )
                            }
                            className={`rounded-full px-4 py-2 flex items-center gap-1 transition-colors duration-300 ${selectedType === type
                                ? "bg-[#c12129] text-white"
                                : "border border-gray-600 text-gray-300 hover:bg-gray-700"
                                }`}
                        >
                            {type === "team" ? "Teams" : "Individuals"}
                            <ChevronDown size={14} />
                        </button>
                    ))}
                </div>

                {/* Upload */}
                <UploadZone
                    label="Upload a project plan (PDF, DOCX)"
                    accept=".pdf,.doc,.docx"
                    onUpload={handleUpload}
                />

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {loading && <div className="animate-pulse bg-gray-800 h-40 rounded-lg" />}
                    {filteredProjects.map((proj) => (
                        <PremiumCard key={proj.id} {...proj} type="doc" projectId={proj.id} />
                    ))}
                </div>
            </motion.div>
        </SectionWrapper>
    );
};

export default ProjectsSection;
