"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import OnboardingAgent    from "./Onboarding";
import ProjectAgent       from "./project/projectAgent";
import CommunicationAgent from "./communicationAgent/Communicate";
import AnalyticsAgent     from "./analyticsAgent";
import OutreachAgent      from "./outreach/outreachSeo";
import type { AgentType } from "@/types/agentTypes";

type AgentKey = "onboarding" | "project" | "communication" | "analytics" | "outreach";

interface AuthUser { role: string; id: string; }

const ITEMS: { key: AgentKey; label: string; emoji: string; adminOnly?: boolean }[] = [
  { key: "onboarding",    label: "Onboarding & Guidance",       emoji: "🧭" },
  { key: "project",       label: "Project & Team Intelligence",  emoji: "📂" },
  { key: "communication", label: "Communication & Risk",         emoji: "📢" },
  { key: "analytics",     label: "Analytics & Recommendations",  emoji: "📊" },
  { key: "outreach",      label: "Outreach & SEO",               emoji: "✉️", adminOnly: true },
];

export default function AgentShell() {
  const [activeAgent, setActiveAgent] = useState<AgentKey>("onboarding");
  const [user,        setUser]        = useState<AuthUser | null>(null);
  const [projectId]                   = useState("project1");

  // ── Real auth check ──────────────────────────────────────────
  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.data) setUser({ role: d.data.role ?? "client", id: d.data._id ?? d.data.id }); })
      .catch(() => {});
  }, []);

  const isAdmin   = user?.role === "admin";
  const clientId  = user?.id ?? "guest";
  const visible   = ITEMS.filter(i => !i.adminOnly || isAdmin);

  return (
    <div className="flex min-h-screen bg-[#010101] text-white">
      {/* Sidebar */}
      <aside className="w-60 bg-[#050505] border-r border-[#1a1a1a] p-4 space-y-1 flex-shrink-0">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-4 px-2">Agent Portal</p>
        {visible.map(item => {
          const active = activeAgent === item.key;
          return (
            <motion.button key={item.key} whileTap={{ scale: 0.97 }}
              onClick={() => setActiveAgent(item.key)}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2.5"
              style={{
                backgroundColor: active ? "rgba(194,18,25,0.12)" : "transparent",
                color:           active ? "#fff" : "#6b7280",
                borderLeft:      active ? "2px solid #2563EB" : "2px solid transparent",
              }}
            >
              <span>{item.emoji}</span>
              <span className="truncate">{item.label}</span>
              {item.adminOnly && <span className="ml-auto text-[9px] text-orange-400 font-bold">ADMIN</span>}
            </motion.button>
          );
        })}
      </aside>

      {/* Main canvas */}
      <main className="flex-1 p-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {activeAgent === "onboarding"    && <OnboardingAgent />}
        {activeAgent === "project"       && <ProjectAgent />}
        {activeAgent === "communication" && <CommunicationAgent clientId={clientId} />}
        {activeAgent === "analytics"     && <AnalyticsAgent />}
        {activeAgent === "outreach"      && <OutreachAgent projectId={projectId} isAdmin={isAdmin} />}
      </main>

      {/* Context panel */}
      <aside className="w-72 hidden xl:block border-l border-[#1a1a1a] bg-[#050505] p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-3">Context</p>
        <ul className="space-y-2 text-xs text-gray-500">
          <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />AI running on gpt-4o-mini</li>
          <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-500" />Role: {user?.role ?? "guest"}</li>
          {isAdmin && <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-orange-500" />Admin agents unlocked</li>}
        </ul>
      </aside>
    </div>
  );
}
