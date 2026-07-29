"use client";

import { LEGEND_CATEGORIES } from "@/lib/eventColors";

const CategoryLegend = () => (
  <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6 py-3 px-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
    {LEGEND_CATEGORIES.map(({ label, color }) => (
      <div key={label} className="flex items-center gap-2">
        <span className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${color.bg}`} />
        <span className="text-xs text-gray-600 whitespace-nowrap">{label}</span>
      </div>
    ))}
  </div>
);

export default CategoryLegend;
