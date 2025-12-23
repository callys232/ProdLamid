"use client";

import { useEffect, useState } from "react";

export interface Project {
  _id: string;
  title: string;
  category: string;
  tech: string;
  location: string;
  budget: number;
  organization?: string;
  image?: string;
}

export default function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();

        if (!data.success) throw new Error(data.message);

        setProjects(data.data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch projects"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return { projects, loading, error };
}
