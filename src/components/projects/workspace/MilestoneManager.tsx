"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaPlay, FaStop, FaCheck, FaExclamationTriangle, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";

interface Milestone {
    _id: string;
    title: string;
    description: string;
    amount: number;
    status: string;
    notes?: string;
}

interface MilestoneManagerProps {
    projectId: string;
}

export default function MilestoneManager({ projectId }: MilestoneManagerProps) {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newMilestone, setNewMilestone] = useState({ title: "", description: "", amount: 0 });

    useEffect(() => {
        fetchMilestones();
    }, [projectId]);

    const fetchMilestones = async () => {
        try {
            const res = await fetch(`/api/projects/${projectId}/milestones`);
            const data = await res.json();
            if (res.ok) setMilestones(data.data);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            const res = await fetch(`/api/projects/${projectId}/milestones`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newMilestone),
            });
            if (res.ok) {
                toast.success("Milestone created!");
                setIsAdding(false);
                fetchMilestones();
            }
        } catch (error) {
            toast.error("Failed to create milestone");
        }
    };

    const updateStatus = async (milestoneId: string, action: string) => {
        try {
            const res = await fetch(`/api/projects/${projectId}/milestones/${milestoneId}/${action}`, {
                method: "PATCH",
            });
            const data = await res.json();

            if (!res.ok) {
                if (data.requireFunding) {
                    toast.error(data.message, { duration: 5000 });
                    // Optional: Switch tab or show fund button
                    return;
                }
                throw new Error(data.error || data.message || `Failed to ${action} milestone`);
            }

            toast.success(data.message || `Milestone ${action}ed!`);
            fetchMilestones();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
            case "started": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
            case "approved": return "text-green-500 bg-green-500/10 border-green-500/20";
            case "dispute": return "text-red-500 bg-red-500/10 border-red-500/20";
            default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Project Milestones</h3>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-all"
                >
                    <FaPlus /> Add Milestone
                </button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4"
                    >
                        <input
                            type="text"
                            placeholder="Milestone Title"
                            className="w-full bg-black border border-white/10 rounded-lg p-2 text-white"
                            onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                        />
                        <textarea
                            placeholder="Description"
                            className="w-full bg-black border border-white/10 rounded-lg p-2 text-white"
                            onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Amount (₦)"
                            className="w-full bg-black border border-white/10 rounded-lg p-2 text-white"
                            onChange={(e) => setNewMilestone({ ...newMilestone, amount: Number(e.target.value) })}
                        />
                        <div className="flex gap-2">
                            <button onClick={handleCreate} className="bg-green-600 px-4 py-2 rounded-lg font-bold">Create</button>
                            <button onClick={() => setIsAdding(false)} className="bg-gray-700 px-4 py-2 rounded-lg font-bold">Cancel</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-4">
                {milestones.map((m) => (
                    <div key={m._id} className="bg-white/5 border border-white/5 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <h4 className="text-lg font-bold">{m.title}</h4>
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getStatusColor(m.status)}`}>
                                    {m.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-400">{m.description}</p>
                            <p className="text-red-500 font-bold mt-2">₦{(m.amount / 100).toLocaleString()}</p>
                        </div>

                        <div className="flex gap-2">
                            {m.status === "pending" && (
                                <button onClick={() => updateStatus(m._id, "start")} className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white" title="Start Work">
                                    <FaPlay />
                                </button>
                            )}
                            {m.status === "started" && (
                                <button onClick={() => updateStatus(m._id, "approve")} className="p-3 bg-green-600 hover:bg-green-700 rounded-lg text-white" title="Mark as Completed">
                                    <FaCheck />
                                </button>
                            )}
                            {m.status === "started" && (
                                <button onClick={() => updateStatus(m._id, "dispute")} className="p-3 bg-red-600 hover:bg-red-700 rounded-lg text-white" title="Raise Dispute">
                                    <FaExclamationTriangle />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {milestones.length === 0 && !loading && (
                    <p className="text-center text-gray-500 py-10 italic">No milestones defined yet.</p>
                )}
            </div>
        </div>
    );
}
