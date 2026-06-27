"use client";
import { useEffect, useState } from "react";
import { Milestone } from "@/types/project";
import { mockClients } from "@/mocks/mockClient";

export default function MilestonesCard({ projectId }: { projectId: string }) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/projects/${projectId}/milestones`);
        if (!res.ok) throw new Error("Backend not ok");

        const { data } = await res.json();
        setMilestones(data || []);
      } catch {
        const fallbackProject = mockClients[0].projects.find(
          (p) => p.id === projectId || p._id === projectId
        );
        setMilestones(fallbackProject?.milestones || []);
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

  if (!milestones.length) {
    return (
      <div className="bg-black border border-gray-700 rounded-xl p-6 shadow-lg">
        <p className="text-gray-400 text-sm">No milestones available.</p>
      </div>
    );
  }

  // Headline metrics
  const total = milestones.length;
  const completed = milestones.filter((m) => m.status === "completed").length;
  const progress =
    total > 0
      ? Math.round(
        milestones.reduce(
          (sum, m) =>
            sum + (m.progress ?? (m.status === "completed" ? 100 : 0)),
          0
        ) / total
      )
      : 0;

  // Status badge colors
  const statusColors: Record<string, string> = {
    pending: "bg-gray-600",
    in_progress: "bg-yellow-600",
    funded: "bg-blue-600",
    released: "bg-purple-600",
    completed: "bg-green-600",
    cancelled: "bg-red-600",
    disputed: "bg-red-800",
  };

  return (
    <div
      className="bg-black border border-gray-700 rounded-xl p-6 shadow-lg 
                 transition transform hover:scale-[1.02] hover:bg-gray-900 
                 hover:border-[#c12129] relative group"
    >
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        Milestones
        {error && (
          <span className="text-xs text-red-500">(fallback data)</span>
        )}
      </h3>

      {/* Headline metrics */}
      <div className="flex justify-between text-xs text-gray-400 mb-3">
        <span>Total: <span className="text-white">{total}</span></span>
        <span>Completed: <span className="text-white">{completed}</span></span>
        <span>Progress: <span className="text-white">{progress}%</span></span>
      </div>

      {/* Milestone list with hover popover */}
      <ul className="space-y-2">
        {milestones.map((m) => (
          <li
            key={m.id || m._id}
            className="relative flex justify-between items-center bg-gray-900 p-3 rounded-md 
                       border border-transparent hover:border-[#c12129] hover:bg-gray-800 transition group"
          >
            <div>
              <span className="text-white block">{m.title}</span>
              {m.dueDate && (
                <span className="text-xs text-gray-400">
                  Due: {new Date(m.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
            <span
              className={`text-xs px-2 py-1 rounded text-white ${statusColors[m.status ?? "pending"] || "bg-gray-600"
                }`}
            >
              {m.status}
            </span>

            {/* Hover popover */}
            <div className="absolute left-0 top-full mt-1 w-full opacity-0 group-hover:opacity-100 transition">
              <div className="bg-[#111] border border-[#c12129] text-xs text-gray-300 rounded p-2 shadow-lg">
                {m.description && <p className="mb-1">Desc: {m.description}</p>}
                {m.acceptanceCriteria && (
                  <p className="mb-1">Criteria: {m.acceptanceCriteria}</p>
                )}
                {typeof m.progress === "number" && (
                  <p>Progress: {m.progress}%</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Tooltip */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
        <span className="bg-[#c12129] text-white text-xs px-2 py-1 rounded shadow-md">
          Project milestones overview
        </span>
      </div>
    </div>
  );
}
