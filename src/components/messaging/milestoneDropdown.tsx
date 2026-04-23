"use client";

import { useEffect, useState } from "react";
import { mockEscrow } from "@/mocks/mocksEscrow";
import type { Escrow } from "@/types/escrow";
import { Check } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  progress: number; // percentage
}

export function MilestonesDropdown() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    async function fetchMilestones() {
      try {
        const res = await fetch("/api/milestones");
        if (!res.ok) throw new Error("DB failed");
        const data: Milestone[] = await res.json();
        setMilestones(data);
      } catch {
        const fallback: Escrow = mockEscrow;
        setMilestones(fallback.milestones || []);
      }
    }
    fetchMilestones();
  }, []);

  return (
    <div className="p-4">
      <div
        className={`
          grid gap-8
          ${milestones.length > 4 ? "grid-cols-2" : "grid-cols-1"}
        `}
      >
        {milestones.map((m, idx) => (
          <div key={m.id} className="relative flex items-center gap-3">
            {/* Circle marker with animation */}
            <div
              className={`
                flex h-6 w-6 items-center justify-center rounded-full border-2
                transition-all duration-500 ease-out
                ${
                  m.progress === 100
                    ? "bg-red-600 border-red-600 scale-110"
                    : "border-red-600"
                }
              `}
            >
              {m.progress === 100 && (
                <Check className="h-4 w-4 text-white animate-fadeIn" />
              )}
            </div>

            {/* Title + progress */}
            <div>
              <p className="text-white text-sm font-medium">{m.title}</p>
              <p className="text-gray-400 text-xs transition-all duration-500">
                {m.progress}% complete
              </p>
            </div>

            {/* Transition line */}
            {idx < milestones.length - 1 && (
              <div className="absolute left-3 top-6 h-8 w-0.5 bg-red-600/40 animate-growLine" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
