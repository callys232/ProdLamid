export interface CategoryColor {
  bg: string;
  text: string;
  border: string;
}

export const CATEGORY_COLORS: Record<string, CategoryColor> = {
  "Job Scoping":       { bg: "bg-orange-500",  text: "text-orange-400",  border: "border-orange-500" },
  "Disappearing Jobs": { bg: "bg-[#c21219]",   text: "text-red-400",     border: "border-[#c21219]" },
  "Reskilling":        { bg: "bg-blue-500",    text: "text-blue-400",    border: "border-blue-500" },
  Workshop:            { bg: "bg-purple-500",  text: "text-purple-400",  border: "border-purple-500" },
  Seminar:             { bg: "bg-green-500",   text: "text-green-400",   border: "border-green-500" },
  Networking:          { bg: "bg-yellow-500",  text: "text-yellow-400",  border: "border-yellow-500" },
  Conference:          { bg: "bg-teal-500",    text: "text-teal-400",    border: "border-teal-500" },
  Training:            { bg: "bg-pink-500",    text: "text-pink-400",    border: "border-pink-500" },
};

const FALLBACK_BG = [
  "bg-orange-500", "bg-[#c21219]", "bg-blue-500", "bg-green-500", "bg-purple-500",
];

export function getCategoryColor(category: string | undefined, index = 0): CategoryColor {
  if (category && CATEGORY_COLORS[category]) return CATEGORY_COLORS[category];
  const bg = FALLBACK_BG[index % FALLBACK_BG.length];
  return { bg, text: "text-orange-400", border: "border-orange-500" };
}

// The active categories used in the system — drives the legend
export const LEGEND_CATEGORIES: { label: string; color: CategoryColor }[] = [
  { label: "Job Scoping",       color: CATEGORY_COLORS["Job Scoping"] },
  { label: "Disappearing Jobs", color: CATEGORY_COLORS["Disappearing Jobs"] },
  { label: "Reskilling",        color: CATEGORY_COLORS["Reskilling"] },
];
