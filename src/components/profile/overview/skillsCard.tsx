"use client";
import { useEffect, useState } from "react";
import { mockClients } from "@/mocks/mockClient";

export default function SkillsCard({ projectId }: { projectId: string }) {
  const [skills, setSkills] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/projects/${projectId}/skills`);
        if (res.ok) {
          const { data } = await res.json();
          setSkills(data || []);
          return;
        }
        throw new Error("Backend not ok");
      } catch {
        const fallbackProject = mockClients[0].projects.find(
          (p) => p.id === projectId || p._id === projectId
        );
        setSkills(fallbackProject?.skills || []);
      }
    }
    fetchData();
  }, [projectId]);

  if (!skills.length)
    return <div className="animate-pulse h-32 bg-gray-900 rounded-xl" />;

  return (
    <div
      className="bg-black border border-gray-700 rounded-xl p-6 shadow-lg 
                    transition transform hover:scale-[1.02] hover:bg-gray-900 
                    hover:border-[#c12129] relative group"
    >
      <h3 className="text-lg font-semibold text-white mb-3">Skills</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((s, i) => (
          <span
            key={i}
            className="bg-[#c12129] text-white px-3 py-1 rounded text-sm shadow-md"
          >
            {s}
          </span>
        ))}
      </div>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
        <span className="bg-[#c12129] text-white text-xs px-2 py-1 rounded shadow-md">
          Required skills for this project
        </span>
      </div>
    </div>
  );
}
