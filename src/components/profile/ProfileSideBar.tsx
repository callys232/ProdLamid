"use client";

import { useState } from "react";
import { UserGuide } from "@/components/Guides/UserGuide";
import { consultantSidebarGuide } from "@/lib/UserGuide/consultantSidebarGuide";
import LogoutButton from "@/components/logout";
import PointsBalance from "@/components/points/PointsBalance";
import { Role } from "@/lib/auth";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role?: Role;
}

export default function ProfileSidebar({
  activeTab,
  setActiveTab,
  role = "client",
}: SidebarProps) {

  // ✅ Auto-open on first visit
  const [showGuide, setShowGuide] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("lamid-freelancer-sidebar-guide-v1");
  });

  const tabs = [
    { key: "overview",         label: "Overview",         guide: "guide-freelancer-overview"  },
    { key: "projects",         label: "Projects",         guide: "guide-freelancer-projects"  },
    { key: "settings",         label: "Settings",         guide: "guide-freelancer-settings"  },
    { key: "teams",            label: "Teams",            guide: "guide-freelancer-teams"     },
    { key: "notifications",    label: "Notifications",    guide: undefined                    },
    { key: "messaging",        label: "Messaging",        guide: "guide-freelancer-messaging" },
    { key: "project-matching", label: "Project Matching", guide: "guide-freelancer-matching"  },
    { key: "escrow",           label: "Escrow",           guide: "guide-freelancer-escrow"    },
    { key: "wallet",           label: "Wallet",           guide: undefined                    },
    { key: "earnings",         label: "Earnings",         guide: undefined                    },
    { key: "portfolio",        label: "Portfolio",        guide: undefined                    },
  ];

  return (
    <nav className="relative h-full p-2">

      {/* Guide Trigger */}
      <button
        onClick={() => setShowGuide(true)}
        className="mb-4 w-full text-sm border border-gray-600 text-gray-400 hover:text-blue-500 hover:border-blue-500 px-3 py-2 rounded-md transition"
      >
        Sidebar Guide
      </button>

      <ul>
        {tabs.map((tab) => (
          <li key={tab.key}>
            <button
              type="button"
              data-guide={tab.guide}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full text-left px-4 py-3 cursor-pointer transition-colors rounded-md ${
                activeTab === tab.key ? "bg-blue-600 text-white" : "hover:bg-gray-700 text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Points balance chip */}
      <div className="px-2 mb-3">
        <PointsBalance compact />
      </div>

      {/* Logout section */}
      <div className="mt-0 pt-4 border-t border-gray-700">
        <div className="px-2">
          <LogoutButton role={role} className="w-full justify-start" />
        </div>
      </div>

      {/* User Guide */}
      <UserGuide
        storageKey="lamid-freelancer-sidebar-guide-v1"
        steps={consultantSidebarGuide}
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
      />
    </nav>
  );
}