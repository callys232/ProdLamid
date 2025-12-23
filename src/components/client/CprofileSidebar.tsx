"use client";

import {
  FaUser,
  FaCog,
  FaUsers,
  FaBell,
  FaLock,
  FaEnvelopeOpenText,
} from "react-icons/fa";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ProfileSidebar({
  activeTab,
  setActiveTab,
}: SidebarProps) {
  const tabs = [
    { key: "overview", label: "Overview", icon: <FaUser /> },
    { key: "settings", label: "Settings", icon: <FaCog /> },
    { key: "teams", label: "Teams", icon: <FaUsers /> },
    { key: "notifications", label: "Notifications", icon: <FaBell /> },
    { key: "escrow", label: "Escrow", icon: <FaLock /> },
    { key: "invitations", label: "Invitations", icon: <FaEnvelopeOpenText /> },
  ];

  return (
    <nav
      className="w-full sm:w-64 h-auto sm:h-full p-2 mt-20 bg-gray-900 sm:bg-transparent"
      role="navigation"
      aria-label="Client dashboard"
    >
      <ul className="space-y-1">
        {tabs.map((tab) => (
          <li key={tab.key}>
            <button
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-800 ${
                activeTab === tab.key
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
    </nav>
  );
}
