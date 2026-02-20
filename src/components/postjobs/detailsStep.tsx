"use client";
import type { Project } from "@/types/project";

interface DetailsStepProps {
  project: Project;
  handleChange: (field: keyof Project, value: string | number) => void;
  errors: Record<string, string>;
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

const LOCATIONS = ["Remote", "Hybrid", "Full-time", "Part-time", "Contract", "On-site"];

export default function DetailsStep({ project, handleChange, errors }: DetailsStepProps) {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Project Title
        </label>
        <input
          id="title"
          type="text"
          value={project.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${errors.title
              ? "border-red-500 focus:ring-red-500"
              : "border-[#c21219] focus:ring-[#c21219]"
            } focus:outline-none`}
          placeholder="Enter project title"
          required
          aria-describedby={errors.title ? "title-error" : undefined}
        />
        {errors.title && (
          <p id="title-error" className="text-red-500 text-xs mt-1">
            {errors.title}
          </p>
        )}
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Category
        </label>
        <select
          id="category"
          value={project.category}
          onChange={(e) => handleChange("category", e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${errors.category
              ? "border-red-500 focus:ring-red-500"
              : "border-[#c21219] focus:ring-[#c21219]"
            } focus:outline-none`}
          required
          aria-describedby={errors.category ? "category-error" : undefined}
        >
          <option value="">Select category</option>
          {CATEGORIES.map((cat, idx) => (
            <option key={`cat-${idx}`} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <p id="category-error" className="text-red-500 text-xs mt-1">
            {errors.category}
          </p>
        )}
      </div>

      {/* Location */}
      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Location
        </label>
        <select
          id="location"
          value={project.location}
          onChange={(e) => handleChange("location", e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${errors.location
              ? "border-red-500 focus:ring-red-500"
              : "border-[#c21219] focus:ring-[#c21219]"
            } focus:outline-none`}
          required
          aria-describedby={errors.location ? "location-error" : undefined}
        >
          <option value="">Select location</option>
          {LOCATIONS.map((loc, idx) => (
            <option key={`loc-${idx}`} value={loc.toLowerCase()}>
              {loc}
            </option>
          ))}
        </select>
        {errors.location && (
          <p id="location-error" className="text-red-500 text-xs mt-1">
            {errors.location}
          </p>
        )}
      </div>

      {/* Deadline */}
      <div>
        <label
          htmlFor="deadline"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Deadline
        </label>
        <input
          id="deadline"
          type="date"
          value={project.deadline}
          onChange={(e) => handleChange("deadline", e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${errors.deadline
              ? "border-red-500 focus:ring-red-500"
              : "border-[#c21219] focus:ring-[#c21219]"
            } focus:outline-none`}
          required
          aria-describedby={errors.deadline ? "deadline-error" : undefined}
        />
        {errors.deadline && (
          <p id="deadline-error" className="text-red-500 text-xs mt-1">
            {errors.deadline}
          </p>
        )}
      </div>

      {/* Priority */}
      <div>
        <label
          htmlFor="priority"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Priority
        </label>
        <select
          id="priority"
          value={project.priority}
          onChange={(e) => handleChange("priority", e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${errors.priority
              ? "border-red-500 focus:ring-red-500"
              : "border-[#c21219] focus:ring-[#c21219]"
            } focus:outline-none`}
          required
          aria-describedby={errors.priority ? "priority-error" : undefined}
        >
          <option value="">Select priority</option>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
        {errors.priority && (
          <p id="priority-error" className="text-red-500 text-xs mt-1">
            {errors.priority}
          </p>
        )}
      </div>

      {/* Status */}
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Status
        </label>
        <select
          id="status"
          value={project.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${errors.status
              ? "border-red-500 focus:ring-red-500"
              : "border-[#c21219] focus:ring-[#c21219]"
            } focus:outline-none`}
          required
          aria-describedby={errors.status ? "status-error" : undefined}
        >
          <option value="">Select status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        {errors.status && (
          <p id="status-error" className="text-red-500 text-xs mt-1">
            {errors.status}
          </p>
        )}
      </div>
    </div>
  );
}
