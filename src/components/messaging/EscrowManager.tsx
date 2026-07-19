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
            // In a real app, you'd have a specific endpoint for project escrows
            const res = await fetch(`/api/projects/${projectId}/milestones`);
            const data = await res.json();
            if (res.ok) setEscrows(data.data.filter((m: any) => m.amount > 0));
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleFund = async (milestoneId: string) => {
        toast.loading("Initializing secure payment...");
        try {
            // This is a stub for the fund logic which usually needs an escrow ID
            // Here we assume a 1:1 mapping between milestone and escrow for simplicity
            const res = await fetch(`/api/escrows/${milestoneId}/fund`, { method: "POST" });
            const data = await res.json();
            if (res.ok && data.authorization_url) {
                window.location.href = data.authorization_url;
            } else {
                toast.dismiss();
                toast.error(data.error || "Funding failed");
            }
        } catch (error) {
            toast.dismiss();
            toast.error("An error occurred");
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
                    <p className="text-gray-400 text-sm max-w-lg">
                        Funds are held securely in escrow and only released when the milestone is approved by you.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {escrows.map((m) => (
                    <div key={m._id} className="bg-white/5 border border-white/5 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-white/5 text-gray-400">
                                <FaLock />
                            </div>
                            <div>
                                <h4 className="font-bold text-white">{m.title}</h4>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Status: {m.status}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                            <div className="text-right">
                                <p className="text-sm text-gray-400">Milestone Amount</p>
                                <p className="text-xl font-bold text-white">${m.amount.toLocaleString()}</p>
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
                                <div className="text-green-500 flex items-center gap-2 font-bold px-4 py-2 bg-green-500/10 rounded-lg border border-green-500/20">
                                    <FaCheckCircle /> Funded
                                </div>
                            )}

                            {m.status === "approved" && (
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-all"
                                >
                                    Release Funds
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
