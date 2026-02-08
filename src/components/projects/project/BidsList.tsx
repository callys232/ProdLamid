"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaMoneyBillWave, FaClock, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Card from "./card";

interface Bid {
    _id: string;
    projectId: string;
    bidderId: string;
    amount: number;
    duration?: string;
    coverLetter?: string;
    status: string;
    name?: string;
    email?: string;
    createdAt: string;
}

interface BidsListProps {
    projectId: string;
}

export default function BidsList({ projectId }: BidsListProps) {
    const [bids, setBids] = useState<Bid[]>([]);
    const [loading, setLoading] = useState(true);
    const [hiringId, setHiringId] = useState<string | null>(null);

    useEffect(() => {
        fetchBids();
    }, [projectId]);

    const fetchBids = async () => {
        try {
            const res = await fetch(`/api/bids?projectId=${projectId}`);
            const data = await res.json();
            if (data.success) {
                setBids(data.data);
            }
        } catch (error) {
            console.error("Error fetching bids:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleHire = async (bid: Bid) => {
        setHiringId(bid._id);
        try {
            const res = await fetch("/api/hire-consultant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    consultantId: bid.bidderId,
                    projectId: bid.projectId,
                    bidId: bid._id,
                    clientMessage: `You have been hired for the project based on your bid of $${bid.amount}.`
                }),
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Consultant hired successfully!");
                fetchBids(); // Refresh status
            } else {
                toast.error(data.message || "Failed to hire consultant.");
            }
        } catch (error) {
            toast.error("An error occurred during hiring.");
        } finally {
            setHiringId(null);
        }
    };

    if (loading) return <div className="text-gray-400 p-4">Loading bids...</div>;

    return (
        <Card title="📈 Project Bids">
            {bids.length === 0 ? (
                <p className="text-gray-400 py-4 text-center italic">No bids yet for this project.</p>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {bids.map((bid) => (
                            <motion.div
                                key={bid._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className={`p-4 rounded-lg bg-[#0c0000] border transition-all ${bid.status === "accepted" ? "border-green-600/50 bg-green-900/10" : "border-[#3a1919]"
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <FaUserCircle className="text-2xl text-gray-500" />
                                        <div>
                                            <p className="font-bold text-white leading-tight">{bid.name || "Anonymous Bidder"}</p>
                                            <p className="text-xs text-gray-500">{new Date(bid.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-red-500">${bid.amount}</p>
                                        {bid.duration && <p className="text-xs text-gray-400 flex items-center justify-end gap-1"><FaClock size={10} /> {bid.duration}</p>}
                                    </div>
                                </div>

                                {bid.coverLetter && (
                                    <p className="text-sm text-gray-300 italic mb-4 line-clamp-3 bg-white/5 p-2 rounded border border-white/5">
                                        "{bid.coverLetter}"
                                    </p>
                                )}

                                <div className="flex justify-between items-center">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${bid.status === "accepted" ? "bg-green-600 text-white" : "bg-gray-800 text-gray-400"
                                        }`}>
                                        {bid.status}
                                    </span>

                                    {bid.status !== "accepted" && (
                                        <button
                                            onClick={() => handleHire(bid)}
                                            disabled={hiringId === bid._id}
                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm font-bold shadow-lg shadow-red-900/20 transition-all disabled:opacity-50"
                                        >
                                            {hiringId === bid._id ? "Processing..." : "Hire Now"}
                                        </button>
                                    )}
                                    {bid.status === "accepted" && (
                                        <span className="flex items-center gap-1 text-green-500 text-sm font-bold">
                                            <FaCheckCircle /> Hired
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </Card>
    );
}
