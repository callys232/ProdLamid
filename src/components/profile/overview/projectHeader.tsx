"use client";
import { useEffect, useState } from "react";
import { Project } from "@/types/project";
import { mockClients } from "@/mocks/mockClient";

export default function ProjectHeader({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (res.ok) {
          const { data } = await res.json();
          setProject({ ...data, id: data._id || data.id });
          return;
        }
        throw new Error("Backend not ok");
      } catch {
        const fallbackProject = mockClients[0].projects.find(
          (p) => p.id === projectId || p._id === projectId,
        );
        if (fallbackProject) {
          setProject({
            ...fallbackProject,
            id: fallbackProject._id || fallbackProject.id,
          });
        }
      }
    }
    fetchData();
  }, [projectId]);

  if (!project)
    return <div className="animate-pulse h-24 bg-gray-900 rounded-xl" />;

  return (
    <div
      className="bg-black border border-gray-700 rounded-xl p-6 shadow-lg 
                    transition transform hover:scale-[1.02] hover:bg-gray-900 
                    hover:border-[#c12129] relative group"
    >
      <h2 className="text-2xl font-bold text-white">{project.title}</h2>
      <p className="text-sm text-gray-400">{project.organization}</p>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
        <span className="bg-[#c12129] text-white text-xs px-2 py-1 rounded shadow-md">
          Project Group
        </span>
      </div>
    </div>
  );
}
