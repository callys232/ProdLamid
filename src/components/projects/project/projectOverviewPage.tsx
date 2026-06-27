"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Project } from "@/types/project";
import ProjectOverview from "./projectOverview";
import { teamProjects, individualProjects } from "@/mocks/mockClient";

export default function ProjectOverviewPage() {
  // useParams may return undefined, so we type it as possibly undefined
  const params = useParams();
  const id = params?.id;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setProject(null);
      return;
    }

    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${id}`);
        const data = await res.json();
        setProject(data.project ?? null);
      } catch {
        const fallback = [...teamProjects, ...individualProjects].find(
          (p) => p.id === id || p._id === id
        );
        setProject(fallback || null);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <p className="text-center text-gray-400 py-20">Loading project...</p>
    );
  }

  if (!project) {
    return (
      <p className="text-center text-gray-400 py-20">Project not found.</p>
    );
  }

  return <ProjectOverview project={project} variant="modal" />;
}
