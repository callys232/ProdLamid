"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

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
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const visible = query.trim()
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  return (
    <div className="mb-6 space-y-3">
      {label && <p className="text-sm text-gray-400">{label}</p>}

      {/* Search */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search categories…"
          className="w-52 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#c21219] focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="rounded-lg bg-gray-700 px-3 py-2 text-xs text-white transition hover:bg-gray-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category pills — always visible */}
      {visible.length > 0 ? (
        <div
          role="radiogroup"
          aria-label={label ?? "Job categories"}
          className="flex flex-wrap gap-2"
        >
          {visible.map((opt) => {
            const isActive = active === opt;
            return (
              <motion.button
                key={opt}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => onChange(opt)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className={`relative flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-[#c21219] bg-[#c21219] text-white shadow-md"
                    : "border-transparent bg-gray-800 text-gray-300 hover:border-[#c21219] hover:text-[#c21219]"
                }`}
              >
                {opt}
                {counts[opt] != null && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      isActive ? "bg-white/25 text-white" : "bg-white/10 text-gray-400"
                    }`}
                  >
                    {counts[opt]}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No categories match &ldquo;{query}&rdquo;.</p>
      )}
    </div>
  );
}
