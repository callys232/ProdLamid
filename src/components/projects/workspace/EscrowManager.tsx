"use client";

import React, { useState, useEffect } from "react";
import { FaShieldAlt, FaHandHoldingUsd, FaHistory, FaCheckCircle, FaLock } from "react-icons/fa";
import { toast } from "react-hot-toast";

interface EscrowManagerProps {
    projectId: string;
}

export default function EscrowManager({ projectId }: EscrowManagerProps) {
    const [escrows, setEscrows] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch escrows related to project milestones
        // For simplicity, we fetch all milestones and filter those with escrow
        fetchEscrowStatus();
    }, [projectId]);

    const fetchEscrowStatus = async () => {
        try {
            const res = await fetch(`/api/projects/${projectId}/escrow`);
            const data = await res.json();
            if (res.ok) {
                // Combine milestone data with escrow data
                const combined = data.data.collectionEscrows.map((escrow: any) => {
                    const milestone = data.data.milestones.find((m: any) => m._id === escrow.milestoneId) || {};
                    return {
                        ...escrow,
                        title: milestone.title || "Unknown Milestone",
                        description: milestone.description
                    };
                });
                setEscrows(combined);
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleFund = async (escrowId: string) => {
        const toastId = toast.loading("Initializing secure payment...");
        try {
            const res = await fetch(`/api/escrows/${escrowId}/fund`, { method: "POST" });
            const data = await res.json();
            if (res.ok && data.authorization_url) {
                window.location.href = data.authorization_url;
            } else {
                toast.error(data.error || "Funding failed", { id: toastId });
            }
        } catch (error) {
            toast.error("An error occurred", { id: toastId });
        }
    };

    const handleRelease = async (escrowId: string) => {
        const toastId = toast.loading("Releasing funds...");
        try {
            const res = await fetch(`/api/escrows/${escrowId}/release`, { method: "PATCH" });
            const data = await res.json();
            if (res.ok) {
                toast.success("Funds released successfully!", { id: toastId });
                fetchEscrowStatus();
            } else {
                toast.error(data.error || "Release failed", { id: toastId });
            }
        } catch (error) {
            toast.error("An error occurred", { id: toastId });
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-blue-900/10 border border-blue-900/30 rounded-2xl p-6 flex items-center gap-6">
                <div className="bg-blue-600 p-4 rounded-xl text-white text-3xl shadow-lg shadow-blue-900/40">
                    <FaShieldAlt />
                </div>
                <div>
                    <h3 className="text-xl font-bold">Secure Escrow</h3>
                    <p className="text-gray-600 text-sm max-w-lg">
                        Funds are held securely in escrow and only released when the milestone is approved by you.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {escrows.map((m) => (
                    <div key={m._id} className="bg-white/5 border border-white/5 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-white/5 text-gray-600">
                                <FaLock />
                            </div>
                            <div>
                                <h4 className="font-bold text-white">{m.title}</h4>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Status: {m.status}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Milestone Amount</p>
                                <p className="text-xl font-bold text-white">₦{(m.amount / 100).toLocaleString()}</p>
                            </div>

                            {m.status === "pending" && (
                                <button
                                    onClick={() => handleFund(m._id)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2"
                                >
                                    <FaHandHoldingUsd /> Fund Now
                                </button>
                            )}

                            {m.status === "funded" && (
                                <button
                                    onClick={() => handleRelease(m._id)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-all"
                                >
                                    Release Funds
                                </button>
                            )}

                            {m.status === "released" && (
                                <div className="text-blue-400 flex items-center gap-2 font-bold px-4 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                    <FaHistory /> Released
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
