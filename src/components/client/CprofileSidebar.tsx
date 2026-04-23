"use client";

import { useEffect, useState } from "react";
import {
  FaUser,
  FaCog,
  FaUsers,
  FaBell,
  FaLock,
  FaEnvelopeOpenText,
  FaFolder,
  FaEnvelope,
} from "react-icons/fa";
import { UserGuide } from "@/components/Guides/UserGuide";
import { profileSidebarGuideSteps } from "@/lib/UserGuide/cleintSideBar";
import LogoutButton from "@/components/logout";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role?: "client" | "freelancer" | string;
}

export default function ProfileSidebar({
  activeTab,
  setActiveTab,
  role = "client",
}: SidebarProps) {
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(
      "lamid-profile-sidebar-guide-v1"
    );
    if (!seen) {
      setShowGuide(true);
    }
  }, []);

  const tabs = [
    { key: "overview", label: "Overview", icon: <FaUser />, guide: "guide-overview-tab" },
    { key: "settings", label: "Settings", icon: <FaCog />, guide: "guide-settings-tab" },
    { key: "teams", label: "Teams", icon: <FaUsers />, guide: "guide-teams-tab" },
    { key: "notifications", label: "Notifications", icon: <FaBell />, guide: "guide-notifications-tab" },
    { key: "escrow", label: "Escrow", icon: <FaLock />, guide: "guide-escrow-tab" },
    { key: "invitations", label: "Invitations", icon: <FaEnvelopeOpenText />, guide: "guide-invitations-tab" },
    { key: "projects", label: "Projects", icon: <FaFolder /> },
    { key: "messaging", label: "Messaging", icon: <FaEnvelope /> },
  ];

  return (
    <nav
      className="relative w-full sm:w-64 h-auto sm:h-full p-2 mt bg-gray-900 sm:bg-transparent flex flex-col"
      role="navigation"
      aria-label="Client dashboard"
    >
      {/* Start Guide Button */}
      <div className="flex justify-end mb-3">
        <button
          onClick={() => setShowGuide(true)}
          className="text-xs px-3 py-1 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-red-500"
        >
          See Guide
        </button>
      </div>

      <ul className="space-y-1 flex-1">
        {tabs.map((tab) => (
          <li key={tab.key}>
            <button
              type="button"
              data-guide={tab.guide}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-800 ${activeTab === tab.key
                ? "bg-red-600 text-white"
                : "hover:bg-gray-700 text-gray-300"
                }`}
              aria-current={activeTab === tab.key ? "page" : undefined}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* Logout section */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="px-2">
          <LogoutButton role={role} className="w-full justify-start" />
        </div>
      </div>

      {/* Guide Component */}
      <UserGuide
        storageKey="lamid-profile-sidebar-guide-v1"
        steps={profileSidebarGuideSteps}
        isOpen={showGuide}
        onClose={() => {
          localStorage.setItem(
            "lamid-profile-sidebar-guide-v1",
            "true"
          );
          setShowGuide(false);
        }}
      />
    </nav>
  );
}
