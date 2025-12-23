"use client";
import { useEffect, useState } from "react";
import { Milestone } from "@/types/project";
import { mockClients } from "@/mocks/mockClient";

export default function MilestonesCard({ projectId }: { projectId: string }) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/projects/${projectId}/milestones`);
        if (res.ok) {
          const { data } = await res.json();
          setMilestones(data || []);
          return;
        }
        throw new Error("Backend not ok");
      } catch {
        const fallbackProject = mockClients[0].projects.find(
          (p) => p.id === projectId || p._id === projectId
        );
        setMilestones(fallbackProject?.milestones || []);
      }
    }
    fetchData();
  }, [projectId]);

  if (!milestones.length)
    return <div className="animate-pulse h-32 bg-gray-900 rounded-xl" />;

  return (
    <div
      className="bg-black border border-gray-700 rounded-xl p-6 shadow-lg 
                    transition transform hover:scale-[1.02] hover:bg-gray-900 
                    hover:border-[#c12129] relative group"
    >
      <h3 className="text-lg font-semibold text-white mb-3">Milestones</h3>
      <ul className="space-y-2">
        {milestones.map((m) => (
          <li
            key={m.id}
            className="flex justify-between bg-gray-900 p-3 rounded-md"
          >
            <span className="text-white">{m.title}</span>
            <span className="text-xs px-2 py-1 rounded bg-[#c12129] text-white">
              {m.status}
            </span>
          </li>
        ))}
      </ul>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
        <span className="bg-[#c12129] text-white text-xs px-2 py-1 rounded shadow-md">
          Project milestones and status
        </span>
      </div>
    </div>
  );
}
