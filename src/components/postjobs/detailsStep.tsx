"use client";

import React, { useMemo } from "react";
import type { Project } from "@/types/project";
import { getTagsForCategory, toggleTagList } from "@/lib/tagPremium";

interface DetailsStepProps {
  project: Project;
  handleChange: (field: keyof Project, value: string | number | null) => void;
  errors: Record<string, string>;
  tags?: string[];
  setTags?: (tags: string[]) => void;
  tagVisibility?: boolean;
}

const CATEGORIES = [
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

export default function DetailsStep({
  project,
  handleChange,
  errors,
  tags = [],
  setTags,
  tagVisibility = false,
}: DetailsStepProps) {

  const suggestedTags = useMemo(() => getTagsForCategory(project.category), [project.category]);

  const toggleTag = (tag: string) => {
    if (!setTags) return;
    const next = toggleTagList(tags, tag, project.category);
    setTags(next);
    try {
      handleChange("tags" as keyof Project, next as unknown as string);
    } catch { }
  };

  // ================= DATE VALIDATION =================
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadline = project.deadline ? new Date(project.deadline) : null;
  const deadlineError = deadline && deadline < today ? "Deadline cannot be in the past." : null;

  return (
    <div className="space-y-6 text-black">

      {/* ================= PROJECT TITLE ================= */}
      <div className="bg-white rounded-lg p-4 ring-1 ring-gray-100 hover:shadow-md transition">
        <label className="block text-sm font-medium text-gray-700">
          Project Title
        </label>
        <input
          value={project.title ?? ""}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Enter project title"
          className={`mt-2 w-full px-3 py-2 rounded-md border ${errors.title ? "border-red-500" : "border-gray-200"} focus:ring-2 focus:ring-[#c21219]`}
        />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
      </div>

      {/* ================= CATEGORY ================= */}
      <div className="bg-white rounded-lg p-4 ring-1 ring-gray-100 hover:shadow-md transition">
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          value={project.category ?? ""}
          onChange={(e) => handleChange("category", e.target.value)}
          className={`mt-2 w-full px-3 py-2 rounded-md border ${errors.category ? "border-red-500" : "border-gray-200"} focus:ring-2 focus:ring-[#c21219]`}
        >
          <option value="">Select category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
      </div>

      {/* ================= DEADLINE / PRIORITY / STATUS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Deadline */}
        <div className="bg-white rounded-lg p-4 ring-1 ring-gray-100 hover:shadow-md transition">
          <label className="text-sm font-medium text-gray-700">Deadline</label>
          <input
            type="date"
            min={today.toISOString().split("T")[0]}
            value={project.deadline ?? ""}
            onChange={(e) => handleChange("deadline", e.target.value)}
            className="mt-2 w-full px-3 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#c21219]"
          />
          {deadlineError && <p className="text-xs text-red-500 mt-1">{deadlineError}</p>}
        </div>

        {/* Priority */}
        <div className="bg-white rounded-lg p-4 ring-1 ring-gray-100 hover:shadow-md transition">
          <label className="text-sm font-medium text-gray-700">Priority</label>
          <select
            value={project.priority ?? ""}
            onChange={(e) => handleChange("priority", e.target.value)}
            className="mt-2 w-full px-3 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#c21219]"
          >
            <option value="">Select priority</option>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg p-4 ring-1 ring-gray-100 hover:shadow-md transition">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select
            value={project.status ?? ""}
            onChange={(e) => handleChange("status", e.target.value)}
            className="mt-2 w-full px-3 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#c21219]"
          >
            <option value="">Select status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
          </select>
        </div>

      </div>

      {/* ================= PROJECT TYPE ================= */}
      <div className="bg-white rounded-lg p-4 ring-1 ring-gray-100 hover:shadow-md transition">
        <label className="block text-sm font-medium text-gray-700">Project Type</label>
        <select
          value={project.type ?? ""}
          onChange={(e) => handleChange("type", e.target.value)}
          className="mt-2 w-full px-3 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#c21219]"
        >
          <option value="select">select</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="Contract">Contract</option>
          <option value="On-site">On-site</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>

      {/* ================= SMART TAGS (PREMIUM ONLY) ================= */}
      {tagVisibility && (
        <div className="bg-white text-red-500 rounded-lg p-4 ring-1 ring-gray-100">
          <label className="text-sm font-medium text-gray-700">Smart Tags</label>
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestedTags.map((tag) => {
              const active = tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  aria-pressed={active}
                  className={`px-3 py-1 rounded-md text-sm border transition ${active
                    ? "bg-[#c21219] text-white border-[#c21219] shadow"
                    : "bg-white border-gray-200 hover:border-[#c21219] hover:scale-[1.03]"
                    }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Smart tags improve consultant discovery and project matching.
          </p>
        </div>
      )}

    </div>
  );
}