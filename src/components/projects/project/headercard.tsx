// src/components/project/HeaderCard.tsx
import Card from "./card";
import type { Project } from "@/types/project";

export default function HeaderCard({ project }: { project: Project }) {
  return (
    <Card>
      <div className="flex flex-col md:flex-row justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">{project.title}</h1>
          <p className="text-gray-400">{project.organization}</p>
          <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-green-700">
            {project.status || "Open"}
          </span>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-300">
            Deadline: {project.deadline || "N/A"}
          </p>
          <p className="text-sm text-gray-300">
            Priority: {project.priority || "Normal"}
          </p>
        </div>
      </div>
    </Card>
  );
}
