"use client";

import React from "react";

interface ProgressBarProps {
  progress: number; // expected 0–100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  // Clamp progress between 0 and 100 to avoid overflow
  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="mb-4">
      <div
        role="progressbar"
        aria-valuenow={safeProgress} // number expression
        aria-valuemin={0} // number expression
        aria-valuemax={100} // number expression
      >
        <div
          className="bg-orange-500 h-4 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${safeProgress}%` }}
        />
      </div>

      <p className="text-right text-white text-sm mt-1">
        {safeProgress}% completed
      </p>
    </div>
  );
};

export default ProgressBar;
