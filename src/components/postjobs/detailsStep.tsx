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
  const categories = [
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

  const locations = ["Remote", "In‑Person", "Hybrid"];

  return (
    <>
      <div>
        <label className="block text-sm mb-1">Project Title</label>
        <input
          aria-label="title"
          type="text"
          value={project.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${errors.title
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
        <select
          aria-label="category"
          value={project.category}
          onChange={(e) => handleChange("category", e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${errors.category
            ? "border-red-500 focus:ring-red-500"
            : "border-[#c21219] focus:ring-[#c21219]"
            }`}
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500 text-xs mt-1">{errors.category}</p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1">Location</label>
        <select
          aria-label="location"
          value={project.location}
          onChange={(e) => handleChange("location", e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${errors.location
            ? "border-red-500 focus:ring-red-500"
            : "border-[#c21219] focus:ring-[#c21219]"
            }`}
        >
          <option value="">Select location</option>
          {locations.map((loc) => (
            <option key={loc} value={loc.toLowerCase()}>
              {loc}
            </option>
          ))}
        </select>
        {errors.location && (
          <p className="text-red-500 text-xs mt-1">{errors.location}</p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1">Deadline</label>
        <input
          aria-label="date"
          type="date"
          value={project.deadline}
          onChange={(e) => handleChange("deadline", e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${errors.deadline
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
          aria-label="priority"
          value={project.priority}
          onChange={(e) => handleChange("priority", e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${errors.priority
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
          className={`w-full px-3 py-2 rounded-md border ${errors.status
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
