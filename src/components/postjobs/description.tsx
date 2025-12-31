"use client";
import type { Project } from "@/types/project";

interface DescriptionStepProps {
  project: Project;
  handleChange: (field: keyof Project, value: string) => void;
  skillInput: string;
  setSkillInput: (val: string) => void;
  addSkill: () => void;
  removeSkill: (index: number) => void;
  milestoneInput: string;
  setMilestoneInput: (val: string) => void;
  addMilestone: () => void;
  removeMilestone: (index: number) => void;
  errors: Record<string, string>; // ✅ new prop for validation errors
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
  return (
    <>
      {/* Description */}
      <div>
        <label className="block text-sm mb-1">Description</label>
        <textarea
          aria-label="description"
          value={project.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${
            errors.description
              ? "border-red-500 focus:ring-red-500"
              : "border-[#c21219] focus:ring-[#c21219]"
          }`}
          rows={4}
          required
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm mb-1">Skills</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded-md border border-[#c21219] focus:ring-2 focus:ring-[#c21219]"
            placeholder="Add a skill..."
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-4 py-2 bg-[#c21219] hover:bg-red-700 text-white rounded-md"
          >
            Add
          </button>
        </div>
        <ul className="flex flex-wrap gap-2">
          {project.skills?.map((skill, idx) => (
            <li
              key={idx}
              className="flex items-center gap-2 px-2 py-1 bg-red-100 text-[#c21219] rounded-md text-xs font-medium"
            >
              {skill}
              <button
                type="button"
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
        <label className="block text-sm mb-1">Milestones</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={milestoneInput}
            onChange={(e) => setMilestoneInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded-md border border-[#c21219] focus:ring-2 focus:ring-[#c21219]"
            placeholder="Add a milestone..."
          />
          <button
            type="button"
            onClick={addMilestone}
            className="px-4 py-2 bg-[#c21219] hover:bg-red-700 text-white rounded-md"
          >
            Add
          </button>
        </div>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {project.milestones?.map((m, idx) => (
            <li key={idx} className="flex items-center gap-2">
              {m.title}
              <button
                type="button"
                onClick={() => removeMilestone(idx)}
                className="text-gray-600 hover:text-red-600 text-xs"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
