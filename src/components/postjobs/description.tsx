"use client";
import { useState } from "react";
import type { Project } from "@/types/project";

interface DescriptionStepProps {
  project: Project;
  handleChange: (field: keyof Project, value: string | number) => void;
  skillInput: string;
  setSkillInput: (val: string) => void;
  addSkill: () => void;
  removeSkill: (index: number) => void;
  milestoneInput: string;
  setMilestoneInput: (val: string) => void;
  addMilestone: () => void;
  removeMilestone: (index: number) => void;
  errors: Record<string, string>;
}

export default function DescriptionStep({
  project,
  handleChange,
  skillInput,
  setSkillInput,
  addSkill,
  removeSkill,
  milestoneInput,
  setMilestoneInput,
  addMilestone,
  removeMilestone,
  errors,
}: DescriptionStepProps) {
  // Local error state for duplicates
  const [localError, setLocalError] = useState<{ skill?: string; milestone?: string }>({});

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;

    if (project.skills?.includes(trimmed)) {
      setLocalError({ skill: "This skill has already been added." });
      return;
    }

    addSkill();
    setLocalError({}); // clear error
  };

  const handleAddMilestone = () => {
    const trimmed = milestoneInput.trim();
    if (!trimmed) return;

    if (
      project.milestones?.some(
        (m) => m.title.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      setLocalError({ milestone: "This milestone has already been added." });
      return;
    }

    addMilestone();
    setLocalError({});
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Project Description
        </label>
        <textarea
          id="description"
          aria-label="Project description"
          aria-describedby={errors.description ? "desc-error" : undefined}
          value={project.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${errors.description
            ? "border-red-500 focus:ring-red-500"
            : "border-[#c21219] focus:ring-[#c21219]"
            } focus:outline-none`}
          rows={4}
          placeholder="Describe your project in detail..."
          required
        />
        {errors.description && (
          <p id="desc-error" className="text-red-500 text-xs mt-1">
            {errors.description}
          </p>
        )}
      </div>

      {/* Skills */}
      <div>
        <label
          htmlFor="skills"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Skills
        </label>
        <div className="flex gap-2 mb-2">
          <input
            id="skills"
            type="text"
            value={skillInput}
            onChange={(e) => {
              setSkillInput(e.target.value);
              setLocalError({}); // clear error when typing
            }}
            className="flex-1 px-3 py-2 rounded-md border border-[#c21219] focus:ring-2 focus:ring-[#c21219] focus:outline-none"
            placeholder="e.g., React, TailwindCSS"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            disabled={!skillInput.trim()}
            className={`px-4 py-2 rounded-md text-white ${skillInput.trim()
              ? "bg-[#c21219] hover:bg-red-700"
              : "bg-gray-300 cursor-not-allowed"
              }`}
          >
            Add
          </button>
        </div>
        {localError.skill && (
          <p className="text-red-500 text-xs mt-1">{localError.skill}</p>
        )}
        <ul className="flex flex-wrap gap-2">
          {project.skills?.map((skill, idx) => (
            <li
              key={`skill-${idx}`}
              className="flex items-center gap-2 px-2 py-1 bg-red-100 text-[#c21219] rounded-md text-xs font-medium"
            >
              {skill}
              <button
                type="button"
                aria-label={`Remove skill ${skill}`}
                onClick={() => removeSkill(idx)}
                className="text-gray-600 hover:text-red-600"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Milestones */}
      <div>
        <label
          htmlFor="milestones"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Work Phases
        </label>
        <div className="flex gap-2 mb-2">
          <input
            id="milestones"
            type="text"
            value={milestoneInput}
            onChange={(e) => {
              setMilestoneInput(e.target.value);
              setLocalError({});
            }}
            className="flex-1 px-3 py-2 rounded-md border border-[#c21219] focus:ring-2 focus:ring-[#c21219] focus:outline-none"
            placeholder="e.g., Design, Development, Testing"
          />
          <button
            type="button"
            onClick={handleAddMilestone}
            disabled={!milestoneInput.trim()}
            className={`px-4 py-2 rounded-md text-white ${milestoneInput.trim()
              ? "bg-[#c21219] hover:bg-red-700"
              : "bg-gray-300 cursor-not-allowed"
              }`}
          >
            Add
          </button>
        </div>
        {localError.milestone && (
          <p className="text-red-500 text-xs mt-1">{localError.milestone}</p>
        )}
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          {project.milestones?.map((m, idx) => (
            <li key={`milestone-${idx}`} className="flex items-center gap-2">
              {m.title}
              <button
                type="button"
                aria-label={`Remove milestone ${m.title}`}
                onClick={() => removeMilestone(idx)}
                className="text-gray-600 hover:text-red-600 text-xs"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}