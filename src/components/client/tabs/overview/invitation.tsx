"use client";

import { useState } from "react";
import { ClientProfile, Consultant, Invitation } from "@/types/client";

interface ClientInvitationsProps {
    client: ClientProfile;
    consultants: Consultant[];
    isPremium?: boolean;
}

export function InvitationsSection({
    client,
    consultants,
    isPremium = false,
}: ClientInvitationsProps) {
    const [email, setEmail] = useState("");
    const [selectedConsultant, setSelectedConsultant] = useState("");
    const [aiSuggested, setAiSuggested] = useState<Consultant[]>([]);
    const [loadingAI, setLoadingAI] = useState(false);
    const [invitations, setInvitations] = useState<Invitation[]>(
        client.invitations || []
    );
    const [filter, setFilter] = useState("");

    // Add new invitation
    const addInvitation = (inv: Omit<Invitation, "id" | "createdAt">) => {
        const newInvite: Invitation = {
            ...inv,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };
        setInvitations((prev) => [newInvite, ...prev]);
    };

    // Handlers
    const handleEmailInvite = () => {
        if (!email) return;
        addInvitation({
            email,
            method: "email",
            status: "pending",
            invitedBy: client.id,
        });
        setEmail("");
    };

    const handleConsultantInvite = () => {
        if (!selectedConsultant) return;
        addInvitation({
            consultantId: selectedConsultant,
            method: "consultant",
            status: "pending",
            invitedBy: client.id,
        });
        setSelectedConsultant("");
    };

    const handleAIRecommendation = () => {
        setLoadingAI(true);
        setTimeout(() => {
            setAiSuggested(consultants.slice(0, 2)); // mock AI suggestions
            setLoadingAI(false);
        }, 1000);
    };

    const handleResend = (id: string) => {
        setInvitations((prev) =>
            prev.map((inv) =>
                inv.id === id
                    ? { ...inv, status: "pending", createdAt: new Date().toISOString() }
                    : inv
            )
        );
    };

    const handleCancel = (id: string) => {
        setInvitations((prev) =>
            prev.map((inv) => (inv.id === id ? { ...inv, status: "declined" } : inv))
        );
    };

    // Filter
    const filteredInvitations = invitations.filter((inv) => {
        const consultantName = inv.consultantId
            ? consultants.find((c) => c.id === inv.consultantId)?.name || ""
            : "";
        const searchTarget = `${inv.email || ""} ${consultantName} ${inv.status
            }`.toLowerCase();
        return searchTarget.includes(filter.toLowerCase());
    });

    return (
        <section className="bg-[#111] border border-white/20 rounded-xl p-6 space-y-6 shadow-md hover:shadow-lg transition">
            <h2 className="text-2xl font-bold text-[#c12129]">Consultant Invitations</h2>

            {/* Invite by Email */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Invite by Email</h3>
                <div className="flex gap-2">
                    <input
                        type="email"
                        placeholder="Enter email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 px-3 py-2 rounded bg-black text-white border border-gray-700 focus:ring-2 focus:ring-[#c12129] hover:bg-[#1a1a1a]"
                    />
                    <button
                        onClick={handleEmailInvite}
                        className="px-4 py-2 bg-[#c12129] rounded hover:bg-red-700 text-white transition transform hover:scale-105"
                    >
                        Send
                    </button>
                </div>
            </div>

            {/* Select Consultant */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Select Consultant</h3>
                <div className="flex gap-2">
                    <select
                        aria-label="Select Consultant"
                        value={selectedConsultant}
                        onChange={(e) => setSelectedConsultant(e.target.value)}
                        className="flex-1 px-3 py-2 rounded bg-black text-white border border-gray-700 focus:ring-2 focus:ring-[#c12129] hover:bg-[#1a1a1a]"
                    >
                        <option value="">-- Choose Consultant --</option>
                        {consultants.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name} ({c.industry})
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleConsultantInvite}
                        className="px-4 py-2 bg-[#c12129] rounded hover:bg-red-700 text-white transition transform hover:scale-105"
                    >
                        Invite
                    </button>
                </div>
            </div>

            {/* AI Recommendations */}
            {isPremium && (
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">AI Recommendations</h3>
                    <button
                        onClick={handleAIRecommendation}
                        disabled={loadingAI}
                        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loadingAI ? "Loading..." : "Get Recommendations"}
                    </button>
                    {aiSuggested.length > 0 && (
                        <ul className="mt-4 space-y-2">
                            {aiSuggested.map((c) => (
                                <li
                                    key={c.id}
                                    className="flex justify-between bg-gray-800 px-3 py-2 rounded-md hover:bg-[#1a1a1a] transition"
                                >
                                    <span>
                                        {c.name} — {c.industry}
                                    </span>
                                    <button
                                        onClick={() =>
                                            addInvitation({
                                                consultantId: c.id,
                                                method: "ai",
                                                status: "pending",
                                                invitedBy: client.id,
                                            })
                                        }
                                        className="text-xs bg-green-600 px-2 py-1 rounded text-white hover:bg-green-700"
                                    >
                                        Invite
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* Invitation History */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Invitation History</h3>
                <input
                    type="text"
                    placeholder="Filter invitations..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-1 rounded bg-black text-white border border-gray-700 w-full text-sm focus:ring-2 focus:ring-[#c12129] hover:bg-[#1a1a1a]"
                />
                <ul className="space-y-2 mt-2">
                    {filteredInvitations.map((inv) => {
                        const name = inv.consultantId
                            ? consultants.find((c) => c.id === inv.consultantId)?.name
                            : inv.email || "Unknown";
                        return (
                            <li
                                key={inv.id}
                                className="flex justify-between bg-gray-800 rounded p-2 hover:bg-[#1a1a1a] transition"
                            >
                                <span>
                                    {name} — {inv.status} via {inv.method}
                                </span>
                                {inv.status === "pending" && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleResend(inv.id)}
                                            className="text-xs bg-blue-600 px-2 py-1 rounded text-white hover:bg-blue-700"
                                        >
                                            Resend
                                        </button>
                                        <button
                                            onClick={() => handleCancel(inv.id)}
                                            className="text-xs bg-[#c12129] px-2 py-1 rounded text-white hover:bg-red-800"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
