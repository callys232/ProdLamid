"use client";

import { useState } from "react";
import { UserGuide } from "@/components/Guides/UserGuide";
import { profileSidebarGuide } from "@/lib/UserGuide/sideBar";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ProfileSidebar({
  activeTab,
  setActiveTab,
}: SidebarProps) {

  // ✅ Auto-open on first visit
  const [showGuide, setShowGuide] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("lamid-profile-sidebar-guide");
  });

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "projects", label: "Projects" },
    { key: "settings", label: "Settings" },
    { key: "teams", label: "Teams" },
    { key: "notifications", label: "Notifications" },
    { key: "escrow", label: "Escrow & Wallet" },
  ];

  return (
    <nav className="relative h-full p-2">

      {/* Guide Trigger */}
      <button
        onClick={() => setShowGuide(true)}
        className="mb-4 w-full text-sm border border-gray-600 text-gray-400 hover:text-red-500 hover:border-red-500 px-3 py-2 rounded-md transition"
      >
        Sidebar Guide
      </button>

      <ul>
        {tabs.map((tab) => (
          <li
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 cursor-pointer transition-colors rounded-md ${activeTab === tab.key
              ? "bg-red-600 text-white"
              : "hover:bg-gray-700 text-gray-300"
              }`}
          >
            {tab.label}
          </li>
        ))}
      </ul>

      {/* User Guide */}
      <UserGuide
        storageKey="lamid-profile-sidebar-guide"
        steps={profileSidebarGuide}
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
      />
    </nav>
  );
}