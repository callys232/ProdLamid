"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import JobFilter from "./JobFilter";
import JobCarousel from "./JobCarousel";
import JobModal from "./JobModal";

import { Project } from "@/types/project";
import { mockJobs } from "@/mocks/mockJobs";

interface JobProps {
  isRegisteredUser?: boolean;
}

export default function Job({ isRegisteredUser = false }: JobProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [allEntities, setAllEntities] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const res = await axios.get("/api/projects?scope=browse");
        const apiData: Project[] = res.data?.data || [];

        // Merge API data with mock jobs — API records take priority on ID clash
        const apiIds = new Set(apiData.map((p) => p._id ?? p.id));
        const merged = [
          ...apiData,
          ...mockJobs.filter((m) => !apiIds.has(m._id ?? m.id)),
        ];
        setAllEntities(merged);
      } catch {
        setAllEntities(mockJobs);
      } finally {
        setLoading(false);
      }
    };
    fetchEntities();
  }, []);

  // Filter out completed jobs
  const jobs = useMemo(
    () => allEntities.filter((e) => e.status !== "completed"),
    [allEntities]
  );

  // Derive categories directly from loaded data so they always match
  const categories = useMemo(() => {
    const cats = new Set<string>();
    jobs.forEach((j) => { if (j.category) cats.add(j.category); });
    return ["All", ...Array.from(cats).sort()];
  }, [jobs]);

  // Filter by active category
  const filtered = useMemo(() => {
    if (activeCategory === "All") return jobs;
    return jobs.filter((e) => e.category === activeCategory);
  }, [jobs, activeCategory]);

  // Count per category
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    categories.forEach((cat) => {
      map[cat] = cat === "All"
        ? jobs.length
        : jobs.filter((e) => e.category === cat).length;
    });
    return map;
  }, [categories, jobs]);

  // Reset to "All" if selected category has no jobs after data loads
  useEffect(() => {
    if (!loading && activeCategory !== "All" && (counts[activeCategory] ?? 0) === 0) {
      setActiveCategory("All");
    }
  }, [loading, counts, activeCategory]);

  return (
    <div className="p-6 bg-[#0B0F19] text-white font-sans">
      <JobFilter
        active={activeCategory}
        options={categories}
        counts={counts}
        onChange={setActiveCategory}
        label="Filter jobs"
      />

      {loading ? (
        <div className="mt-8 flex items-center gap-3 text-gray-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          Loading jobs…
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">
          No jobs available in this category.
        </p>
      ) : (
        <JobCarousel
          title="Open for bidding"
          jobs={filtered}
          onSelect={setSelected}
        />
      )}

      {selected && (
        <JobModal
          job={selected}
          isRegisteredUser={isRegisteredUser}
          onClose={() => setSelected(null)}
          onApply={(job) => console.log("Apply:", job)}
          onBid={(job, amount) => console.log("Bid:", job, amount)}
        />
      )}
    </div>
  );
}
