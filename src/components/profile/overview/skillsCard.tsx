"use client";
import { useEffect, useState } from "react";
import { mockClients } from "@/mocks/mockClient";

export default function SkillsCard({ projectId }: { projectId: string }) {
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/projects/${projectId}/skills`);
        if (!res.ok) throw new Error("Backend not ok");

        const { data } = await res.json();
        setSkills(data || []);
      } catch {
        const fallbackProject = mockClients[0].projects.find(
          (p) => p.id === projectId || p._id === projectId
        );
        setSkills(fallbackProject?.skills || []);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [projectId]);

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-900 rounded-xl" />;
  }

  if (!skills.length) {
    return (
      <div className="bg-black border border-gray-700 rounded-xl p-6 shadow-lg">
        <p className="text-gray-400 text-sm">No skills listed for this project.</p>
      </div>
    );
  }

  return (
    <div
      className="bg-black border border-gray-700 rounded-xl p-6 shadow-lg 
                 transition transform hover:scale-[1.02] hover:bg-gray-900 
                 hover:border-[#c12129] relative group"
    >
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        Skills
        {error && (
          <span className="text-xs text-red-500">(fallback data)</span>
        )}
      </h3>

      {/* Headline metric */}
      <p className="text-xs text-gray-400 mb-3">
        Total Skills: <span className="text-white">{skills.length}</span>
      </p>

      {/* Skills list with hover popover */}
      <div className="flex flex-wrap gap-2">
        {skills.map((s, i) => (
          <div key={i} className="relative group">
            <span
              className="bg-[#c12129] text-white px-3 py-1 rounded text-sm shadow-md 
                         hover:bg-red-700 hover:border hover:border-white transition cursor-default"
            >
              {s}
            </span>

            {/* Popover appears on hover */}
            <div className="absolute left-0 top-full mt-1 w-max opacity-0 group-hover:opacity-100 transition">
              <div className="bg-[#111] border border-[#c12129] text-xs text-gray-300 rounded p-2 shadow-lg">
                <p>Skill: {s}</p>
                <p>Usage: Required for project tasks</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tooltip for whole card */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
        <span className="bg-[#c12129] text-white text-xs px-2 py-1 rounded shadow-md">
          Required skills for this project
        </span>
      </div>
    </div>
  );
}
