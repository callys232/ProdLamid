"use client";
import { useEffect, useState } from "react";
import { Project } from "@/types/project";
import { mockClients } from "@/mocks/mockClient";

export default function ProjectHeader({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) throw new Error("Backend not ok");

        const { data } = await res.json();
        setProject({ ...data, id: data._id || data.id });
      } catch {
        const fallbackProject = mockClients[0].projects.find(
          (p) => p.id === projectId || p._id === projectId
        );
        if (fallbackProject) {
          setProject({
            ...fallbackProject,
            id: fallbackProject._id || fallbackProject.id,
          });
        }
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [projectId]);

  if (loading) {
    return <div className="animate-pulse h-24 bg-gray-900 rounded-xl" />;
  }

  if (!project) {
    return (
      <div className="bg-black border border-gray-700 rounded-xl p-6 shadow-lg">
        <p className="text-gray-400 text-sm">No project header available.</p>
      </div>
    );
  }

  return (
    <div
      className="bg-black border border-gray-700 rounded-xl p-6 shadow-lg 
                 transition transform hover:scale-[1.02] hover:bg-gray-900 
                 hover:border-[#2563EB] relative group"
    >
      <h2 className="text-2xl font-bold text-white">{project.title}</h2>
      <p className="text-sm text-gray-400">{project.organization ?? "No organization"}</p>

      {/* Extra headline info */}
      <div className="flex gap-4 mt-2 text-xs text-gray-400">
        <span>
          Stage: <span className="text-white">{project.stage ?? "N/A"}</span>
        </span>
        <span>
          Status: <span className="text-white">{project.status ?? "N/A"}</span>
        </span>
        <span>
          Category: <span className="text-white">{project.category ?? "N/A"}</span>
        </span>
      </div>

      {/* Tooltip */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
        <span className="bg-[#2563EB] text-white text-xs px-2 py-1 rounded shadow-md">
          Project Header
        </span>
      </div>

      {/* Error badge */}
      {error && (
        <div className="text-xs text-blue-500 mt-2">Showing fallback data</div>
      )}
    </div>
  );
}
