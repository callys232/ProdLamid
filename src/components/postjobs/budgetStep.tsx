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

  return (
    <>
      <div>
        <label className="block text-sm mb-1">Budget</label>
        <input
          aria-label="budget"
          type="text"
          value={project.budget ?? ""}
          onChange={(e) => handleChange("budget", e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${errors.budget
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
        <div className="flex gap-3">
          {/* Hours Input */}
          <div className="flex-1">
            <input
              type="number"
              min={0}
              max={1000}
              step={1}
              value={Math.floor(project.hourlyRate || 0)}
              onChange={(e) => {
                const hours = parseInt(e.target.value || "0", 10);
                const minutes = Math.round(((project.hourlyRate || 0) % 1) * 60);
                handleChange("hourlyRate", hours + minutes / 60); // ✅ always number
              }}
              className={`w-full px-3 py-2 rounded-md border ${errors.hourlyRate
                ? "border-red-500 focus:ring-red-500"
                : "border-[#c21219] focus:ring-[#c21219]"
                }`}
              aria-label="Hours"
            />
            <p className="text-xs text-gray-500 mt-1">Hours</p>
          </div>

          {/* Minutes Input */}
          <div className="flex-1">
            <input
              type="number"
              min={0}
              max={59}
              step={1}
              value={Math.round(((project.hourlyRate || 0) % 1) * 60)}
              onChange={(e) => {
                const minutes = parseInt(e.target.value || "0", 10);
                const hours = Math.floor(project.hourlyRate || 0);
                handleChange("hourlyRate", hours + minutes / 60); // ✅ always number
              }}
              className={`w-full px-3 py-2 rounded-md border ${errors.hourlyRate
                ? "border-red-500 focus:ring-red-500"
                : "border-[#c21219] focus:ring-[#c21219]"
                }`}
              aria-label="Minutes"
            />
            <p className="text-xs text-gray-500 mt-1">Minutes</p>
          </div>


          {errors.hourlyRate && (
            <p className="text-red-500 text-xs mt-1">{errors.hourlyRate}</p>
          )}
        </div>

      </div>

      <div>
        <label className="block text-sm mb-1">Start Date</label>
        <input
          aria-label="date"
          type="date"
          value={project.startDate ?? ""}
          onChange={(e) => handleChange("startDate", e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${errors.startDate
            ? "border-red-500 focus:ring-red-500"
            : "border-[#c21219] focus:ring-[#c21219]"
            }`}
        />
        {errors.startDate && (
          <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
        )}
      </div>
      <div>
        <label className="block text-sm mb-1">End Date</label>
        <input
          aria-label="date"
          type="date"
          value={project.endDate ?? ""}
          onChange={(e) => handleChange("endDate", e.target.value)}
          className={`w-full px-3 py-2 rounded-md border ${errors.endDate
            ? "border-red-500 focus:ring-red-500"
            : "border-[#c21219] focus:ring-[#c21219]"
            }`}
        />
        {errors.endDate && (
          <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
        )}
      </div>
      <div>
        <label className="block text-sm mb-2 font-medium text-gray-700">
          Task Type
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          {TaskTypeOptions.map((type) => {
            const value = type.toLowerCase();
            const isSelected = project.TaskType === value;
            return (
              <label key={type} className={`flex-1 cursor-pointer rounded-lg border px-4 py-2 text-center ${isSelected ? "border-[#c21219] bg-red-50 text-[#c21219]" : "border-gray-300 bg-white text-gray-700"} hover:border-[#c21219] transition`} >
                <input type="radio" name="TaskType" value={value} checked={isSelected} onChange={(e) => handleChange("TaskType", e.target.value)}
                  className="hidden"
                />
                {type}
              </label>
            );
          })}
        </div>
        {errors.TaskType && (
          <p className="text-red-500 text-xs mt-1">{errors.TaskType}</p>
        )}
      </div>
    </>
  );
}
