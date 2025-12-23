"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Milestone, MilestoneStatus } from "@/types/project";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaFlag,
  FaChevronDown,
} from "react-icons/fa";

interface MilestoneItemProps {
  milestone: Milestone; // ✅ use shared type
  accomplished?: boolean;
  stats?: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  };
  expanded?: boolean; // optional controlled
  onExpandChange?: (expanded: boolean) => void;
}

/* -------------------- HELPERS -------------------- */
function getProgressGradient(progress: number): string {
  if (progress >= 80) return "from-green-500 via-green-400 to-emerald-500";
  if (progress >= 40) return "from-yellow-500 via-amber-400 to-orange-500";
  return "from-red-500 via-rose-500 to-pink-500";
}

function getPercentColor(progress: number): string {
  if (progress >= 80) return "text-green-200";
  if (progress >= 40) return "text-yellow-200";
  return "text-red-200";
}

function getStatusIcon(status?: MilestoneStatus) {
  switch (status) {
    case "completed":
      return <FaCheckCircle className="text-green-400" aria-hidden="true" />;
    case "in_progress":
    case "pending":
      return <FaClock className="text-yellow-400" aria-hidden="true" />;
    case "cancelled":
    case "disputed":
      return <FaTimesCircle className="text-red-400" aria-hidden="true" />;
    default:
      return <FaFlag className="text-gray-400" aria-hidden="true" />;
  }
}

/* -------------------- COMPONENT -------------------- */
export function MilestoneItem({
  milestone,
  accomplished,
  stats,
  expanded = false,
  onExpandChange,
}: MilestoneItemProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync controlled prop
  useEffect(() => {
    setIsExpanded(expanded);
  }, [expanded]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
        onExpandChange?.(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onExpandChange]);

  const {
    title,
    description,
    amount,
    dueDate,
    status,
    progress = 0,
  } = milestone;
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  const toggleExpand = () => {
    const next = !isExpanded;
    setIsExpanded(next);
    onExpandChange?.(next);
  };

  return (
    <motion.article
      ref={containerRef}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-gray-800 rounded-md p-4 shadow-md ring-1 ring-gray-700 hover:ring-2 hover:ring-red-500 transition transform hover:scale-[1.01] cursor-pointer"
      onClick={toggleExpand}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
              accomplished
                ? "bg-green-600 text-white"
                : "bg-yellow-600 text-white"
            }`}
          >
            {getStatusIcon(status)}
            {status ?? "unknown"}
          </span>
          <FaChevronDown
            className={`transition-transform duration-300 ${
              isExpanded ? "rotate-180" : "rotate-0"
            } text-gray-300`}
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full bg-gray-700 rounded-full h-4 mt-1 overflow-hidden">
        <motion.div
          className={`h-4 rounded-full bg-gradient-to-r ${getProgressGradient(
            safeProgress
          )}`}
          initial={{ width: 0 }}
          animate={{ width: `${safeProgress}%` }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          role="progressbar"
          aria-label="Milestone progress"
          aria-valuenow={safeProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
        <span
          className={`absolute inset-0 flex items-center justify-center text-[10px] font-semibold ${getPercentColor(
            safeProgress
          )}`}
        >
          {safeProgress}%
        </span>
      </div>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 text-xs text-gray-300 overflow-hidden"
          >
            {/* Milestone details */}
            {description && <p className="mb-1">{description}</p>}
            {amount !== undefined && (
              <p>
                💰{" "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(amount)}
              </p>
            )}
            {dueDate && <p>📅 Due: {dueDate}</p>}
            <p>Status: {status ?? "unknown"}</p>
            <p>Progress: {safeProgress}%</p>

            {/* Global stats */}
            {stats && (
              <div className="mt-2 border-t border-gray-700 pt-2">
                <p>Total Milestones: {stats.total}</p>
                <p>Completed: {stats.completed}</p>
                <p>Pending: {stats.pending}</p>
                <p>Overdue: {stats.overdue}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
