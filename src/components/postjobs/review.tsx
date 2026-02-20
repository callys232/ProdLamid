"use client";
import type { Project } from "@/types/project";

interface ReviewStepProps {
  project: Project;
  purpose: string;
  extraField: string;
  errors: Record<string, string>;
  handleChange: (field: keyof Project, value: string | number) => void;
  setPurpose: (val: string) => void;
  setExtraField: (val: string) => void;
}

export default function ReviewStep({
  project,
  purpose,
  extraField,
  errors,
  handleChange,
  setPurpose,
  setExtraField,
}: ReviewStepProps) {
  return (
    <div className="space-y-4 text-sm text-gray-700">
      <h3 className="text-lg font-semibold text-[#c21219]">
        Review and edit your project before posting
      </h3>

      {/* Core Details */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-medium">Title</label>
          <input
            type="text"
            value={project.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full px-2 py-1 border rounded-md"
          />
          {errors.title && <p className="text-xs text-[#c21219]">{errors.title}</p>}
        </div>
        <div>
          <label className="font-medium">Category</label>
          <input
            type="text"
            value={project.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full px-2 py-1 border rounded-md"
          />
          {errors.category && <p className="text-xs text-[#c21219]">{errors.category}</p>}
        </div>
        {/* Repeat for location, deadline, priority, status */}
      </div>

      {/* Budget */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-medium">Budget</label>
          <input
            type="number"
            value={project.budget}
            onChange={(e) => handleChange("budget", e.target.value)}
            className="w-full px-2 py-1 border rounded-md"
          />
          {errors.budget && <p className="text-xs text-[#c21219]">{errors.budget}</p>}
        </div>
        <div>
          <label className="font-medium">Hourly Rate</label>
          <input
            type="number"
            value={project.hourlyRate}
            onChange={(e) => handleChange("hourlyRate", e.target.value)}
            className="w-full px-2 py-1 border rounded-md"
          />
          {errors.hourlyRate && <p className="text-xs text-[#c21219]">{errors.hourlyRate}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="font-medium">Description</label>
        <textarea
          value={project.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full px-2 py-1 border rounded-md"
        />
        {errors.description && <p className="text-xs text-[#c21219]">{errors.description}</p>}
      </div>

      {/* Extras */}
      <div>
        <label className="font-medium">Purpose</label>
        <textarea
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="w-full px-2 py-1 border rounded-md"
        />
        {errors.purpose && <p className="text-xs text-[#c21219]">{errors.purpose}</p>}
      </div>
      <div>
        <label className="font-medium">Extra Field</label>
        <input
          type="text"
          value={extraField}
          onChange={(e) => setExtraField(e.target.value)}
          className="w-full px-2 py-1 border rounded-md"
        />
        {errors.extraField && <p className="text-xs text-[#c21219]">{errors.extraField}</p>}
      </div>
    </div>
  );
}
