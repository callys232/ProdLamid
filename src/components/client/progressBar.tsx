import React from "react";

type ProgressBarProps = {
  label: string;
  value: number; // between 0–100
};

export default function ProgressBar({ label, value }: ProgressBarProps) {
  const safeValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className="w-full">
      <div
        id={`${label}-label`}
        className="flex justify-between text-xs text-gray-400 mb-2"
      >
        <span>{label}</span>
        <span className="font-medium text-white">{safeValue}%</span>
      </div>

      <progress
        className="w-full h-2 rounded-full overflow-hidden bg-gray-700"
        value={safeValue}
        max={100}
        aria-labelledby={`${label}-label`}
      />
    </div>
  );
}
