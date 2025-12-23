"use client";

import { Project } from "@/types/project";

interface ProjectThumbnailPreviewProps {
  project: Project;
}

export default function ProjectThumbnailPreview({
  project,
}: ProjectThumbnailPreviewProps) {
  const milestoneCount = project.milestones ? project.milestones.length : 0;

  return (
    <div
      className="
        absolute -top-28 left-1/2 transform -translate-x-1/2
        w-[85%]
        bg-gradient-to-br from-black via-[#1a0d0d] to-black
        border border-[#c21219] rounded-xl shadow-lg
        opacity-0 group-hover:opacity-100
        transition-all duration-300 ease-out
        p-4
        flex items-center gap-4
        z-50
      "
    >
      {/* Thumbnail Image */}
      {project.image && (
        <img
          src={project.image}
          alt={project.title}
          className="w-20 h-20 object-cover rounded-lg border border-[#c21219] flex-shrink-0"
        />
      )}

      {/* Thumbnail Info */}
      <div className="flex flex-col justify-center text-gray-200 overflow-hidden">
        {/* Deadline */}
        {project.deadline && (
          <p className="text-xs text-gray-400 truncate max-w-full">
            Deadline: <span className="text-white">{project.deadline}</span>
          </p>
        )}

        {/* Budget */}
        {project.budget && (
          <p className="text-sm font-semibold text-[#c21219] truncate max-w-full">
            Budget: {project.budget}
          </p>
        )}

        {/* Milestone Count */}
        <p className="text-xs text-gray-400 truncate max-w-full">
          Milestones: <span className="text-white">{milestoneCount}</span>
        </p>
      </div>
    </div>
  );
}
