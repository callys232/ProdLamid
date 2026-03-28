"use client";

import React, { useState } from "react";
import type { PhaseInput, MilestoneInput } from "@/types/projectPosting";

interface DescriptionStepProps {
  description: string;
  setDescription: (v: string) => void;

  skills: string[];
  setSkills: (s: string[]) => void;

  phases: PhaseInput[];
  addPhase: (title: string) => void;
  removePhase: (id: string) => void;

  milestones: MilestoneInput[];
  addMilestone: (title: string, workPhaseId?: string | null) => void;
  removeMilestone: (index: number) => void;

  errors: Record<string, string>;
}

export default function DescriptionStep({
  description,
  setDescription,
  skills,
  setSkills,
  phases,
  addPhase,
  removePhase,
  milestones,
  addMilestone,
  removeMilestone,
  errors,
}: DescriptionStepProps) {
  const [skillInput, setSkillInput] = useState("");
  const [phaseInput, setPhaseInput] = useState("");
  const [milestoneInput, setMilestoneInput] = useState("");

  const [localError, setLocalError] = useState<{
    skill?: string;
    phase?: string;
    milestone?: string;
  }>({});

  /* ---------------- SKILLS ---------------- */
  function handleAddSkill() {
    const trimmed = skillInput.trim();
    if (!trimmed) {
      setLocalError({ skill: "Skill cannot be empty." });
      return;
    }
    if (trimmed.length > 25) {
      setLocalError({ skill: "Skill cannot exceed 25 characters." });
      return;
    }
    if (skills.length >= 8) {
      setLocalError({ skill: "Maximum of 8 skills allowed." });
      return;
    }
    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setLocalError({ skill: "This skill already exists." });
      return;
    }

    setSkills([...skills, trimmed]);
    setSkillInput("");
    setLocalError({});
  }

  function handleRemoveSkill(skillToRemove: string) {
    setSkills(skills.filter((s) => s !== skillToRemove));
  }

  /* ---------------- PHASES ---------------- */
  function handleAddPhase() {
    const trimmed = phaseInput.trim();
    if (!trimmed) {
      setLocalError({ phase: "Phase cannot be empty." });
      return;
    }
    if (phases.length >= 6) {
      setLocalError({ phase: "Maximum of 6 phases allowed." });
      return;
    }
    if (phases.some((p) => p.title.toLowerCase() === trimmed.toLowerCase())) {
      setLocalError({ phase: "This phase already exists." });
      return;
    }

    addPhase(trimmed);
    setPhaseInput("");
    setLocalError({});
  }

  function handleRemovePhase(id?: string) {
    if (!id) return;
    removePhase(id);
  }

  /* ---------------- MILESTONES ---------------- */
  function handleAddMilestone() {
    const trimmed = milestoneInput.trim();
    if (!trimmed) {
      setLocalError({ milestone: "Milestone cannot be empty." });
      return;
    }
    if (milestones.length >= 12) {
      setLocalError({ milestone: "Maximum of 12 milestones allowed." });
      return;
    }
    if (milestones.some((m) => m.title.toLowerCase() === trimmed.toLowerCase())) {
      setLocalError({ milestone: "This milestone already exists." });
      return;
    }

    addMilestone(trimmed);
    setMilestoneInput("");
    setLocalError({});
  }

  /* ---------------- DESCRIPTION LENGTH ---------------- */
  const descriptionLength = description.length;

  return (
    <div className="space-y-6 text-sm text-black">

      {/* ---------------- DESCRIPTION ---------------- */}
      <div className="bg-white rounded-md p-4 ring-1 ring-gray-100 hover:shadow-md hover:scale-[1.01] transition">
        <label className="block text-sm font-medium text-gray-700">
          Project Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          maxLength={2000}
          className={`mt-2 w-full px-3 py-2 rounded-md border ${errors.description ? "border-red-500" : "border-gray-200"
            } focus:ring-2 focus:ring-[#c21219]`}
        />
        <div className="flex justify-between mt-1">
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description}</p>
          )}
          <p className="text-xs text-gray-400 ml-auto">
            {descriptionLength}/2000
          </p>
        </div>
      </div>

      {/* ---------------- SKILLS ---------------- */}
      <div className="bg-white rounded-md p-4 ring-1 ring-gray-100 hover:shadow-md hover:scale-[1.01] transition">
        <label className="block text-sm font-medium text-gray-700">Skills</label>
        <div className="flex gap-2 mt-2">
          <input
            value={skillInput}
            onChange={(e) => {
              setSkillInput(e.target.value);
              setLocalError({});
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSkill();
              }
            }}
            placeholder="e.g. React, TailwindCSS"
            className="flex-1 px-3 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#c21219]"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            disabled={!skillInput.trim() || skills.length >= 8}
            className={`px-4 py-2 rounded-md text-white transition ${skillInput.trim() && skills.length < 8
                ? "bg-[#c21219] hover:bg-red-700"
                : "bg-gray-300 cursor-not-allowed"
              }`}
          >
            Add
          </button>
        </div>
        {localError.skill && (
          <p className="text-xs text-red-500 mt-1">{localError.skill}</p>
        )}

        <ul className="flex flex-wrap gap-2 mt-3">
          {skills.map((s) => (
            <li
              key={s}
              className="px-2 py-1 bg-red-100 text-[#c21219] rounded-md text-xs flex items-center gap-2 hover:scale-105 transition"
            >
              {s}
              <button
                type="button"
                onClick={() => handleRemoveSkill(s)}
                className="text-gray-600 hover:text-red-600"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        <p className="text-xs text-gray-400 mt-2">{skills.length}/8 skills added</p>
      </div>

      {/* ---------------- PHASES ---------------- */}
      <div className="bg-white rounded-md p-4 ring-1 ring-gray-100 hover:shadow-md hover:scale-[1.01] transition">
        <label className="block text-sm font-medium text-gray-700">Work Phases</label>
        <div className="flex gap-2 mt-2">
          <input
            value={phaseInput}
            onChange={(e) => setPhaseInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddPhase();
              }
            }}
            placeholder="e.g. Design, Development"
            className="flex-1 px-3 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#c21219]"
          />
          <button
            type="button"
            onClick={handleAddPhase}
            disabled={!phaseInput.trim() || phases.length >= 6}
            className={`px-4 py-2 rounded-md text-white ${phaseInput.trim() && phases.length < 6
                ? "bg-[#c21219] hover:bg-red-700"
                : "bg-gray-300 cursor-not-allowed"
              }`}
          >
            Add Phase
          </button>
        </div>
        {localError.phase && (
          <p className="text-xs text-red-500 mt-1">{localError.phase}</p>
        )}

        <ul className="mt-3 space-y-2">
          {phases.map((p) => (
            <li
              key={p.id ?? p.title}
              className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 hover:shadow transition"
            >
              <div className="text-sm font-medium">{p.title}</div>
              <button
                type="button"
                onClick={() => handleRemovePhase(p.id)}
                className="text-xs text-gray-600 hover:text-red-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ---------------- MILESTONES (Grouped by Phase) ---------------- */}
      <div className="bg-white rounded-md p-4 ring-1 ring-gray-100 hover:shadow-md hover:scale-[1.01] transition">
        <label className="block text-sm font-medium text-gray-700">Milestones</label>

        <div className="flex gap-2 mt-2">
          <input
            value={milestoneInput}
            onChange={(e) => setMilestoneInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddMilestone();
              }
            }}
            placeholder="e.g. Wireframes, MVP"
            className="flex-1 px-3 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#c21219]"
          />
          <button
            type="button"
            onClick={handleAddMilestone}
            disabled={!milestoneInput.trim() || milestones.length >= 12}
            className={`px-4 py-2 rounded-md text-white ${milestoneInput.trim() && milestones.length < 12
                ? "bg-[#c21219] hover:bg-red-700"
                : "bg-gray-300 cursor-not-allowed"
              }`}
          >
            Add Milestone
          </button>
        </div>
        {localError.milestone && (
          <p className="text-xs text-red-500 mt-1">{localError.milestone}</p>
        )}

        {/* Milestones grouped under phases */}
        {phases.length > 0 ? (
          phases.map((phase) => {
            const phaseMilestones = milestones.filter(
              (m) => m.workPhaseId === phase.id
            );
            return (
              <div key={phase.id} className="mt-3">
                <div className="text-sm font-semibold mb-1">{phase.title}</div>
                <ul className="space-y-2">
                  {phaseMilestones.length > 0 ? (
                    phaseMilestones.map((m, idx) => (
                      <li
                        key={m.id ?? idx}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 hover:shadow transition"
                      >
                        <div className="text-sm font-medium">{m.title}</div>
                        <button
                          type="button"
                          onClick={() => removeMilestone(idx)}
                          className="text-xs text-gray-600 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </li>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic">No milestones yet.</p>
                  )}
                </ul>
              </div>
            );
          })
        ) : (
          // fallback if no phases exist
          <ul className="mt-3 space-y-2">
            {milestones.map((m, idx) => (
              <li
                key={m.id ?? idx}
                className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 hover:shadow transition"
              >
                <div>
                  <div className="text-sm font-medium">{m.title}</div>
                  <div className="text-xs text-gray-500">Phase: {m.workPhaseId ?? "General"}</div>
                </div>
                <button
                  type="button"
                  onClick={() => removeMilestone(idx)}
                  className="text-xs text-gray-600 hover:text-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}