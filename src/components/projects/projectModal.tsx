"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Project, Milestone, ActivityItem } from "@/types/project";
import { Consultant } from "@/types/client";
import ApplyForm from "./apply/apply";
import { useRouter } from "next/navigation";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
  isRegisteredUser: boolean;
  activity?: ActivityItem[];
}

export default function ProjectModal({
  project,
  onClose,
  isRegisteredUser,
  activity,
}: ProjectModalProps) {
  // Hooks
  const [currentImage, setCurrentImage] = useState(0);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    setShowApplyForm(false);
  };

  // disable background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!project) return null;

  const images: string[] = Array.isArray(project.images)
    ? project.images
    : project.image
    ? [project.image]
    : [];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="
            bg-white/10 backdrop-blur-xl border border-white/20
            rounded-2xl shadow-2xl p-8 max-w-6xl w-full text-gray-100 relative
            overflow-y-auto max-h-[90vh]
          "
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl font-bold transition-colors"
            aria-label="Close"
          >
            ×
          </button>

          {/* Image Carousel */}
          {images.length > 0 && (
            <div className="relative w-full h-72 rounded-xl overflow-hidden mb-8 shadow-lg">
              <Image
                src={images[currentImage]}
                alt={project.title}
                width={1200}
                height={600}
                className="w-full h-full object-cover"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImage((prev) =>
                        prev === 0 ? images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white px-3 py-1 rounded-full transition"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImage((prev) =>
                        prev === images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white px-3 py-1 rounded-full transition"
                  >
                    ›
                  </button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full transition ${
                          i === currentImage ? "bg-[#c21219]" : "bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Header */}
          <h2 className="text-3xl font-bold mb-2 text-white">
            {project.title}
          </h2>
          <p className="text-sm text-gray-300 mb-1">
            {project.organization} {project.location && `— ${project.location}`}
          </p>
          <p className="text-sm text-gray-400 mb-6">
            {project.category} {project.tech && `| ${project.tech}`}
          </p>

          {/* Budget / Rate / Deadline / Priority */}
          <div className="flex flex-wrap gap-6 mb-8">
            {project.budget && (
              <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-md">
                <p className="font-semibold text-[#c21219]">{project.budget}</p>
                <p className="text-sm text-gray-300">Budget</p>
              </div>
            )}
            {project.hourlyRate && (
              <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-md">
                <p className="font-semibold text-[#c21219]">
                  {project.hourlyRate}
                </p>
                <p className="text-sm text-gray-300">Hourly Rate</p>
              </div>
            )}
            {project.deadline && (
              <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-md">
                <p className="font-semibold text-[#c21219]">
                  {project.deadline}
                </p>
                <p className="text-sm text-gray-300">Deadline</p>
              </div>
            )}
            {project.priority && (
              <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-md">
                <p className="font-semibold text-[#c21219]">
                  {project.priority}
                </p>
                <p className="text-sm text-gray-300">Priority</p>
              </div>
            )}
          </div>

          {/* Milestones */}
          {project.milestones && project.milestones.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-3">
                Milestones
              </h3>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                {project.milestones.map((m: Milestone, i: number) => (
                  <li key={m.id || m._id || i}>
                    <span className="font-semibold text-[#c21219]">
                      {m.title}
                    </span>
                    {m.description && (
                      <span className="ml-2 text-gray-400">
                        — {m.description}
                      </span>
                    )}
                    {m.status && (
                      <span className="ml-2 text-xs text-gray-500">
                        [{m.status}]
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Consultants */}
          {project.consultants && project.consultants.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-3">
                Consultants
              </h3>
              <div className="flex flex-wrap gap-3">
                {(project.consultants as (string | Consultant)[]).map((c, i) =>
                  typeof c === "string" ? (
                    <div
                      key={c}
                      className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-[#c21219] rounded-lg text-sm"
                    >
                      <p className="text-white font-semibold">{c}</p>
                    </div>
                  ) : (
                    <div
                      key={c.id || i}
                      className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-[#c21219] rounded-lg text-sm"
                    >
                      <p className="text-white font-semibold">{c.name}</p>
                      {c.role && <p className="text-gray-300">{c.role}</p>}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Activity Log */}
          {isRegisteredUser && activity && activity.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-3">
                Recent Activity
              </h3>
              <ul className="space-y-3 text-gray-300">
                {activity.map((log) => (
                  <li
                    key={log.id}
                    className="p-3 bg-white/10 backdrop-blur-sm border border-[#c21219] rounded-lg shadow-md"
                  >
                    <p className="text-sm">
                      <span className="font-semibold text-[#c21219]">
                        {log.action}
                      </span>{" "}
                      by {log.user}
                    </p>
                    <p className="text-xs text-gray-400">{log.timestamp}</p>
                    {log.details && (
                      <p className="text-sm text-gray-400 mt-1">
                        {log.details}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-col gap-3 mt-6">
            <div>
              {project.status && (
                <p className="text-sm text-gray-300">
                  Status: {project.status}
                </p>
              )}
              {typeof project.milestoneProgress === "number" && (
                <>
                  <p className="text-sm text-gray-300">
                    Progress: {project.milestoneProgress}%
                  </p>

                  <div className="mt-2 w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-[#c21219] h-2 rounded-full transition-all"
                      style={{ width: `${project.milestoneProgress}%` }}
                    />
                  </div>
                </>
              )}
            </div>

            <hr className="border-t border-white/20 my-6" />

            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="
                  px-5 py-2 rounded-md font-semibold
                  bg-white/10 backdrop-blur-sm border border-white/20
                  text-gray-200 hover:text-white hover:bg-white/20
                  transition-colors
                "
              >
                Close
              </button>

              {/* <button
                onClick={() => router.push(`/projects/${project.id}/apply`)}
                className="
                  px-6 py-2 rounded-md font-semibold
                  bg-[#c21219]/80 hover:bg-[#c21219]
                  text-white shadow-lg backdrop-blur-sm border border-white/20
                  transition-colors
                "
              >
                Apply Now
              </button>
            </div>

            {showApplyForm && (
              <ApplyForm project={project} onSubmit={handleSubmit} />
            )} */}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
