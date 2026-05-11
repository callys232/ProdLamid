// ProjectsSection.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FilterSidebar, { FilterOption } from "../../consultants/FilterSidebar";
import ProjectCard from "./resultcard";
import AIProjectEntry from "./projectEntry";
import { getProjects } from "@/lib/api/projectApi";
import type { Project } from "@/types/project";
import type { ProjectMatchResult } from "@/types/aiProjectmatch";

/* -------------------- FILTER TYPE -------------------- */
type ProjectFilters = {
    search: string;
    category: string;
    tech: string;
    location: string;
    budget: string;
};

/* -------------------- DEFAULT FILTERS -------------------- */
const defaultFilters: ProjectFilters = {
    search: "",
    category: "All",
    tech: "All",
    location: "All",
    budget: "All",
};

/* -------------------- PROPS -------------------- */
interface ProjectsSectionProps {
    showSidebar: boolean;
    isPremiumUser: boolean;
}

/* -------------------- HELPER -------------------- */
function isDefaultFilters(a: ProjectFilters, b: ProjectFilters) {
    return (
        a.search === b.search &&
        a.category === b.category &&
        a.tech === b.tech &&
        a.location === b.location &&
        a.budget === b.budget
    );
}

/* -------------------- CONFIG -------------------- */
const PAGE_LIMIT = 12;

