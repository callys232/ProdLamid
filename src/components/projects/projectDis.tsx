"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FilterSidebar, { FilterOption } from "../consultants/FilterSidebar";
import ProjectCard from "./projectCard";
import { teamProjects, individualProjects } from "@/mocks/mockClient";
import type { Project } from "@/types/project";

/* -------------------- FILTER TYPE -------------------- */
type ProjectFilters = {
  search: string;
  category: string;
  tech: string;
  location: string;
  budget: string; // ✅ string so "All" works
};

/* -------------------- DEFAULT FILTERS -------------------- */
const defaultFilters: ProjectFilters = {
  search: "",
  category: "All",
  tech: "All",
  location: "All",
  budget: "All",
};

export default function ProjectsSection({
  showSidebar,
}: {
  showSidebar: boolean;
}) {
  const [filters, setFilters] = useState<ProjectFilters>(defaultFilters);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  /* -------------------- FETCH PROJECTS -------------------- */
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();

        if (!data.success) throw new Error(data.message);

        const normalizedProjects: Project[] = (data.data as Project[]).map(
          (p) => ({
            ...p,
            _id: p._id || p.id,
            id: p.id || p._id || "", // ✅ always string
            budget:
              typeof p.budget === "number"
                ? p.budget
                : p.budget !== undefined
                ? Number(p.budget)
                : undefined, // ✅ keep numeric
          })
        );

        setProjects(normalizedProjects);
      } catch {
        const mockProjects: Project[] = [
          ...teamProjects,
          ...individualProjects,
        ].map((p) => ({
          ...p,
          _id: p._id || p.id,
          id: p.id || p._id || "",
        }));
        setProjects(mockProjects);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  /* -------------------- FILTER OPTIONS -------------------- */
  const categories = useMemo(
    () => [
      "All",
      ...new Set(
        projects.map((p) => p.category).filter((c): c is string => !!c)
      ),
    ],
    [projects]
  );

  const techs = useMemo(
    () => [
      "All",
      ...new Set(projects.map((p) => p.tech).filter((t): t is string => !!t)),
    ],
    [projects]
  );

  const locations = useMemo(
    () => [
      "All",
      ...new Set(
        projects.map((p) => p.location).filter((l): l is string => !!l)
      ),
    ],
    [projects]
  );

  /* -------------------- FILTERING LOGIC -------------------- */
  const filteredProjects = useMemo(() => {
    const isDefault =
      JSON.stringify(filters) === JSON.stringify(defaultFilters);
    if (isDefault) return projects;

    const term = filters.search.toLowerCase();
    return projects.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        (p.tech?.toLowerCase().includes(term) ?? false) ||
        (p.organization?.toLowerCase().includes(term) ?? false);

      const matchesCategory =
        filters.category === "All" || p.category === filters.category;
      const matchesTech = filters.tech === "All" || p.tech === filters.tech;
      const matchesLocation =
        filters.location === "All" || p.location === filters.location;
      const matchesBudget =
        filters.budget === "All" ||
        (p.budget !== undefined && Number(p.budget) <= Number(filters.budget));

      return (
        matchesSearch &&
        matchesCategory &&
        matchesTech &&
        matchesLocation &&
        matchesBudget
      );
    });
  }, [projects, filters]);

  /* -------------------- FILTER CONFIG -------------------- */
  const filterConfig: FilterOption<ProjectFilters>[] = [
    { label: "Category", key: "category", options: categories },
    { label: "Technology", key: "tech", options: techs },
    { label: "Location", key: "location", options: locations },
    {
      label: "Budget",
      key: "budget",
      options: ["All", "2000", "3000", "5000"],
    },
  ];

  /* -------------------- RENDER -------------------- */
  if (loading) {
    return (
      <p className="text-center text-gray-400 py-20 text-lg">
        Loading projects...
      </p>
    );
  }

  return (
    <>
      {showSidebar && (
        <aside className="lg:col-span-1">
          <FilterSidebar<ProjectFilters>
            activeTab="projects"
            filters={filters}
            setFilters={setFilters}
            filterConfigs={filterConfig}
            showClearButton={
              JSON.stringify(filters) !== JSON.stringify(defaultFilters)
            }
            handleClearFilters={() => setFilters(defaultFilters)}
          />
        </aside>
      )}

      <main className={showSidebar ? "lg:col-span-3" : "lg:col-span-4"}>
        <h2 className="text-2xl font-bold mb-6">Projects</h2>
        <AnimatePresence mode="wait">
          <motion.div
            key="projects"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.map((p) => (
                  <motion.div key={p.id} layout>
                    <ProjectCard project={p} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 mt-10">
                <p>No projects found matching your filters.</p>
                <button
                  onClick={() => setFilters(defaultFilters)}
                  className="mt-4 bg-red-600 px-4 py-2 rounded-md font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  );
}
