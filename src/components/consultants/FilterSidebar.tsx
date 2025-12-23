"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

export interface FilterOption<T extends { search: string }> {
  label: string;
  key: keyof T;
  options: string[];
  isRating?: boolean;
}

interface FilterSidebarProps<T extends { search: string }> {
  activeTab: "consultants" | "projects";
  filters: T;
  setFilters: React.Dispatch<React.SetStateAction<T>>;
  filterConfigs: FilterOption<T>[];
  showClearButton: boolean;
  handleClearFilters: () => void;
}

export default function FilterSidebar<T extends { search: string }>({
  activeTab,
  filters,
  setFilters,
  filterConfigs,
  showClearButton,
  handleClearFilters,
}: FilterSidebarProps<T>) {
  return (
    <div className="bg-[#010101] border border-[#a71414] rounded-2xl p-5 shadow-lg space-y-6 relative overflow-hidden sticky top-6">
      <h3 className="text-lg font-bold text-white mb-3">
        {activeTab === "consultants" ? "Consultant Filters" : "Project Filters"}
      </h3>

      {/* Search */}
      <div>
        <label htmlFor="search" className="text-sm text-gray-400">
          Search
        </label>
        <div className="relative mt-1">
          <input
            id="search"
            type="text"
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value } as T)
            }
            placeholder={`Search ${activeTab}...`}
            className="w-full bg-transparent border border-[#a71414] text-gray-100 placeholder-gray-500 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d31c1c]"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Filters */}
      {filterConfigs.map(({ label, key, options, isRating }) => (
        <div key={String(key)}>
          <label className="text-sm text-gray-400">{label}</label>
          <select
            aria-label={`Filter by ${label}`}
            value={filters[key] as string}
            onChange={(e) =>
              setFilters({ ...filters, [key]: e.target.value } as T)
            }
            className="w-full bg-[#010101] border border-[#a71414] text-gray-100 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d31c1c]"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {isRating && opt !== "All"
                  ? "★".repeat(Number(opt)) + "☆".repeat(5 - Number(opt))
                  : opt}
              </option>
            ))}
          </select>
        </div>
      ))}

      {/* Clear Button */}
      <AnimatePresence>
        {showClearButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={handleClearFilters}
            className="w-full mt-5 font-semibold py-2 rounded-md bg-[#a71414]/80 hover:bg-[#d31c1c] text-white hover:scale-[1.02] focus:ring-2 focus:ring-[#d31c1c] transition-all"
          >
            Clear Filters ✨
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