export default function ProjectsSection({
    showSidebar,
    isPremiumUser,
}: ProjectsSectionProps) {
    /* ---------------- STATE -------------------- */
    const [filters, setFilters] = useState<ProjectFilters>(defaultFilters);
    const [projects, setProjects] = useState<Project[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>(filters.search);
    const [aiResults, setAiResults] = useState<ProjectMatchResult[] | null>(null);

    const abortRef = useRef<AbortController | null>(null);
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    /* ---------------- NORMALIZE PROJECT -------------------- */
    const normalize = useCallback((raw: any): Project => {
        const budgetNum =
            typeof raw.budget === "number"
                ? raw.budget
                : raw.budget
                    ? Number(raw.budget)
                    : undefined;

        return {
            ...raw,
            _id: raw._id || raw.id,
            id: raw.id || raw._id || `${raw._id ?? ""}${raw.id ?? ""}${Math.random()}`,
            title: raw.title ?? "Untitled Project",
            category: raw.categories ?? raw.category ?? "Unspecified",
            tech: raw.tech ?? "Unspecified",
            location: raw.location ?? "Remote",
            organization: raw.organization ?? "",
            budget: Number.isFinite(budgetNum) ? budgetNum : undefined,
            description: raw.description ?? "",
            type: raw.type ?? "",
        } as Project;
    }, []);

    /* ---------------- FETCH PAGE -------------------- */
    const prevLength = (prev: Project[]) => (Array.isArray(prev) ? prev.length : 0);

    const fetchPage = useCallback(
        async ({ page: p, replace = false }: { page: number; replace?: boolean }) => {
            if (abortRef.current) abortRef.current.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            try {
                if (p === 1) setLoadingInitial(true);
                else setLoading(true);
                setError(null);

                const res = await getProjects({
                    scope: "browse",
                    page: p,
                    limit: PAGE_LIMIT,
                    filters,
                    signal: controller.signal,
                } as any);

                const data = (res as any)?.data ?? res ?? [];
                const totalCount = (res as any)?.total ?? (Array.isArray(res) ? res.length : null);
                const normalized: Project[] = (data || []).map(normalize);

                setTotal((prev) => (totalCount !== null ? totalCount : prev));
                setProjects((prev) => (replace ? normalized : [...prev, ...normalized]));

                if (totalCount !== null) {
                    const loaded = replace ? normalized.length : prevLength(projects) + normalized.length;
                    setHasMore(loaded < totalCount);
                } else {
                    setHasMore((normalized.length ?? 0) >= PAGE_LIMIT);
                }
            } catch (err: any) {
                if (err?.name === "AbortError") return;
                setError("Failed to load projects. Projects list may be incomplete.");
            } finally {
                setLoading(false);
                setLoadingInitial(false);
            }
        },
        [filters, normalize]
    );

    /* ---------------- FILTER CHANGE EFFECT -------------------- */
    useEffect(() => {
        setPage(1);
        setHasMore(true);
        setProjects([]);
        setAiResults(null);
        fetchPage({ page: 1, replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]); // fetchPage is stable now

    /* ---------------- PAGE CHANGE EFFECT -------------------- */
    useEffect(() => {
        if (page === 1) return;
        fetchPage({ page, replace: false });
    }, [page, fetchPage]);

    /* ---------------- DEBOUNCE SEARCH -------------------- */
    useEffect(() => {
        const t = setTimeout(() => {
            setFilters((prev) => ({ ...prev, search: searchTerm }));
        }, 300);
        return () => clearTimeout(t);
    }, [searchTerm]);

    /* ---------------- INFINITE SCROLL -------------------- */
    useEffect(() => {
        if (!sentinelRef.current) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry?.isIntersecting && hasMore && !loading) setPage((p) => p + 1);
            },
            { root: null, rootMargin: "200px", threshold: 0.1 }
        );

        observerRef.current.observe(sentinelRef.current);
        return () => observerRef.current?.disconnect();
    }, [hasMore, loading]);

    /* ---------------- DERIVE FILTER OPTIONS -------------------- */
    const categories = useMemo(
        () => ["All", ...Array.from(new Set(projects.map((p) => p.category).filter((val): val is string => !!val)))],
        [projects]
    );

    const techs = useMemo(
        () => ["All", ...Array.from(new Set(projects.map((p) => p.tech).filter((val): val is string => !!val)))],
        [projects]
    );

    const locations = useMemo(
        () => ["All", ...Array.from(new Set(projects.map((p) => p.location).filter((val): val is string => !!val)))],
        [projects]
    );

    const filterConfig: FilterOption<ProjectFilters>[] = useMemo(
        () => [
            { label: "Category", key: "category", options: categories },
            { label: "Technology", key: "tech", options: techs },
            { label: "Location", key: "location", options: locations },
            { label: "Budget", key: "budget", options: ["All", "2000", "3000", "5000"] },
        ],
        [categories, techs, locations]
    );

    /* ---------------- FILTERED PROJECTS -------------------- */
    const filteredProjects = useMemo(() => {
        return projects.filter((p) => {
            const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = filters.category === "All" || p.category === filters.category;
            const matchesTech = filters.tech === "All" || p.tech === filters.tech;
            const matchesLocation = filters.location === "All" || p.location === filters.location;
            const matchesBudget =
                filters.budget === "All" || (p.budget && p.budget <= Number(filters.budget));
            return matchesSearch && matchesCategory && matchesTech && matchesLocation && matchesBudget;
        });
    }, [projects, filters, searchTerm]);

    /* ---------------- BUILD AI PAYLOAD -------------------- */
    const buildAIPayload = useCallback(() => ({ filters, projects: filteredProjects }), [
        filters,
        filteredProjects,
    ]);

    const handleAiResults = useCallback((data: any) => {
        const payload = Array.isArray(data) ? data : data?.data;
        if (Array.isArray(payload)) {
            setAiResults(payload as ProjectMatchResult[]);
            return;
        }
        setAiResults([]);
    }, []);

    /* ---------------- HELPERS -------------------- */
    const clearFilters = useCallback(() => {
        setFilters(defaultFilters);
        setSearchTerm("");
    }, []);

    const retry = useCallback(() => {
        setError(null);
        fetchPage({ page: 1, replace: true });
    }, [fetchPage]);

    /* ---------------- RENDER -------------------- */
    return (
        <div className="grid lg:grid-cols-4 gap-6">
            {showSidebar && (
                <aside className="lg:col-span-1">
                    <FilterSidebar<ProjectFilters>
                        activeTab="projects"
                        filters={filters}
                        setFilters={setFilters}
                        filterConfigs={filterConfig}
                        showClearButton={!isDefaultFilters(filters, defaultFilters)}
                        handleClearFilters={clearFilters}
                    />
                </aside>
            )}

            <main className={showSidebar ? "lg:col-span-3" : "lg:col-span-4"}>
                {/* HEADER + SEARCH + AI */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                    <div>
                        <h2 className="text-2xl font-bold text-red-500">Browse Projects</h2>
                        <p className="text-sm text-gray-500">
                            Explore available projects and use AI to find the best matches.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* <label htmlFor="project-search" className="sr-only">
                            Search projects
                        </label>
                        <input
                            id="project-search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search projects, categories, tech..."
                            className="px-3 py-2 border rounded-md border-gray-200 focus:ring-2 focus:ring-[#c12129] focus:outline-none"
                        /> */}
                        <AIProjectEntry
                            isPremiumUser={isPremiumUser}
                            buildPayload={buildAIPayload}
                            onResults={handleAiResults}
                        />
                    </div>
                </div>

                {/* PROJECT LIST */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`projects-${filters.search}-${filters.category}-${filters.tech}-${filters.location}-${filters.budget}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {aiResults && aiResults.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {aiResults.map((r) => (
                                    <motion.div key={r.project.id} layout>
                                        <ProjectCard
                                            result={r as any}
                                            selected={false}
                                            onSelect={() => { }}
                                            onApply={async () => { }}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        ) : filteredProjects.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {filteredProjects.map((p) => (
                                        <motion.div key={p.id} layout>
                                            <ProjectCard
                                                result={{
                                                    project: {
                                                        id: p.id,
                                                        title: p.title,
                                                        description: p.description || "",
                                                        skills: p.skills || [],
                                                        categories: p.category,
                                                        budget: p.budget,
                                                        hourlyRate: p.hourlyRate,
                                                        type: p.type as any,
                                                        location: p.location,
                                                        createdAt: p.createdAt
                                                    },
                                                    score: {
                                                        total: 0.75,
                                                        skillMatch: 0.8,
                                                        semantic: 0.7,
                                                        experience: 0.6,
                                                        rating: 0.9,
                                                        recency: 0.8,
                                                        matchedSkills: [],
                                                        missingSkills: [],
                                                        reasons: [],
                                                        reliability: 0.8
                                                    }
                                                }}
                                                selected={false}
                                                onSelect={() => { }}
                                                onApply={async () => { }}
                                            />
                                        </motion.div>
                                    ))}
                                </div>

                                {/* sentinel for infinite scroll */}
                                <div ref={sentinelRef} className="h-6" />

                                {/* loading more indicator */}
                                {loading && (
                                    <div className="text-center py-6">
                                        <p className="text-gray-500">Loading more projects...</p>
                                    </div>
                                )}

                                {/* no more projects */}
                                {!hasMore && (
                                    <div className="text-center text-gray-400 mt-6">
                                        <p>No more projects.</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center text-gray-400 mt-10">
                                {error && <p className="text-red-500 mb-4">{error}</p>}
                                <p>No projects found matching your filters.</p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-4 bg-red-600 px-4 py-2 rounded-md font-semibold hover:bg-red-700"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
