"use client";

import React, { useState } from "react";
import OnboardingAgent from "./Onboarding";
import ProjectAgent from "./project/projectAgent";
import CommunicationAgent from "./communicationAgent/Communicate";
import AnalyticsAgent from "./analyticsAgent";
import OutreachAgent from "./outreach/outreachSeo";

type AgentKey =
  | "onboarding"
  | "project"
  | "communication"
  | "analytics"
  | "outreach";

export default function AgentShell() {
  const [activeAgent, setActiveAgent] = useState<AgentKey>("onboarding");

  const [clientId] = useState("client1");
  const [projectId] = useState("project1");

  const items: { key: AgentKey; label: string; emoji: string }[] = [
    { key: "onboarding", label: "Onboarding & Guidance", emoji: "🧭" },
    { key: "project", label: "Project & Team Intelligence", emoji: "📂" },
    { key: "communication", label: "Communication & Risk", emoji: "📢" },
    { key: "analytics", label: "Analytics & Recommendation", emoji: "📊" },
    { key: "outreach", label: "Outreach & SEO", emoji: "✉️" },
  ];

  return (
    <div className="flex min-h-screen bg-[#010101] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#010101] border-r border-[#1f1f1f] p-4 space-y-2">
        <h1 className="text-lg font-bold mb-4">Lamid Portal</h1>
        {items.map((it) => (
          <button
            key={it.key}
            onClick={() => setActiveAgent(it.key)}
            className={`w-full text-left px-3 py-2 rounded transition-colors ${
              activeAgent === it.key
                ? "bg-[#1a1a1a] border border-[#333]"
                : "hover:bg-[#1a1a1a]"
            }`}
          >
            <span className="mr-2">{it.emoji}</span>
            {it.label}
          </button>
        ))}
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeAgent === "onboarding" && <OnboardingAgent />}
        {activeAgent === "project" && <ProjectAgent />}
        {activeAgent === "communication" && (
          <CommunicationAgent clientId={clientId} />
        )}{" "}
        {activeAgent === "analytics" && <AnalyticsAgent />}
        {activeAgent === "outreach" && (
          <OutreachAgent projectId={projectId} />
        )}{" "}
      </main>

      {/* Context panel */}
      <aside className="w-80 hidden xl:block border-l border-[#1f1f1f] bg-[#0b0b0b] p-4">
        <h3 className="text-sm font-semibold text-gray-300">Context</h3>
        <ul className="mt-3 space-y-2 text-sm text-gray-400">
          <li>FAQs</li>
          <li>Premium suggestions</li>
          <li>Recent alerts</li>
        </ul>
      </aside>
    </div>
  );
}
