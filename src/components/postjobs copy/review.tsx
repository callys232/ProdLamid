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
  images: File[];
}

export default function ReviewStep({
  project,
  purpose,
  extraField,
  errors,
  handleChange,
  setPurpose,
  setExtraField,
  images,
}: ReviewStepProps) {
  return (
    <div className="space-y-6 text-sm text-gray-700">
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
        <div>
          <label className="font-medium">Location</label>
          <input
            type="text"
            value={project.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="w-full px-2 py-1 border rounded-md"
          />
          {errors.location && <p className="text-xs text-[#c21219]">{errors.location}</p>}
        </div>
        <div>
          <label className="font-medium">Deadline</label>
          <input
            type="date"
            value={project.deadline}
            onChange={(e) => handleChange("deadline", e.target.value)}
            className="w-full px-2 py-1 border rounded-md"
          />
          {errors.deadline && <p className="text-xs text-[#c21219]">{errors.deadline}</p>}
        </div>
        <div>
          <label className="font-medium">Priority</label>
          <input
            type="text"
            value={project.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
            className="w-full px-2 py-1 border rounded-md"
          />
          {errors.priority && <p className="text-xs text-[#c21219]">{errors.priority}</p>}
        </div>
        <div>
          <label className="font-medium">Status</label>
          <input
            type="text"
            value={project.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full px-2 py-1 border rounded-md"
          />
          {errors.status && <p className="text-xs text-[#c21219]">{errors.status}</p>}
        </div>
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

      {/* Skills */}
      <div>
        <label className="font-medium">Skills</label>
        <ul className="flex flex-wrap gap-2 mt-1">
          {project.skills?.map((skill, idx) => (
            <li
              key={`skill-${idx}`}
              className="px-2 py-1 bg-red-100 text-[#c21219] rounded-md text-xs font-medium"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>

      {/* Milestones */}
      <div>
        <label className="font-medium">Work Phases</label>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-1">
          {project.milestones?.map((m, idx) => (
            <li key={`milestone-${idx}`}>{m.title} ({m.status})</li>
          ))}
        </ul>
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

      {/* Images */}
      <div>
        <label className="font-medium">Project Images</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {images.map((file, index) => (
            <img
              key={index}
              src={URL.createObjectURL(file)}
              alt={`Project image ${index + 1}`}
              className="w-24 h-24 object-cover rounded-md border"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
