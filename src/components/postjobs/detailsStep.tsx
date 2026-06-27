"use client";
import type { Project } from "@/types/project";

interface DetailsStepProps {
  project: Project;
  handleChange: (field: keyof Project, value: string) => void;
  errors: Record<string, string>;
}

export default function DetailsStep({
  project,
  handleChange,
  errors,
}: DetailsStepProps) {
  return (
    <>
      <div>
        <label className="block text-sm mb-1">Title</label>
        <input
          aria-label="tit"
          type="text"
          value={project.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${
            errors.title
              ? "border-red-500 focus:ring-red-500"
              : "border-[#c21219] focus:ring-[#c21219]"
          }`}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1">Category</label>
        <input
          aria-label="category"
          type="text"
          value={project.category}
          onChange={(e) => handleChange("category", e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${
            errors.category
              ? "border-red-500 focus:ring-red-500"
              : "border-[#c21219] focus:ring-[#c21219]"
          }`}
        />
        {errors.category && (
          <p className="text-red-500 text-xs mt-1">{errors.category}</p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1">Location</label>
        <input
          aria-label="location"
          type="text"
          value={project.location}
          onChange={(e) => handleChange("location", e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-[#c21219] focus:ring-[#c21219]"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Deadline</label>
        <input
          aria-label="date"
          type="date"
          value={project.deadline}
          onChange={(e) => handleChange("deadline", e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${
            errors.deadline
              ? "border-red-500 focus:ring-red-500"
              : "border-[#c21219] focus:ring-[#c21219]"
          }`}
        />
        {errors.deadline && (
          <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1">Priority</label>
        <select
          aria-label="proiorty"
          value={project.priority}
          onChange={(e) => handleChange("priority", e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${
            errors.priority
              ? "border-red-500 focus:ring-red-500"
              : "border-[#c21219] focus:ring-[#c21219]"
          }`}
        >
          <option value="">Select priority</option>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
        {errors.priority && (
          <p className="text-red-500 text-xs mt-1">{errors.priority}</p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1">Status</label>
        <select
          aria-label="status"
          value={project.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${
            errors.status
              ? "border-red-500 focus:ring-red-500"
              : "border-[#c21219] focus:ring-[#c21219]"
          }`}
        >
          <option value="">Select status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        {errors.status && (
          <p className="text-red-500 text-xs mt-1">{errors.status}</p>
        )}
      </div>
    </>
  );
}
