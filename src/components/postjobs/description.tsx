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
  errors: Record<string, string>;
}

export default function DescriptionStep({
  project, handleChange,
  skillInput, setSkillInput, addSkill, removeSkill,
  milestoneInput, setMilestoneInput, addMilestone, removeMilestone,
  errors,
}: DescriptionStepProps) {
  const onSkillKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); addSkill(); }
  };
  const onMilestoneKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); addMilestone(); }
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="group">
        <label className="pj-label">Project Description</label>
        <textarea
          value={project.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Describe scope, objectives, and expected outcomes..."
          rows={4}
          className={`pj-field resize-none${errors.description ? " pj-error" : ""}`}
        />
        <div className="flex items-center justify-between mt-1">
          {errors.description
            ? <p className="pj-error-msg">{errors.description}</p>
            : <span />}
          <span className="text-xs text-gray-400 ml-auto">
            {project.description?.length ?? 0} chars
          </span>
        </div>
      </div>

      {/* Skills */}
      <div className="group">
        <label className="pj-label">Required Skills</label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={onSkillKey}
            placeholder="Type a skill and press Enter..."
            className="pj-field flex-1"
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-4 py-2 bg-[#2563EB] text-white text-sm font-semibold rounded-lg
                       transition-all duration-150 hover:bg-blue-700 hover:shadow-md active:scale-95 whitespace-nowrap"
          >
            + Add
          </button>
        </div>
        {project.skills && project.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill, idx) => (
              <span
                key={idx}
                className="pj-tag-enter inline-flex items-center gap-1.5 px-3 py-1.5
                           bg-white border border-gray-200 text-gray-700 rounded-full text-xs font-medium
                           transition-all duration-150 hover:border-blue-300 hover:text-[#2563EB] hover:scale-105"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(idx)}
                  className="w-3.5 h-3.5 flex items-center justify-center rounded-full
                             text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors duration-150 text-base leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Milestones */}
      <div className="group">
        <label className="pj-label">Milestones</label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={milestoneInput}
            onChange={(e) => setMilestoneInput(e.target.value)}
            onKeyDown={onMilestoneKey}
            placeholder="Type a milestone and press Enter..."
            className="pj-field flex-1"
          />
          <button
            type="button"
            onClick={addMilestone}
            className="px-4 py-2 bg-[#2563EB] text-white text-sm font-semibold rounded-lg
                       transition-all duration-150 hover:bg-blue-700 hover:shadow-md active:scale-95 whitespace-nowrap"
          >
            + Add
          </button>
        </div>
        {project.milestones && project.milestones.length > 0 && (
          <div className="space-y-2">
            {project.milestones.map((m, idx) => (
              <div
                key={idx}
                className="pj-tag-enter flex items-center justify-between px-4 py-2.5
                           bg-white border border-gray-200 rounded-lg text-sm text-gray-700
                           transition-all duration-150 hover:border-blue-200 hover:shadow-sm group/ms"
              >
                <span className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center
                                   text-xs font-bold text-gray-500
                                   group-hover/ms:bg-blue-50 group-hover/ms:text-[#2563EB] transition-colors duration-150">
                    {idx + 1}
                  </span>
                  {m.title}
                </span>
                <button
                  type="button"
                  onClick={() => removeMilestone(idx)}
                  className="text-gray-300 hover:text-blue-500 transition-colors duration-150 text-xl leading-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
