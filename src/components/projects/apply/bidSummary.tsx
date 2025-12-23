"use client";

import { motion } from "framer-motion";
import { FaMoneyBillWave, FaClock, FaFlag, FaTasks } from "react-icons/fa";
import { Project } from "@/types/project";

interface BidSummaryProps {
  projectId: string;
  project?: Project; // optional if you fetch project details here
}

export default function BidSummary({ projectId, project }: BidSummaryProps) {
  if (!project) {
    return (
      <div className="text-gray-400 text-sm">Loading project summary...</div>
    );
  }

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white mb-4">Project Summary</h2>

      {/* Budget */}
      {project.budget && (
        <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition">
          <FaMoneyBillWave className="text-[#c21219] text-xl" />
          <div>
            <p className="font-semibold text-white">{project.budget}</p>
            <p className="text-xs text-gray-300">Budget</p>
          </div>
        </div>
      )}

      {/* Suggested Bid Range */}
      {project.suggestedBidRange && (
        <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition">
          <FaMoneyBillWave className="text-[#c21219] text-xl" />
          <div>
            <p className="font-semibold text-white">
              ${project.suggestedBidRange.min} – $
              {project.suggestedBidRange.max}
            </p>
            <p className="text-xs text-gray-300">Suggested Bid Range</p>
          </div>
        </div>
      )}

      {/* Deadline */}
      {project.deadline && (
        <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition">
          <FaClock className="text-[#c21219] text-xl" />
          <div>
            <p className="font-semibold text-white">{project.deadline}</p>
            <p className="text-xs text-gray-300">Deadline</p>
          </div>
        </div>
      )}

      {/* Priority */}
      {project.priority && (
        <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition">
          <FaFlag className="text-[#c21219] text-xl" />
          <div>
            <p className="font-semibold text-white">{project.priority}</p>
            <p className="text-xs text-gray-300">Priority</p>
          </div>
        </div>
      )}

      {/* Milestones */}
      {project.milestones && project.milestones.length > 0 && (
        <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <FaTasks className="text-[#c21219] text-xl" />
            <p className="font-semibold text-white">Milestones</p>
          </div>
          <ul className="space-y-1 text-sm text-gray-300">
            {project.milestones.slice(0, 3).map((m, i) => (
              <li key={m.id || i}>
                <span className="text-white">{m.title}</span>
                {m.status && (
                  <span className="ml-2 text-xs text-gray-400">
                    [{m.status}]
                  </span>
                )}
              </li>
            ))}
          </ul>
          {project.milestones.length > 3 && (
            <p className="text-xs text-gray-400 mt-2">
              +{project.milestones.length - 3} more milestones
            </p>
          )}

          {/* Milestone Progress Bar */}
          {project.milestoneProgress !== undefined && (
            <div className="w-full bg-white/10 rounded-full h-2 mt-4">
              <div
                className="h-2 rounded-full bg-[#c21219]"
                style={{ width: `${project.milestoneProgress}%` }}
              />
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
