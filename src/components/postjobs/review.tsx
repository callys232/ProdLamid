"use client";

import type { Project } from "@/types/project";

interface ReviewStepProps {
  project: Project;
  comment: string;
  extraField: string;
}

function Row({ label, value }: { label: string; value?: string | number }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-gray-100 last:border-0 gap-4">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide shrink-0 w-28">
        {label}
      </span>
      <span className="text-sm text-gray-900 text-right break-words">{value}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{title}</p>
      {children}
    </div>
  );
}

export default function ReviewStep({ project, comment, extraField }: ReviewStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900">Review before posting</h3>

      <Section title="Project Details">
        <Row label="Title"    value={project.title} />
        <Row label="Category" value={project.category} />
        <Row label="Location" value={project.location} />
        <Row label="Deadline" value={project.deadline} />
        <Row label="Priority" value={project.priority} />
        <Row label="Status"   value={project.status} />
      </Section>

      <Section title="Budget">
        <Row label="Fixed"  value={project.budget    ? `₦${Number(project.budget).toLocaleString()}`    : undefined} />
        <Row label="Hourly" value={project.hourlyRate ? `₦${Number(project.hourlyRate).toLocaleString()}/hr` : undefined} />
      </Section>

      {project.description && (
        <Section title="Description">
          <p className="text-sm text-gray-700 leading-relaxed">{project.description}</p>
        </Section>
      )}

      {project.skills && project.skills.length > 0 && (
        <Section title="Skills">
          <div className="flex flex-wrap gap-2 pt-1">
            {project.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-700 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </Section>
      )}

      {project.milestones && project.milestones.length > 0 && (
        <Section title="Milestones">
          <div className="space-y-2 pt-1">
            {project.milestones.map((m, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-sm text-gray-700">
                <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                  {idx + 1}
                </span>
                {m.title}
              </div>
            ))}
          </div>
        </Section>
      )}

      {(comment || extraField) && (
        <Section title="Extras">
          {comment    && <Row label="Comments"    value={comment} />}
          {extraField && <Row label="Extra Field" value={extraField} />}
        </Section>
      )}
    </div>
  );
}
