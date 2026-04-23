"use client";

import { useState } from "react";
import { Dropdown } from "./dropdown";
import { MilestonesDropdown } from "./milestoneDropdown";
import MessagesDropdown from "./messageDropdown";
import ProjectDocumentsDropdown from "./projectDropdown";
import type { Escrow, Milestone, Message } from "@/types/escrow";

interface DashboardTabsProps {
  escrow?: Escrow | null;
  messages: Message[];
}

const tabs = ["Milestones", "Messages", "Documents"] as const;
type Tab = (typeof tabs)[number];

export default function DashboardTabs({
  escrow,
  messages,
}: DashboardTabsProps) {
  const [openTab, setOpenTab] = useState<Tab | null>(null);

  function toggleTab(tab: Tab) {
    setOpenTab(openTab === tab ? null : tab);
  }

  if (!escrow) {
    return (
      <div className="p-4 text-gray-400 text-sm">No escrow data available</div>
    );
  }

  // Count milestones by status safely
  const milestoneCounts =
    escrow.milestones?.reduce((acc: Record<string, number>, m: Milestone) => {
      acc[m.status] = (acc[m.status] || 0) + 1;
      return acc;
    }, {}) ?? {};

  // Messages count comes from live state
  const messageCount = messages.length;

  // Documents count safely
  const documentsCount = escrow.documents?.length ?? 0;

  return (
    <div className="relative flex gap-4">
      {tabs.map((tab) => {
        const isMilestones = tab === "Milestones";
        const isMessages = tab === "Messages";
        const isDocuments = tab === "Documents";

        const count = isMilestones
          ? Object.values(milestoneCounts).reduce((a, b) => a + b, 0)
          : isMessages
          ? messageCount
          : documentsCount;

        // Badge color logic
        let badgeColor = "bg-gray-600 text-white";
        if (isMilestones) {
          if (milestoneCounts["disputed"]) badgeColor = "bg-red-600 text-white";
          else if (milestoneCounts["in_progress"])
            badgeColor = "bg-yellow-500 text-black";
          else if (milestoneCounts["completed"])
            badgeColor = "bg-green-600 text-white";
        } else if (isMessages) {
          badgeColor =
            count > 0 ? "bg-blue-600 text-white" : "bg-gray-600 text-white";
        } else if (isDocuments) {
          badgeColor =
            count > 0 ? "bg-purple-600 text-white" : "bg-gray-600 text-white";
        }

        return (
          <div key={tab} className="relative">
            <button
              onClick={() => toggleTab(tab)}
              className="
                relative
                rounded-lg
                bg-red-600
                px-5 py-2
                text-sm font-medium text-white
                transition-all
                hover:bg-red-500
                hover:scale-[1.05]
              "
            >
              {tab}
              <span
                aria-label={`${tab} count: ${count}`}
                className={`
                  absolute -top-2 -right-2
                  flex min-h-[20px] min-w-[20px] items-center justify-center
                  rounded-full text-xs font-bold shadow-md
                  px-1
                  ${badgeColor}
                `}
              >
                {count}
              </span>
            </button>

            <Dropdown isOpen={openTab === tab}>
              {isMilestones && <MilestonesDropdown />}
              {isMessages && <MessagesDropdown messages={messages} />}
              {isDocuments && (
                <ProjectDocumentsDropdown
                  escrow={escrow}
                  isOpen={openTab === "Documents"}
                />
              )}
            </Dropdown>
          </div>
        );
      })}
    </div>
  );
}
