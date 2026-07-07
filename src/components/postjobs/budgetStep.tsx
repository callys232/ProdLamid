"use client";

import type { Project } from "@/types/project";

interface BudgetStepProps {
  project: Project;
  handleChange: (field: keyof Project, value: string) => void;
  errors: Record<string, string>;
}

export default function BudgetStep({ project, handleChange, errors }: BudgetStepProps) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">Enter a fixed budget, an hourly rate, or both.</p>

      <div className="group">
        <label className="pj-label">Fixed Budget (₦)</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none select-none">
            ₦
          </span>
          <input
            type="number"
            title="Fixed Budget"
            min="0"
            value={project.budget || ""}
            onChange={(e) => handleChange("budget", e.target.value)}
            placeholder="0"
            className={`pj-field pl-7${errors.budget ? " pj-error" : ""}`}
          />
        </div>
        {errors.budget && <p className="pj-error-msg">{errors.budget}</p>}
      </div>

      <div className="group">
        <label className="pj-label">Hourly Rate (₦/hr)</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none select-none">
            ₦
          </span>
          <input
            type="number"
            title="Hourly Rate"
            min="0"
            value={project.hourlyRate || ""}
            onChange={(e) => handleChange("hourlyRate", e.target.value)}
            placeholder="0"
            className={`pj-field pl-7${errors.hourlyRate ? " pj-error" : ""}`}
          />
        </div>
        {errors.hourlyRate && <p className="pj-error-msg">{errors.hourlyRate}</p>}
      </div>
    </div>
  );
}
