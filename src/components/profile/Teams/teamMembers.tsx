"use client";

import { useState } from "react";
import { TeamMember } from "@/types/client";

interface TeamMembersProps {
  members: TeamMember[];
}

export default function TeamMembers({ members }: TeamMembersProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  if (!members.length)
    return <p className="text-gray-400 text-sm p-4">No team members found.</p>;

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((m) => (
          <div
            key={m.id}
            onClick={() =>
              setSelectedMember((prev) => (prev?.id === m.id ? null : m))
            }
            className="p-4 border rounded-lg bg-black text-white flex flex-col gap-1 cursor-pointer hover:border-[#2563EB] hover:shadow-md transition"
          >
            <p className="font-semibold">{m.name}</p>
            <p className="text-sm text-gray-300">{m.role ?? "Member"}</p>
            <p className="text-xs text-gray-400">{m.email}</p>
          </div>
        ))}
      </div>

      {selectedMember && (
        <div className="mt-4 p-4 border rounded-lg bg-black text-white shadow-inner border-[#2563EB]">
          <h4 className="font-bold text-lg text-[#2563EB]">
            {selectedMember.name}
          </h4>
          <p className="text-sm text-gray-300">Role: {selectedMember.role}</p>
          <p className="text-sm text-gray-300">Email: {selectedMember.email}</p>
        </div>
      )}
    </div>
  );
}
