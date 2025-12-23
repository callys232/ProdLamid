"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ProjectModal from "./projectModal";
import ProjectThumbnailPreview from "./project/thumbnail";
import { Project } from "@/types/project";
import { mockActivity } from "@/mocks/mockClient";

interface ProjectCardProps {
  project: Project;
  isRegisteredUser?: boolean;
}

export default function ProjectCard({
  project,
  isRegisteredUser = false,
}: ProjectCardProps) {
  const projectId = project._id ?? project.id ?? "";

  const [isSaved, setIsSaved] = useState<boolean>(() => {
    if (typeof window === "undefined" || !projectId) return false;
    const saved: string[] = JSON.parse(
      localStorage.getItem("savedProjects") || "[]"
    );
    return saved.includes(projectId);
  });

  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined" || !projectId) return;
    const saved: string[] = JSON.parse(
      localStorage.getItem("savedProjects") || "[]"
    );
    const updated = isSaved
      ? Array.from(new Set([...saved, projectId]))
      : saved.filter((id) => id !== projectId);
    localStorage.setItem("savedProjects", JSON.stringify(updated));
  }, [isSaved, projectId]);

  const toggleSave = () => setIsSaved((prev) => !prev);

  const rating = Math.floor(project.rating ?? 0);
  const hourlyRate = project.hourlyRate ?? "N/A";
  const image = project.image ?? "/placeholder-project.jpg";

  return (
    <>
      <div className="relative group">
        {/* Card */}
        <div
          className="
            relative bg-black border border-[#c21219] rounded-xl overflow-hidden 
            shadow-md transition-all duration-300 flex flex-col
            hover:shadow-xl hover:scale-[1.02]
          "
        >
          {/* Image */}
          <div
            className="relative w-full h-32 md:h-40 overflow-hidden cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <Image
              src={image}
              alt={project.title}
              width={400}
              height={160}
              loading="lazy"
              className="w-full h-full object-cover hover:scale-105 transition-transform rounded-t-xl"
            />
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {/* Info */}
          <div className="p-4 flex flex-col flex-grow text-gray-200">
            <div className="mb-3 space-y-1">
              <h3
                onClick={() => setShowModal(true)}
                className="font-semibold text-lg text-white leading-snug cursor-pointer hover:text-[#c21219] transition"
              >
                {project.title}
              </h3>

              {/* Rating */}
              <div className="flex items-center text-yellow-400 text-sm">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>{i < rating ? "★" : "☆"}</span>
                ))}
              </div>

              <p className="text-sm text-gray-400">
                Category: {project.category}
              </p>
              {project.organization && (
                <p className="text-sm text-gray-400">
                  Organization: {project.organization}
                </p>
              )}
              <p className="text-sm text-gray-300">Budget: {project.budget}</p>
              <p className="text-sm text-gray-300">Rate: {hourlyRate}</p>
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center mt-auto gap-2">
              <button
                onClick={() => setShowModal(true)}
                aria-label="View project details"
                className="flex-1 bg-[#c21219] hover:bg-red-700 text-white text-xs px-3 py-2 rounded-md font-semibold transition-colors shadow-sm hover:shadow-md"
              >
                View Details
              </button>

              <button
                onClick={toggleSave}
                aria-label="Save project"
                className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-md text-xs font-semibold transition ${
                  isSaved
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-black border border-gray-500 hover:border-[#c21219] hover:text-[#c21219]"
                }`}
              >
                {isSaved ? "✓ Saved" : "♡ Save"}
              </button>
            </div>
          </div>
        </div>

        {/* Floating Thumbnail Preview */}
        <ProjectThumbnailPreview project={project} />
      </div>

      {/* Modal */}
      {showModal && (
        <ProjectModal
          project={project}
          onClose={() => setShowModal(false)}
          isRegisteredUser={isRegisteredUser}
          activity={isRegisteredUser ? mockActivity : undefined}
        />
      )}
    </>
  );
}
