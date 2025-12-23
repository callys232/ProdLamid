"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "./CprojectCard";
import { Project } from "@/types/project";
import type { Consultant } from "@/types/client";

interface ClientProjectSettingsProps {
  projects: Project[];
  onSave?: (updatedProject: Project) => void;
}

export default function ClientProjectSettings({
  projects,
  onSave,
}: ClientProjectSettingsProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    projects.length > 0 ? projects[0].id ?? projects[0]._id ?? null : null
  );

  const selectedProject = projects.find(
    (p) => p.id === selectedProjectId || p._id === selectedProjectId
  );

  const [projectDetails, setProjectDetails] = useState<Project | null>(
    selectedProject ? { ...selectedProject } : null
  );

  const [files, setFiles] = useState<File[]>([]);

  /** Compute overall milestone progress */
  const milestoneProgress =
    projectDetails?.milestones && projectDetails.milestones.length > 0
      ? Math.round(
          projectDetails.milestones.reduce(
            (sum, m) => sum + (m.progress ?? 0),
            0
          ) / projectDetails.milestones.length
        )
      : 0;

  /** Sync selected project */
  useEffect(() => {
    if (!selectedProject) return;

    const id = setTimeout(() => {
      setProjectDetails((prev) => {
        if (
          !prev ||
          prev.id !== selectedProject.id ||
          prev._id !== selectedProject._id
        ) {
          setFiles([]);
          return { ...selectedProject };
        }
        return prev;
      });
    }, 0);

    return () => clearTimeout(id);
  }, [selectedProject]);

  /** Generic project field update */
  const handleChange = <K extends keyof Project>(key: K, value: Project[K]) => {
    setProjectDetails((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  /** Update milestone progress */
  const handleMilestoneChange = (index: number, progress: number) => {
    if (!projectDetails?.milestones) return;
    const updated = [...projectDetails.milestones];
    updated[index] = { ...updated[index], progress };
    handleChange("milestones", updated);
  };

  /** Drag & drop files */
  const handleFilesDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files ?? []);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  /** Select files */
  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    setFiles((prev) => [...prev, ...newFiles]);
  };

  /** Remove file */
  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  if (!projectDetails) return null;

  return (
    <div className="flex w-full h-full gap-4">
      {/* Sidebar */}
      <div className="w-1/4 overflow-y-auto p-2 space-y-2">
        {projects.map((project) => (
          <ProjectCard
            key={project.id ?? project._id}
            project={project}
            isSelected={selectedProjectId === (project.id ?? project._id)}
            onSelect={setSelectedProjectId}
          />
        ))}
      </div>

      {/* Details Pane */}
      <div className="flex-1 bg-gray-900 p-6 rounded-lg overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={projectDetails.id ?? projectDetails._id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Overview */}
            <h2 className="text-2xl font-bold text-white mb-2">
              {projectDetails.title}
            </h2>
            <p className="text-gray-400 mb-4">
              Category: {projectDetails.category}
            </p>

            {/* Progress */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                Overall Milestone Progress
              </h3>
              <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden">
                <div
                  className="bg-red-600 h-4 transition-all"
                  style={{ width: `${milestoneProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-300 mt-1">
                {milestoneProgress}% completed
              </p>
            </div>

            {/* Milestones */}
            {projectDetails.milestones?.length ? (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Milestones
                </h3>
                {projectDetails.milestones.map((m, i) => (
                  <div key={i} className="mb-2">
                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                      <span>{m.title}</span>
                      <span>{m.progress}%</span>
                    </div>
                    <input
                      aria-label="range"
                      type="range"
                      min={0}
                      max={100}
                      value={m.progress}
                      onChange={(e) =>
                        handleMilestoneChange(i, Number(e.target.value))
                      }
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            ) : null}

            {/* Budget */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Budget</h3>
              <input
                aria-label="text"
                type="text"
                value={projectDetails.budget ?? ""}
                onChange={(e) => handleChange("budget", Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
              />
            </div>

            {/* Consultants */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                Number of Consultants
              </h3>
              <input
                aria-label="number"
                type="number"
                min={0}
                value={projectDetails.consultants?.length ?? 0}
                onChange={(e) => {
                  const count = Number(e.target.value);

                  const updatedConsultants: Consultant[] = Array.from(
                    { length: count },
                    (_, i) => ({
                      id: `temp-${i}`,
                      name: "",
                      email: "",
                      industry: "",
                      delivery: "",
                      rate: 0,
                      rating: 0,
                      role: "",
                    })
                  );

                  handleChange("consultants", updatedConsultants);
                }}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
              />
            </div>

            {/* Documents */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                Documents
              </h3>
              <div
                className="w-full p-4 border-2 border-dashed border-gray-700 rounded bg-gray-800 text-gray-400 text-center cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFilesDrop}
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                Drag & drop files here or click to upload
                <input
                  aria-label="filetype"
                  type="file"
                  id="fileInput"
                  multiple
                  className="hidden"
                  onChange={handleFilesSelect}
                />
              </div>

              {files.length > 0 && (
                <ul className="mt-2 space-y-1 text-sm text-white">
                  {files.map((file, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center bg-gray-700 px-2 py-1 rounded"
                    >
                      <span>{file.name}</span>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Save */}
            <button
              onClick={() => onSave?.(projectDetails)}
              className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-white"
            >
              Save Changes
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
