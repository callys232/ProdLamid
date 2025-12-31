"use client";
import type { Project } from "@/types/project";

interface ReviewStepProps {
  project: Project;
  comment: string;
  extraField: string;
}

export default function ReviewStep({
  project,
  comment,
  extraField,
}: ReviewStepProps) {
  return (
    <div className="space-y-4 text-sm text-gray-700">
      <h3 className="text-lg font-semibold text-[#c21219]">
        Review your project details before posting
      </h3>

      {/* Core Details */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-medium">Title:</p>
          <p>{project.title || "—"}</p>
        </div>
        <div>
          <p className="font-medium">Category:</p>
          <p>{project.category || "—"}</p>
        </div>
        <div>
          <p className="font-medium">Location:</p>
          <p>{project.location || "—"}</p>
        </div>
        <div>
          <p className="font-medium">Deadline:</p>
          <p>{project.deadline || "—"}</p>
        </div>
        <div>
          <p className="font-medium">Priority:</p>
          <p>{project.priority || "—"}</p>
        </div>
        <div>
          <p className="font-medium">Status:</p>
          <p>{project.status || "—"}</p>
        </div>
      </div>

      {/* Budget */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-medium">Budget:</p>
          <p>{project.budget || "—"}</p>
        </div>
        <div>
          <p className="font-medium">Hourly Rate:</p>
          <p>{project.hourlyRate || "—"}</p>
        </div>
      </div>

      {/* Description */}
      <div>
        <p className="font-medium">Description:</p>
        <p>{project.description || "—"}</p>
      </div>

      {/* Skills */}
      <div>
        <p className="font-medium">Skills:</p>
        {project.skills && project.skills.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {project.skills.map((skill, idx) => (
              <li
                key={idx}
                className="px-2 py-1 bg-red-100 text-[#c21219] rounded-md text-xs font-medium"
              >
                {skill}
              </li>
            ))}
          </ul>
        ) : (
          <p>—</p>
        )}
      </div>

      {/* Milestones */}
      <div>
        <p className="font-medium">Milestones:</p>
        {project.milestones && project.milestones.length > 0 ? (
          <ul className="list-disc list-inside text-sm">
            {project.milestones.map((m, idx) => (
              <li key={idx}>{m.title}</li>
            ))}
          </ul>
        ) : (
          <p>—</p>
        )}
      </div>

      {/* Extras */}
      <div>
        <p className="font-medium">Comments:</p>
        <p>{comment || "—"}</p>
      </div>
      <div>
        <p className="font-medium">Extra Field:</p>
        <p>{extraField || "—"}</p>
      </div>
    </div>
  );
}
