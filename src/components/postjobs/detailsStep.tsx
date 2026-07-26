"use client";

import type { Project } from "@/types/project";

interface DetailsStepProps {
  project: Project;
  handleChange: (field: keyof Project, value: string) => void;
  errors: Record<string, string>;
}

export default function DetailsStep({ project, handleChange, errors }: DetailsStepProps) {
  return (
    <div className="space-y-5">
      <div className="group">
        <label className="pj-label">Title</label>
        <input
          type="text"
          value={project.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="e.g. Brand Strategy Consulting Project"
          className={`pj-field${errors.title ? " pj-error" : ""}`}
        />
        {errors.title && <p className="pj-error-msg">{errors.title}</p>}
      </div>

      <div className="group">
        <label className="pj-label">Category</label>
        <input
          type="text"
          value={project.category}
          onChange={(e) => handleChange("category", e.target.value)}
          placeholder="e.g. Strategy, Marketing, Finance"
          className={`pj-field${errors.category ? " pj-error" : ""}`}
        />
        {errors.category && <p className="pj-error-msg">{errors.category}</p>}
      </div>

      <div className="group">
        <label className="pj-label">Location</label>
        <input
          type="text"
          value={project.location}
          onChange={(e) => handleChange("location", e.target.value)}
          placeholder="e.g. City, Remote, Hybrid"
          className="pj-field"
        />
      </div>

      <div className="group">
        <label className="pj-label">Deadline</label>
        <input
          type="date"
          title="Deadline"
          value={project.deadline}
          onChange={(e) => handleChange("deadline", e.target.value)}
          className={`pj-field${errors.deadline ? " pj-error" : ""}`}
        />
        {errors.deadline && <p className="pj-error-msg">{errors.deadline}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="group">
          <label className="pj-label">Priority</label>
          <select
            title="Priority"
            value={project.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
            className={`pj-field pj-select${errors.priority ? " pj-error" : ""}`}
          >
            <option value="">Select priority</option>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
          {errors.priority && <p className="pj-error-msg">{errors.priority}</p>}
        </div>

        <div className="group">
          <label className="pj-label">Status</label>
          <select
            title="Status"
            value={project.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className={`pj-field pj-select${errors.status ? " pj-error" : ""}`}
          >
            <option value="">Select status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          {errors.status && <p className="pj-error-msg">{errors.status}</p>}
        </div>
      </div>
    </div>
  );
}
