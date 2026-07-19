"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page:     number;
  pages:    number;
  total:    number;
  limit:    number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, pages, total, limit, onChange }: Props) {
  if (pages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end   = Math.min(page * limit, total);

  // Show at most 5 page buttons with ellipsis
  function getPageNumbers(): (number | "…")[] {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
    if (page <= 4)  return [1, 2, 3, 4, 5, "…", pages];
    if (page >= pages - 3) return [1, "…", pages - 4, pages - 3, pages - 2, pages - 1, pages];
    return [1, "…", page - 1, page, page + 1, "…", pages];
  }

  const pageNums = getPageNumbers();

  return (
    <div className="flex flex-col items-center gap-3 pt-4">
      <p className="text-xs text-gray-500">
        Showing <span className="text-white">{start}–{end}</span> of <span className="text-white">{total}</span>
      </p>

      <div className="flex items-center gap-1.5">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition hover:border-white/20 hover:text-white disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </motion.button>

        {pageNums.map((n, i) =>
          n === "…" ? (
            <span key={`ellipsis-${i}`} className="px-1 text-gray-600">…</span>
          ) : (
            <motion.button
              key={n}
              whileTap={{ scale: 0.9 }}
              onClick={() => onChange(n as number)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition ${
                n === page
                  ? "bg-[#2563EB] text-white"
                  : "border border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {n}
            </motion.button>
          )
        )}

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(page + 1)}
          disabled={page === pages}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition hover:border-white/20 hover:text-white disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
}
