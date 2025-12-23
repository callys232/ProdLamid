"use client";

import { useEffect, useState } from "react";
import { ClientProfile, Consultant, Invitation } from "@/types/client";

interface ClientInvitationsProps {
  client: ClientProfile;
  consultants: Consultant[];
  isPremium?: boolean;
}

export default function Invitations({
  client,
  consultants,
  isPremium = false,
}: ClientInvitationsProps) {
  const [email, setEmail] = useState<string>("");
  const [selectedConsultant, setSelectedConsultant] = useState<string>("");
  const [aiSuggested, setAiSuggested] = useState<Consultant[]>([]);
  const [loadingAI, setLoadingAI] = useState<boolean>(false);
  const [invitations, setInvitations] = useState<Invitation[]>(
    client.invitations || []
  );
  const [filter, setFilter] = useState<string>("");

  // Add new invitation
  const addInvitation = (inv: Omit<Invitation, "id" | "createdAt">) => {
    const newInvite: Invitation = {
      ...inv,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setInvitations((prev) => [newInvite, ...prev]);
  };

  // Invite handlers
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

  // Invitation actions
  const handleResend = (id: string) => {
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === id
          ? { ...inv, status: "pending", createdAt: new Date().toISOString() }
          : inv
      )
    );
    alert("Invitation resent!");
  };

  const handleCancel = (id: string) => {
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "declined" } : inv))
    );
    alert("Invitation cancelled.");
  };

  // Filter invitations
  const filteredInvitations = invitations.filter((inv) => {
    const consultantName = inv.consultantId
      ? consultants.find((c) => c.id === inv.consultantId)?.name || ""
      : "";
    const searchTarget = `${inv.email || ""} ${consultantName} ${
      inv.status
    }`.toLowerCase();
    return searchTarget.includes(filter.toLowerCase());
  });

  return (
    <div className="w-full p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Invitations</h1>

      {/* Invite by Email */}
      <section className="bg-gray-900 border border-gray-800 rounded-md p-4 space-y-3">
        <h2 className="text-lg font-semibold text-white">Invite by Email</h2>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
          />
          <button
            onClick={handleEmailInvite}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-white"
          >
            Send
          </button>
        </div>
      </section>

      {/* Select Consultant */}
      <section className="bg-gray-900 border border-gray-800 rounded-md p-4 space-y-3">
        <h2 className="text-lg font-semibold text-white">Select Consultant</h2>
        <div className="flex gap-2">
          <select
            aria-label="Select Consultant"
            value={selectedConsultant}
            onChange={(e) => setSelectedConsultant(e.target.value)}
            className="flex-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
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
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-white"
          >
            Invite
          </button>
        </div>
      </section>

      {/* AI Recommendations */}
      {isPremium && (
        <section className="bg-gray-900 border border-gray-800 rounded-md p-4 space-y-3">
          <h2 className="text-lg font-semibold text-white">
            AI Recommendations
          </h2>
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
                  className="flex justify-between bg-gray-800 px-3 py-2 rounded-md"
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
        </section>
      )}

      {/* Invitation History */}
      <section className="bg-gray-900 border border-gray-800 rounded-md p-4 space-y-3">
        <input
          type="text"
          placeholder="Filter invitations..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-1 rounded bg-gray-800 text-white border border-gray-700 w-full text-sm"
        />
        <ul className="space-y-2 mt-2">
          {filteredInvitations.map((inv) => {
            const name = inv.consultantId
              ? consultants.find((c) => c.id === inv.consultantId)?.name
              : inv.email || "Unknown";
            return (
              <li
                key={inv.id}
                className="flex justify-between bg-gray-800 rounded p-2"
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
                      className="text-xs bg-red-700 px-2 py-1 rounded text-white hover:bg-red-800"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
