"use client";
import React from "react";

/* ---------- Tab Names ---------- */
export type TabName =
  | "Overview"
  | "Analytics Agent"
  | "Outreach & SEO Agent"
  | "Communication Agent"
  | "Finance & Billing"
  | "Policy & Compliance"
  | "Activity Logs";

interface SidebarProps {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
}

/* ---------- Tabs ---------- */
const tabs: TabName[] = [
  "Overview",
  "Analytics Agent",
  "Outreach & SEO Agent",
  "Communication Agent",
  "Finance & Billing",
  "Policy & Compliance",
  "Activity Logs",
];

export default function AdminSidebar({
  activeTab,
  onTabChange,
}: SidebarProps): React.ReactElement {
  return (
    <aside
      className="w-64 min-h-screen bg-[#010101]/80 backdrop-blur-md border-r border-[#1f1f1f]
                 flex flex-col shadow-lg"
    >
      {/* Logo / Title */}
      <div className="p-6 font-bold text-xl text-[#c21229] tracking-wide">
        Lamid Admin
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-1 px-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            aria-current={activeTab === tab ? "page" : undefined}
            className={`px-4 py-3 rounded-md text-sm font-medium transition-all relative
              ${
                activeTab === tab
                  ? "bg-[#c21229]/90 text-white shadow-md before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#c21229]"
                  : "bg-[#0f0f0f]/60 text-gray-300 hover:bg-[#c21229]/40 hover:text-white"
              }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </aside>
  );
}
