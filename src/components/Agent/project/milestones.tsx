// components/MilestoneCard.tsx
"use client";

import React, { useState } from "react";

export interface Milestone {
  title: string;
  deadline: string;
  progress: number; // percentage
}

interface MilestoneCardProps {
  milestone: Milestone;
  onReassign: (milestone: Milestone) => void;
  onOverride: (milestone: Milestone) => void;
  onUpdateProgress: (milestone: Milestone, newProgress: number) => void;
}

export default function MilestoneCard({
  milestone,
  onReassign,
  onOverride,
  onUpdateProgress,
}: MilestoneCardProps) {
  const [progress, setProgress] = useState(milestone.progress);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setProgress(value);
    onUpdateProgress(milestone, value);
  };

  return (
    <div className="bg-[#1a1a1a] p-4 rounded border border-[#374151] mb-4 hover:border-[#3b82f6] transition">
      <h4 className="font-semibold text-white">{milestone.title}</h4>
      <p className="text-sm text-gray-400">Deadline: {milestone.deadline}</p>

      {/* Progress bar */}
      <div className="bg-[#333] h-2 rounded mt-3">
        <div
          className="bg-[#3b82f6] h-2 rounded transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Inline progress editor */}
      <div className="mt-3 flex items-center gap-2">
        <input
          aria-label="range"
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={handleProgressChange}
          className="flex-1 accent-[#3b82f6]"
        />
        <span className="text-sm text-gray-300">{progress}%</span>
      </div>

      {/* Action buttons */}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="px-3 py-1 bg-[#3b82f6] text-white rounded hover:bg-[#2563eb] focus:ring-2 focus:ring-[#3b82f6]"
          onClick={() => onReassign(milestone)}
        >
          Assign consultant
        </button>
        <button
          type="button"
          className="px-3 py-1 bg-[#0f0f0f] border border-[#374151] text-white rounded hover:bg-[#1f1f1f] focus:ring-2 focus:ring-[#374151]"
          onClick={() => onOverride(milestone)}
        >
          Override
        </button>
      </div>
    </div>
  );
}
