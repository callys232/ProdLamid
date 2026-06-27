"use client";

import React from "react";
import { motion } from "framer-motion";
import type { AgentType } from "@/types/agentTypes";

interface AgentSwitcherProps {
  onSwitch:    (agent: AgentType) => void;
  activeAgent?: AgentType;
  isAdmin?:    boolean;
}

const AGENTS: {
  id:          AgentType;
  name:        string;
  description: string;
  emoji:       string;
  hex:         string;
  adminOnly?:  boolean;
  locked?:     boolean;
}[] = [
  { id: "project",       name: "Project",       description: "Manage teams & milestones", emoji: "📂", hex: "#3b82f6" },
  { id: "analytics",     name: "Analytics",     description: "Performance & reports",     emoji: "📊", hex: "#10b981" },
  { id: "communication", name: "Comms",         description: "Alerts & notifications",    emoji: "📢", hex: "#8b5cf6" },
  { id: "learning",      name: "Learning",      description: "Boost knowledge fast",      emoji: "📘", hex: "#06b6d4", locked: true },
  { id: "support",       name: "Support",       description: "Fix issues instantly",      emoji: "🛠️", hex: "#ef4444", locked: true },
  { id: "creative",      name: "Creative",      description: "Design & brainstorm",       emoji: "🎨", hex: "#a855f7" },
  { id: "productivity",  name: "Productivity",  description: "Organize tasks & time",     emoji: "⏰", hex: "#eab308", locked: true },
  { id: "shopping",      name: "Shopping",      description: "Find business tools",       emoji: "🛒", hex: "#22c55e", locked: true },
  { id: "outreach",      name: "Outreach",      description: "Campaigns & SEO",           emoji: "✉️", hex: "#f97316", adminOnly: true },
];

export default function AgentSwitcher({ onSwitch, activeAgent, isAdmin = false }: AgentSwitcherProps) {
  const visible = AGENTS.filter(a => !a.adminOnly || isAdmin);

  return (
    <div className="mt-4 bg-black/40 backdrop-blur-xl p-4 rounded-xl border border-white/10">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Switch Agent</p>
      <div className="grid grid-cols-3 gap-2">
        {visible.map((agent) => {
          const isActive  = activeAgent === agent.id;
          const isLocked  = agent.locked;

          return (
            <motion.button
              key={agent.id}
              type="button"
              whileHover={{ scale: isLocked ? 1 : 1.04, y: isLocked ? 0 : -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSwitch(agent.id)}
              title={agent.name}
              style={{
                borderColor:     isActive ? agent.hex : "rgba(255,255,255,0.08)",
                backgroundColor: isActive ? `${agent.hex}20` : "rgba(0,0,0,0.4)",
                boxShadow:       isActive ? `0 0 14px ${agent.hex}40` : "none",
                opacity:         isLocked ? 0.5 : 1,
              }}
              className="relative flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-all"
            >
              <span className="text-lg leading-none">{agent.emoji}</span>
              <span className="text-[10px] font-semibold text-white leading-tight">{agent.name}</span>
              <span className="text-[9px] text-gray-500 leading-tight hidden sm:block">{agent.description}</span>
              {isLocked  && <span className="absolute top-1 right-1 text-[8px]">🔒</span>}
              {agent.adminOnly && <span className="absolute top-1 right-1 text-[8px] text-orange-400">★</span>}
              {isActive  && (
                <span
                  className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full"
                  style={{ backgroundColor: agent.hex }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
