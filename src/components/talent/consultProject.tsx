"use client";

import { useState } from "react";
import ConsultantsSection from "../consultants/consultancyMatching";
import ProjectsSection from "../projects/projectDis";

export default function ConsultancyMatchingSection() {
  const [activeTab, setActiveTab] = useState<"consultants" | "projects">(
    "consultants"
  );
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <section className="w-full min-h-screen bg-[#0c0000] text-white font-sans flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          Consultancy & Project Matching
        </h2>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-4">
          {["consultants", "projects"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab as "consultants" | "projects");
                setShowSidebar(true); // reset sidebar when switching
              }}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                activeTab === tab
                  ? "bg-red-600 text-white"
                  : "bg-[#1a0d0d] border border-[#a71414] text-gray-200 hover:bg-[#010101]"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Sidebar Toggle (Desktop only) */}
        <div className="hidden lg:flex justify-center mb-4">
          <button
            onClick={() => setShowSidebar((prev) => !prev)}
            className="text-sm px-4 py-2 rounded-md bg-[#1a0d0d] border border-[#a71414] text-gray-300 hover:bg-[#010101] transition"
          >
            {showSidebar ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 lg:px-8">
        {activeTab === "consultants" ? (
          <ConsultantsSection showSidebar={showSidebar} />
        ) : (
          <ProjectsSection showSidebar={showSidebar} />
        )}
      </div>
    </section>
  );
}
