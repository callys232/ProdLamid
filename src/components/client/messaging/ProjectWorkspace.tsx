"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FaProjectDiagram, FaFileInvoiceDollar, FaComments, FaInfoCircle } from "react-icons/fa";

import MilestoneManager from "./MilestoneManager";
import ChatSystem from "./ChatSystem";
import { EscrowPanel } from "./escrowCard";
import { getMe } from "@/lib/api/authApi";
import type { Escrow } from "@/types/escrow";

export default function ProjectWorkspace() {
    const { id: projectId } = useParams();
    const [activeTab, setActiveTab] = useState("milestones");
    const [project, setProject] = useState<any>(null);
    const [escrow, setEscrow] = useState<Escrow | null>(null);
    const [role, setRole] = useState<"client" | "consultant">("client");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMe()
            .then((user) => setRole(user.role === "seller" ? "consultant" : "client"))
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (projectId) fetchProject();
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

    async function handleStart() {
        if (!escrow) return;
        setEscrow((prev) => prev ? { ...prev, status: "in_progress" } : prev);
        try {
            await fetch("/api/escrow/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ escrowId: escrow.id, role }),
            });
        } catch (err) {
            console.warn("Start failed:", err);
        }
    }

    async function handleFund() {
        if (!escrow) return;
        setEscrow((prev) => prev ? { ...prev, status: "funded" } : prev);
        try {
            await fetch("/api/escrow/fund", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ escrowId: escrow.id }),
            });
        } catch (err) {
            console.warn("Fund failed:", err);
        }
    }

    async function handleFinish() {
        if (!escrow) return;
        setEscrow((prev) => prev ? { ...prev, status: "finished" } : prev);
        try {
            await fetch("/api/escrow/finish", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ escrowId: escrow.id }),
            });
        } catch (err) {
            console.warn("Finish failed:", err);
        }
    }

    async function handleRelease() {
        if (!escrow) return;
        setEscrow((prev) => prev ? { ...prev, status: "paid" } : prev);
        try {
            await fetch("/api/escrow/release", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ escrowId: escrow.id }),
            });
        } catch (err) {
            console.warn("Release failed:", err);
        }
    }

    async function handleDispute(reason: string) {
        if (!escrow) return;
        setEscrow((prev) =>
            prev ? { ...prev, status: "disputed", disputeReason: reason } : prev
        );
        try {
            await fetch("/api/escrow/dispute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ escrowId: escrow.id, reason }),
            });
        } catch (err) {
            console.warn("Dispute failed:", err);
        }
    }

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

    if (!project) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#050000] text-white">
                Project not found.
            </div>
        );
    }

    const tabs = [
        { id: "milestones", label: "Milestones", icon: <FaProjectDiagram /> },
        { id: "escrow",     label: "Escrow & Payments", icon: <FaFileInvoiceDollar /> },
        { id: "chat",       label: "Messages", icon: <FaComments /> },
        { id: "details",    label: "Project Info", icon: <FaInfoCircle /> },
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
                            className={`flex items-center gap-2 whitespace-nowrap rounded-full px-6 py-3 transition-all ${
                                activeTab === tab.id
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
                                    <EscrowPanel
                                        escrow={escrow}
                                        role={role}
                                        onStart={handleStart}
                                        onFund={handleFund}
                                        onFinish={handleFinish}
                                        onRelease={handleRelease}
                                        onDispute={handleDispute}
                                    />
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
