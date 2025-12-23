"use client";

import { useState } from "react";

interface JobFilterProps {
  active: string;
  options: string[];
  counts: Record<string, number>;
  onChange: (option: string) => void;
  label?: string;
}

export default function JobFilter({
  active,
  options,
  counts,
  onChange,
  label,
}: JobFilterProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [clicked, setClicked] = useState<string | null>(null);
  const [focusIndex, setFocusIndex] = useState<number>(0);

  const showTooltip = (opt: string) => hovered === opt || clicked === opt;

  const classes = (opt: string) =>
    `relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
     border ${
       active === opt
         ? "bg-[#c21219] text-white border-[#c21219] shadow-md"
         : "bg-gray-800 text-gray-300 border-transparent hover:border-[#c21219] hover:text-[#c21219]"
     }`;

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
    opt: string
  ) => {
    if (e.key === "ArrowRight") {
      setFocusIndex((prev) => (prev + 1) % options.length);
    } else if (e.key === "ArrowLeft") {
      setFocusIndex((prev) => (prev - 1 + options.length) % options.length);
    } else if (e.key === "Enter" || e.key === " ") {
      onChange(opt);
      setClicked(opt);
      setTimeout(() => setClicked(null), 2000);
    }
  };

  return (
    <div className="mb-4">
      {label && <p className="text-sm text-gray-400 mb-2">{label}</p>}
      <div
        className="flex flex-wrap gap-2"
        role="radiogroup"
        aria-label={label || "Job categories"}
      >
        {options.map((opt, i) => (
          <div
            key={opt}
            className="relative"
            onMouseEnter={() => setHovered(opt)}
            onMouseLeave={() => setHovered(null)}
          >
            <button
              type="button"
              aria-label={`Filter by ${opt}`}
              // aria-pressed={active === opt ? "true" : "false"} // ✅ string values
              className={classes(opt)}
              onClick={() => {
                onChange(opt);
                setClicked(opt);
                setTimeout(() => setClicked(null), 2000);
              }}
              onKeyDown={(e) => handleKeyDown(e, i, opt)}
              tabIndex={focusIndex === i ? 0 : -1}
            >
              {opt}
              {counts[opt] !== undefined && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-white/20 text-gray-200">
                  {counts[opt]}
                </span>
              )}
            </button>

            {showTooltip(opt) && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                {counts[opt]} {opt} {counts[opt] === 1 ? "job" : "jobs"}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
