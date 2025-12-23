"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import JobFilter from "./JobFilter";
import JobCarousel from "./JobCarousel";
import JobModal from "./JobModal";

import { Project } from "@/types/project";
import { mockJobs } from "@/mocks/mockJobs";

const DEFAULT_CATEGORIES = [
  "All",
  "Entertainment",
  "Food & Beverages",
  "Art and Culture",
  "Hybrid",
  "Web 3.0",
  "Games",
  "Graphics",
  "Consulting",
  "Video and Animation",
  "Literature",
  "Business",
  "Finance",
];

interface JobProps {
  categories?: string[];
  isRegisteredUser?: boolean;
}

export default function Job({
  categories = DEFAULT_CATEGORIES,
  isRegisteredUser = false,
}: JobProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [allEntities, setAllEntities] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch jobs from API or fallback to mock data
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const res = await axios.get("/api/projects");
        const data: Project[] = res.data?.data || [];
        setAllEntities(data.length ? data : mockJobs);
      } catch (err) {
        console.error("Backend fetch failed, using mock data:", err);
        setAllEntities(mockJobs);
      } finally {
        setLoading(false);
      }
    };
    fetchEntities();
  }, []);

  // ✅ Filter out completed jobs
  const jobs = useMemo(
    () => allEntities.filter((e) => e.status !== "completed"),
    [allEntities]
  );

  // ✅ Filter by category
  const filtered = useMemo(() => {
    if (activeCategory === "All") return jobs;
    return jobs.filter((e) => e.category === activeCategory);
  }, [jobs, activeCategory]);

  // ✅ Count jobs per category
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    categories.forEach((cat) => {
      map[cat] =
        cat === "All"
          ? jobs.length
          : jobs.filter((e) => e.category === cat).length;
    });
    return map;
  }, [categories, jobs]);

  return (
    <div className="p-6 bg-[#0B0F19] text-white font-sans">
      {/* Filter */}
      <JobFilter
        active={activeCategory}
        options={categories}
        counts={counts}
        onChange={setActiveCategory}
        label="Filter jobs"
      />

      {/* Loading / Empty State */}
      {loading ? (
        <p className="text-gray-400 mt-4">Loading jobs...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400 mt-4">
          No jobs available in this category.
        </p>
      ) : (
        <JobCarousel
          title="Open for bidding"
          jobs={filtered}
          onSelect={setSelected}
        />
      )}

      {/* Modal */}
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
