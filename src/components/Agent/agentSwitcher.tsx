// components/AgentSwitcher.tsx
"use client";

import React from "react";
import type { AgentType } from "@/types/agentTypes";

interface AgentSwitcherProps {
  onSwitch: (agent: AgentType) => void;
  activeAgent?: AgentType;
}

const agents: {
  id: AgentType;
  name: string;
  description: string;
  emoji: string;
  color: string;
}[] = [
  {
    id: "learning",
    name: "Learning",
    description: "Boost knowledge fast",
    emoji: "📘",
    color: "blue-500",
  },
  {
    id: "support",
    name: "Support",
    description: "Fix issues instantly",
    emoji: "🛠️",
    color: "red-500",
  },
  {
    id: "shopping",
    name: "Shopping",
    description: "Find deals & products",
    emoji: "🛒",
    color: "green-500",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Design & brainstorm ideas",
    emoji: "🎨",
    color: "purple-500",
  },
  {
    id: "productivity",
    name: "Productivity",
    description: "Organize tasks & time",
    emoji: "⏰",
    color: "yellow-500",
  },
  {
    id: "project",
    name: "Project",
    description: "Manage teams & milestones",
    emoji: "📂",
    color: "sky-500",
  },
];

export default function AgentSwitcher({
  onSwitch,
  activeAgent,
}: AgentSwitcherProps) {
  return (
    <div className="mt-6 bg-black/40 backdrop-blur-xl p-6 rounded-xl border border-[#374151] shadow-lg">
      <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
        🔀 <span>Switch Agents</span>
      </h4>
      <div className="grid grid-cols-2 gap-4">
        {agents.map((agent) => {
          const isActive = activeAgent === agent.id;
          return (
            <button
              type="button"
              key={agent.id}
              onClick={() => onSwitch(agent.id)}
              //   aria-pressed={!!isActive} // ✅ boolean, no quotes
              className={`w-full px-4 py-3 rounded-xl text-white font-medium flex flex-col items-center justify-center gap-1 transition transform
    bg-black/60 backdrop-blur-md
    border border-transparent
    hover:border-${agent.color}
    hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]
    hover:scale-105
    relative overflow-hidden
    ${isActive ? `ring-2 ring-${agent.color} scale-105` : ""}
  `}
              title={`${agent.name} Agent`}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition duration-700 animate-pulse" />
              <span className="text-lg">{agent.emoji}</span>
              <span className="text-xs text-gray-300">{agent.description}</span>
              {isActive && <span className="ml-1 text-xs">✔</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
