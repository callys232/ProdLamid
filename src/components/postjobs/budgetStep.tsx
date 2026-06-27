"use client";
import type { Project } from "@/types/project";

interface BudgetStepProps {
  project: Project;
  handleChange: (field: keyof Project, value: string) => void;
  errors: Record<string, string>;
}

export default function BudgetStep({
  project,
  handleChange,
  errors,
}: BudgetStepProps) {
  return (
    <>
      <div>
        <label className="block text-sm mb-1">Budget</label>
        <input
          aria-label="budget"
          type="text"
          value={project.budget}
          onChange={(e) => handleChange("budget", e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${
            errors.budget
              ? "border-red-500 focus:ring-red-500"
              : "border-[#c21219] focus:ring-[#c21219]"
          }`}
        />
        {errors.budget && (
          <p className="text-red-500 text-xs mt-1">{errors.budget}</p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1">Hourly Rate</label>
        <input
          aria-label="rate"
          type="text"
          value={project.hourlyRate}
          onChange={(e) => handleChange("hourlyRate", e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${
            errors.hourlyRate
              ? "border-red-500 focus:ring-red-500"
              : "border-[#c21219] focus:ring-[#c21219]"
          }`}
        />
        {errors.hourlyRate && (
          <p className="text-red-500 text-xs mt-1">{errors.hourlyRate}</p>
        )}
      </div>
    </>
  );
}
