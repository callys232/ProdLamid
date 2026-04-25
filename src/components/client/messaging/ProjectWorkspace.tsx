"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FaProjectDiagram, FaFileInvoiceDollar, FaComments, FaInfoCircle } from "react-icons/fa";

import MilestoneManager from "./MilestoneManager";
import ChatSystem from "./ChatSystem";
import { EscrowCard } from "./escrowCard";
import type { Escrow } from "@/types/escrow";

interface ProjectWorkspaceProps {
    projectId?: string;
}

export default function ProjectWorkspace({ projectId: propId }: ProjectWorkspaceProps = {}) {
    const params = useParams();
    // Prop takes priority; fall back to URL param
    const projectId = propId ?? (params?.id as string) ?? null;

    const [activeTab, setActiveTab] = useState("milestones");
    const [project, setProject] = useState<any>(null);
    const [escrow, setEscrow] = useState<Escrow | null>(null);
    const [loading, setLoading] = useState(!!projectId);

    useEffect(() => {
        if (projectId) {
            setLoading(true);
            fetchProject();
        } else {
            setLoading(false);
        }
    }, [projectId]);

    const fetchProject = async () => {
        try {
            const res = await fetch(`/api/projects/${projectId}`);
            if (!res.ok) throw new Error("Failed to fetch project");
            const { data: proj } = await res.json();
            setProject(proj);
            setEscrow({
                id: proj._id,
                balance: proj.budget ?? 0,
                status: proj.escrowStatus ?? "pending",
                milestones: proj.milestones ?? [],
                projectName: proj.title,
                projectFund: proj.budget,
                teamNumber: proj.teamId ?? proj.team,
                projectDuration: proj.duration,
                milestone: proj.milestones?.[0]?.title,
                disputeReason: proj.disputeReason,
            });
        } catch (error) {
            console.error("Error fetching project:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#050000] text-white">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                    <p className="text-sm text-gray-500">Loading workspace...</p>
                </div>
            </div>
        );
    }

    if (!projectId) {
        return (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-3 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
                    <FaProjectDiagram className="h-6 w-6 text-gray-500" />
                </div>
                <p className="text-sm font-medium text-gray-400">No project selected</p>
                <p className="text-xs text-gray-600">
                    Open a project from your Projects tab to view its workspace.
                </p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex h-full min-h-[400px] items-center justify-center text-sm text-gray-500">
                Project not found.
            </div>
        );
    }

    const tabs = [
        { id: "milestones", label: "Milestones", icon: <FaProjectDiagram /> },
        { id: "escrow", label: "Escrow & Payments", icon: <FaFileInvoiceDollar /> },
        { id: "chat", label: "Messages", icon: <FaComments /> },
        { id: "details", label: "Project Info", icon: <FaInfoCircle /> },
    ];

    return (
        <div className="min-h-screen bg-[#050000] text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-[#c21219]/30 pb-6 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">{project.title}</h1>
                        <p className="mt-1 text-gray-400">
                            Status:{" "}
                            <span className="font-semibold uppercase text-red-500">
                                {project.status}
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/5 p-3">
                        <div className="text-right">
                            <p className="text-xs uppercase text-gray-400">Budget</p>
                            <p className="text-xl font-bold text-green-500">
                                ${project.budget?.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 whitespace-nowrap rounded-full px-6 py-3 transition-all ${activeTab === tab.id
                                    ? "bg-red-600 text-white shadow-lg shadow-red-900/40"
                                    : "border border-white/5 bg-white/5 text-gray-400 hover:bg-white/10"
                                }`}
                        >
                            {tab.icon}
                            <span className="font-medium">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="min-h-[500px] rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8"
                >
                    {activeTab === "milestones" && (
                        <MilestoneManager projectId={projectId as string} />
                    )}

                    {activeTab === "escrow" && (
                        escrow ? (
                            <div className="flex justify-center">
                                <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-white/10">
                                    <EscrowCard escrow={escrow} />
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No escrow data for this project.</p>
                        )
                    )}

                    {activeTab === "chat" && (
                        <ChatSystem projectId={projectId as string} />
                    )}

                    {activeTab === "details" && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="mb-2 text-xl font-bold">Description</h3>
                                <p className="leading-relaxed text-gray-300">{project.description}</p>
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                                    <h4 className="mb-2 text-sm uppercase tracking-widest text-gray-400">
                                        Skills Required
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {project.skills?.map((skill: string) => (
                                            <span
                                                key={skill}
                                                className="rounded-full bg-red-900/30 px-3 py-1 text-xs font-semibold text-red-400"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                                    <h4 className="mb-2 text-sm uppercase tracking-widest text-gray-400">
                                        Category
                                    </h4>
                                    <p className="font-medium text-white">{project.category}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
