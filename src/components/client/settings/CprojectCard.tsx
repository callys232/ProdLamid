"use client";

import { motion } from "framer-motion";
import { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function ProjectCard({
  project,
  isSelected,
  onSelect,
}: ProjectCardProps) {
  const milestoneProgress =
    project.milestones && project.milestones.length > 0
      ? Math.round(
          project.milestones.reduce((sum, m) => sum + (m.progress ?? 0), 0) /
            project.milestones.length
        )
      : 0;

  return (
    <motion.div
      layout
      role="button"
      aria-pressed={isSelected}
      aria-label={`Select project ${project.title}`}
      onClick={() => onSelect(project.id ?? project._id ?? "")}
      className={`p-4 rounded-lg cursor-pointer border ${
        isSelected
          ? "border-red-600 bg-gray-800"
          : "border-gray-700 bg-gray-900"
      } hover:border-red-600 transition-all`}
    >
      {/* Title & Category */}
      <h3 className="font-semibold text-white">{project.title}</h3>
      <p className="text-sm text-gray-400">{project.category}</p>

      {/* Milestone Progress */}
      {milestoneProgress !== undefined && (
        <div
          className="mt-2"
          aria-label={`Milestone progress: ${milestoneProgress}%`}
        >
          <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-red-600 h-2 transition-all"
              style={{ width: `${milestoneProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-300 mt-1">
            {milestoneProgress}% completed
          </p>
        </div>
      )}

      {/* Budget */}
      {project.budget && (
        <p
          className="text-xs text-gray-400 mt-1"
          aria-label={`Budget: ${project.budget}`}
        >
          Budget: {project.budget}
        </p>
      )}

      {/* Number of Consultants */}
      {project.consultants && (
        <p
          className="text-xs text-gray-400"
          aria-label={`Number of consultants: ${project.consultants.length}`}
        >
          Consultants: {project.consultants.length}
        </p>
      )}
    </motion.div>
  );
}
