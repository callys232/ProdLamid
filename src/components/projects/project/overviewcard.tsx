// src/components/project/OverviewCard.tsx
import Card from "./card";
import type { Project } from "@/types/project";

export default function OverviewCard({ project }: { project: Project }) {
  return (
    <Card title="📊 Overview">
      <p className="text-sm text-gray-300">Category: {project.category}</p>
      <p className="text-sm text-gray-300">Tech: {project.tech || "N/A"}</p>
      <p className="text-sm text-gray-300">
        Location: {project.location || "Remote"}
      </p>
      <p className="text-sm text-gray-300">Budget: {project.budget || "N/A"}</p>
      <p className="text-sm text-gray-300">
        Hourly Rate: {project.hourlyRate || "N/A"}
      </p>
      <p className="text-sm text-gray-300">Rating: {project.rating || "N/A"}</p>
    </Card>
  );
}
