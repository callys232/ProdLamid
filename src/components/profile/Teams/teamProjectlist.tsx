"use client";

import { Project } from "@/types/project";
import { Consultant } from "@/types/client";

interface ProjectListProps {
  projects: Project[];
  allConsultants?: Consultant[]; // optional: to display freelancer names
}

export default function ProjectList({
  projects,
  allConsultants = [],
}: ProjectListProps) {
  if (!projects.length)
    return <p className="text-gray-400 text-sm p-4">No projects available.</p>;

  const getFreelancerNames = (project: Project) => {
    if (!project.consultants?.length) return "No freelancers assigned";

    return project.consultants
      .map((c) => {
        // consultants can be either string IDs or full Consultant objects
        if (typeof c === "string") {
          const consultant = allConsultants.find((con) => con.id === c);
          return consultant?.name ?? "Unknown";
        }
        return c.name;
      })
      .join(", ");
  };

  return (
    <div className="p-4 flex flex-col gap-3">
      {projects.map((p) => (
        <div key={p._id} className="p-4 border rounded-lg bg-white shadow-sm">
          <h3 className="font-semibold">{p.title}</h3>
          <p className="text-sm text-gray-600">Status: {p.status}</p>
          <p className="text-sm text-gray-500">
            Freelancers: {getFreelancerNames(p)}
          </p>
        </div>
      ))}
    </div>
  );
}
