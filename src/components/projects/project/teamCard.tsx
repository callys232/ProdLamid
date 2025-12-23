"use client";

import Card from "./card";
import type { TeamMember, Invitation, Consultant } from "@/types/client";

interface TeamCardProps {
  members: TeamMember[];
  invitations: Invitation[];
  consultants: Consultant[];
}

export default function TeamCard({
  members,
  invitations,
  consultants,
}: TeamCardProps) {
  // Helper: find consultant details for invited members
  const getConsultantName = (id?: string) => {
    if (!id) return "Unknown Consultant";
    const consultant = consultants.find((c) => c.id === id);
    return consultant ? consultant.name : id;
  };

  return (
    <Card title="👨‍👩‍👧 Team">
      {/* Active Members */}
      <h3 className="text-lg font-semibold mb-2">Active Members</h3>
      {members && members.length > 0 ? (
        <ul className="space-y-2 mb-4">
          {members.map((m) => (
            <li
              key={m.id}
              className="bg-[#0c0000] p-3 rounded-md border border-[#3a1919]"
            >
              <p className="text-sm text-gray-300 font-semibold">{m.name}</p>
              <p className="text-xs text-gray-400">{m.role}</p>
              <p className="text-xs text-gray-500">{m.email}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 mb-4">No active team members.</p>
      )}

      {/* Invited Members */}
      <h3 className="text-lg font-semibold mb-2">Invited Members</h3>
      {invitations && invitations.length > 0 ? (
        <ul className="space-y-2">
          {invitations.map((inv) => (
            <li
              key={inv.id}
              className="bg-[#0c0000] p-3 rounded-md border border-[#3a1919]"
            >
              <p className="text-sm text-gray-300 font-semibold">
                {getConsultantName(inv.consultantId)}
              </p>
              <p className="text-xs text-gray-400">Status: {inv.status}</p>
              <p className="text-xs text-gray-500">
                Invited by: {inv.invitedBy} |{" "}
                {new Date(inv.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No invitations pending.</p>
      )}
    </Card>
  );
}
