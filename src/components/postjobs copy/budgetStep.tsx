"use client";
import type { Project } from "@/types/project";

interface BudgetStepProps {
  project: Project;
  handleChange: (field: keyof Project, value: string | number) => void;
  errors: Record<string, string>;
}

export default function BudgetStep({
  project,
  handleChange,
  errors,
}: BudgetStepProps) {
  const TaskTypeOptions = ["Single Task", "Shared Task", "Co-operative Task"];

  const hours = Math.floor(project.hourlyRate || 0);
  const minutes = Math.round(((project.hourlyRate || 0) % 1) * 60);

  return (
    <div className="space-y-6">
      {/* Budget */}
      <div>
        <label
          htmlFor="budget"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Budget
        </label>
        <input
          id="budget"
          type="number"
          min={0}
          step={0.01}
          value={project.budget ?? ""}
          onChange={(e) => handleChange("budget", e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${errors.budget
              ? "border-red-500 focus:ring-red-500"
              : "border-[#c21219] focus:ring-[#c21219]"
            } focus:outline-none`}
          placeholder="Enter total budget"
        />
        {errors.budget && (
          <p className="text-red-500 text-xs mt-1">{errors.budget}</p>
        )}
      </div>

      {/* Hourly Rate */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hourly Rate
        </label>
        <div className="flex gap-3">
          {/* Hours Input */}
          <div className="flex-1">
            <input
              id="hours"
              type="number"
              min={0}
              max={1000}
              step={1}
              value={hours}
              onChange={(e) => {
                const newHours = parseInt(e.target.value || "0", 10);
                handleChange("hourlyRate", newHours + minutes / 60);
              }}
              className={`w-full px-3 py-2 rounded-md border ${errors.hourlyRate
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#c21219] focus:ring-[#c21219]"
                } focus:outline-none`}
              aria-label="Hours"
            />
            <p className="text-xs text-gray-500 mt-1">Hours</p>
          </div>

          {/* Minutes Input */}
          <div className="flex-1">
            <input
              id="minutes"
              type="number"
              min={0}
              max={59}
              step={1}
              value={minutes}
              onChange={(e) => {
                const newMinutes = parseInt(e.target.value || "0", 10);
                handleChange("hourlyRate", hours + newMinutes / 60);
              }}
              className={`w-full px-3 py-2 rounded-md border ${errors.hourlyRate
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#c21219] focus:ring-[#c21219]"
                } focus:outline-none`}
              aria-label="Minutes"
            />
            <p className="text-xs text-gray-500 mt-1">Minutes</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Current rate:{" "}
          <span className="font-medium">
            ${(hours + minutes / 60).toFixed(2)}/hour
          </span>
        </p>
        {errors.hourlyRate && (
          <p className="text-red-500 text-xs mt-1">{errors.hourlyRate}</p>
        )}
      </div>

      {/* Start Date */}
      <div>
        <label
          htmlFor="startDate"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Start Date
        </label>
        <input
          id="startDate"
          type="date"
          value={project.startDate ?? ""}
          onChange={(e) => handleChange("startDate", e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${errors.startDate
              ? "border-red-500 focus:ring-red-500"
              : "border-[#c21219] focus:ring-[#c21219]"
            } focus:outline-none`}
        />
        {errors.startDate && (
          <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
        )}
      </div>

      {/* End Date */}
      <div>
        <label
          htmlFor="endDate"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          End Date
        </label>
        <input
          id="endDate"
          type="date"
          value={project.endDate ?? ""}
          onChange={(e) => handleChange("endDate", e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${errors.endDate
              ? "border-red-500 focus:ring-red-500"
              : "border-[#c21219] focus:ring-[#c21219]"
            } focus:outline-none`}
        />
        {errors.endDate && (
          <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
        )}
      </div>

      {/* Task Type */}
      <div>
        <label className="block text-sm mb-2 font-medium text-gray-700">
          Task Type
        </label>
        <div className="flex flex-col sm:flex-row gap-4">
          {TaskTypeOptions.map((type, idx) => {
            const value = type.toLowerCase().replace(/\s+/g, "_");
            const isSelected = project.TaskType === value;
            return (
              <div key={`task-${idx}`} className="flex items-center gap-2">
                <input
                  id={`task-${value}`}
                  type="radio"
                  name="TaskType"
                  value={value}
                  checked={isSelected}
                  onChange={(e) => handleChange("TaskType", e.target.value)}
                  className="h-4 w-4 text-[#c21219] focus:ring-[#c21219] border-gray-300"
                />
                <label
                  htmlFor={`task-${value}`}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {type}
                </label>
              </div>
            );
          })}
        </div>
        {errors.TaskType && (
          <p className="text-red-500 text-xs mt-1">{errors.TaskType}</p>
        )}
      </div>
    </div>
  );
}
