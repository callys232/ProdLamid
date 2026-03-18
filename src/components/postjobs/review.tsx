"use client";

import { useEffect } from "react";
import type { Project, WorkPhase, Milestone } from "@/types/project";

interface ReviewStepProps {
  project: Project;
  purpose: string;
  extraField: string;
  images: File[];
  errors: Record<string, string>;
  handleChange: (field: keyof Project, value: string | number | null) => void;
  setPurpose: (val: string) => void;
  setExtraField: (val: string) => void;
  phases: WorkPhase[];
  milestones: Milestone[];
  tags: string[];
  premiumUser?: boolean;
}

export default function ReviewStep({
  project,
  purpose,
  extraField,
  images,
  errors,
  handleChange,
  setPurpose,
  setExtraField,
  phases,
  milestones,
  tags,
  premiumUser,
}: ReviewStepProps) {
  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      images.forEach((file) => URL.revokeObjectURL(file));
    };
  }, [images]);

  // Define all main project input fields
  const projectFields: {
    key: keyof Project;
    label: string;
    type?: "text" | "number" | "date";
  }[] = [
      { key: "title", label: "Title" },
      { key: "category", label: "Category" },
      { key: "location", label: "Location" },
      { key: "deadline", label: "Deadline", type: "date" },
      { key: "priority", label: "Priority" },
      { key: "status", label: "Status" },
      { key: "budget", label: "Budget", type: "number" },
      { key: "hourlyRate", label: "Hourly Rate", type: "number" },
    ];

  return (
    <div className="space-y-6 text-sm text-gray-700">
      <h3 className="text-lg font-semibold text-[#c21219]">
        Review and edit your project before posting
      </h3>

      {/* Project Core Details */}
      <div className="grid grid-cols-2 gap-4">
        {projectFields.map(({ key, label, type }) => (
          <div key={key as string}>
            <label className="font-medium">{label}</label>
            <input
              type={type || "text"}
              value={project[key] ?? ""}
              onChange={(e) =>
                handleChange(
                  key,
                  type === "number"
                    ? e.target.value
                      ? Number(e.target.value)
                      : null
                    : e.target.value
                )
              }
              className="w-full px-2 py-1 border rounded-md"
            />
            {errors[key as string] && (
              <p className="text-xs text-[#c21219]">{errors[key as string]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Description */}
      <div>
        <label className="font-medium">Description</label>
        <textarea
          value={project.description ?? ""}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full px-2 py-1 border rounded-md"
        />
        {errors.description && (
          <p className="text-xs text-[#c21219]">{errors.description}</p>
        )}
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

      {/* Purpose & Extra Fields */}
      <div>
        <label className="font-medium">Purpose</label>
        <textarea
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="w-full px-2 py-1 border rounded-md"
        />
        {errors.purpose && (
          <p className="text-xs text-[#c21219]">{errors.purpose}</p>
        )}
      </div>

      {premiumUser && (
        <div>
          <label className="font-medium">Extra Field</label>
          <input
            type="text"
            value={extraField}
            onChange={(e) => setExtraField(e.target.value)}
            className="w-full px-2 py-1 border rounded-md"
          />
          {errors.extraField && (
            <p className="text-xs text-[#c21219]">{errors.extraField}</p>
          )}
        </div>
      )}

      {/* Project Images */}
      <div>
        <label className="font-medium">Project Images</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {images?.map((file, index) => (
            <img
              key={index}
              src={URL.createObjectURL(file)}
              alt={`Project image ${index + 1}`}
              className="w-24 h-24 object-cover rounded-md border"
            />
          ))}
        </div>
      </div>

      {/* Work Phases */}
      <div>
        <label className="font-medium">Work Phases</label>
        <ul className="flex flex-col gap-2 mt-1">
          {phases.map((phase) => (
            <li key={phase.id ?? phase.name} className="p-2 border rounded-md">
              <p className="font-medium">{phase.name}</p>
              {phase.description && <p className="text-xs">{phase.description}</p>}
              {phase.duration && <p className="text-xs">Duration: {phase.duration}</p>}
              {phase.status && <p className="text-xs">Status: {phase.status}</p>}
            </li>
          ))}
        </ul>
      </div>

      {/* Milestones */}
      <div>
        <label className="font-medium">Milestones</label>
        <ul className="flex flex-col gap-2 mt-1">
          {milestones.map((ms) => (
            <li key={ms.id ?? ms.title} className="p-2 border rounded-md">
              <p className="font-medium">{ms.title}</p>
              {ms.description && <p className="text-xs">{ms.description}</p>}
              {ms.amount !== undefined && <p className="text-xs">Amount: {ms.amount}</p>}
              {ms.dueDate && <p className="text-xs">Due: {ms.dueDate}</p>}
              {ms.status && <p className="text-xs">Status: {ms.status}</p>}
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <label className="font-medium">Tags</label>
          <ul className="flex flex-wrap gap-2 mt-1">
            {tags.map((tag, idx) => (
              <li
                key={`tag-${idx}`}
                className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs font-medium"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}