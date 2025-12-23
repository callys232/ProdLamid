"use client";

import React, { useState } from "react";

interface AnalyticsSection {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
}

interface AnalyticsFlowProps {
  sections: AnalyticsSection[];
}

export default function AnalyticsFlow({ sections }: AnalyticsFlowProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goNext = () => {
    if (activeIndex < sections.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const goPrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const activeSection = sections[activeIndex];

  return (
    <div>
      {/* Navigation Tabs */}
      <div className="flex gap-3 mb-4 border-b border-[#374151]">
        {sections.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setActiveIndex(idx)}
            className={`px-3 py-2 text-sm rounded-t ${
              activeIndex === idx
                ? "bg-[#1a1a1a] text-white border border-[#374151] border-b-0"
                : "bg-[#0f0f0f] text-gray-400 hover:text-white"
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Active Section */}
      <div className="bg-[#1a1a1a] p-4 rounded border border-[#374151]">
        <h4 className="text-white font-semibold mb-2">{activeSection.title}</h4>
        <p className="text-gray-400 text-sm mb-3">
          {activeSection.description}
        </p>
        {activeSection.content}

        {/* Next/Prev Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={goPrev}
            disabled={activeIndex === 0}
            className={`px-3 py-1 rounded ${
              activeIndex === 0
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-[#3b82f6] text-white hover:bg-[#2563eb]"
            }`}
          >
            Previous
          </button>
          <button
            onClick={goNext}
            disabled={activeIndex === sections.length - 1}
            className={`px-3 py-1 rounded ${
              activeIndex === sections.length - 1
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-[#3b82f6] text-white hover:bg-[#2563eb]"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
