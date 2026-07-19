"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import MilestoneManager from "./MilestoneManager";
import EscrowManager from "./EscrowManager";
import ChatSystem from "./ChatSystem";
import LeaveReview from "@/components/review/LeaveReview";
import { FaProjectDiagram, FaFileInvoiceDollar, FaComments, FaInfoCircle, FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ProjectWorkspace() {
    const { id: projectId } = useParams();
    const [activeTab, setActiveTab]     = useState("milestones");
    const [project,   setProject]       = useState<any>(null);
    const [loading,   setLoading]       = useState(true);
    const [completing, setCompleting]   = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/auth/me").then(r => r.json()).then(d => {
            if (d.success) setCurrentUserId(d.data._id ?? d.data.id ?? null);
        }).catch(() => {});
    }, []);

    useEffect(() => {
        if (projectId) {
            fetchProject();
        }
    }, [projectId]);

    const fetchProject = async () => {
        try {
            const res = await fetch(`/api/projects/${projectId}`);
            const data = await res.json();
            if (res.ok) {
                setProject(data.data);
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen text-white">Loading Workspace...</div>;
    if (!project) return <div className="flex justify-center items-center h-screen text-white">Project not found</div>;

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
                <div className="mb-8 border-b border-[#2563EB]/30 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">{project.title}</h1>
                        <p className="text-gray-400 mt-1">Status: <span className="text-blue-500 font-semibold uppercase">{project.status}</span></p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-4 bg-white/5 p-3 rounded-lg border border-white/10">
                            <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase">Budget</p>
                                <p className="text-xl font-bold text-green-500">${project.budget?.toLocaleString()}</p>
                            </div>
                        </div>
                        {/* Mark Complete — only shown to owner when project is ongoing */}
                        {project.status === "ongoing" && currentUserId && String(project.ownerId) === currentUserId && (
                            <motion.button
                                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                disabled={completing}
                                onClick={async () => {
                                    setCompleting(true);
                                    try {
                                        const res = await fetch(`/api/projects/${projectId}/complete`, { method: "POST" });
                                        const d   = await res.json();
                                        if (!res.ok) throw new Error(d.error ?? d.message);
                                        toast.success("Project marked as complete!");
                                        setProject((p: any) => ({ ...p, status: "completed" }));
                                    } catch (e: any) {
                                        toast.error(e.message || "Failed to complete project");
                                    } finally {
                                        setCompleting(false);
                                    }
                                }}
                                className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-700 disabled:opacity-50"
                            >
                                <FaCheckCircle />
                                {completing ? "Completing…" : "Mark Complete"}
                            </motion.button>
                        )}
                        {project.status === "completed" && (
                            <span className="flex items-center gap-1.5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-sm font-semibold text-green-400">
                                <FaCheckCircle /> Completed
                            </span>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto gap-2 mb-8 no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all whitespace-nowrap ${
                                activeTab === tab.id
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                                    : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5"
                            }`}
                        >
                            {tab.icon}
                            <span className="font-medium">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 min-h-[500px]"
                >
                    {activeTab === "milestones" && <MilestoneManager projectId={projectId as string} />}
                    {activeTab === "escrow" && <EscrowManager projectId={projectId as string} />}
                    {activeTab === "chat" && <ChatSystem projectId={projectId as string} />}
                    {activeTab === "details" && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold mb-2">Description</h3>
                                <p className="text-gray-300 leading-relaxed">{project.description}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <h4 className="text-sm text-gray-400 mb-2 uppercase">Skills Required</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {project.skills?.map((skill: string) => (
                                            <span key={skill} className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <h4 className="text-sm text-gray-400 mb-2 uppercase">Category</h4>
                                    <p className="text-white font-medium">{project.category}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Leave review section — shown when project is completed */}
                {project.status === "completed" && currentUserId && (
                    <div className="mt-8 space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                            Rate your experience
                        </h3>
                        {/* Client rates each consultant */}
                        {String(project.ownerId) === currentUserId && project.consultants?.map((cId: any) => {
                            const id = cId?._id ?? cId;
                            return (
                                <LeaveReview
                                    key={String(id)}
                                    projectId={String(projectId)}
                                    revieweeId={String(id)}
                                    revieweeName="Consultant"
                                    role="consultant"
                                />
                            );
                        })}
                        {/* Consultant rates the client */}
                        {project.consultants?.some((c: any) => String(c?._id ?? c) === currentUserId) && (
                            <LeaveReview
                                projectId={String(projectId)}
                                revieweeId={String(project.ownerId?._id ?? project.ownerId)}
                                revieweeName="Client"
                                role="client"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
