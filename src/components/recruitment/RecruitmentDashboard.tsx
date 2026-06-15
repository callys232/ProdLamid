"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import JobsTab      from "./JobsTab";
import PipelineTab  from "./PipelineTab";

const ENTERPRISE_TYPES = ["Enterprise", "Concierge", "Admin"];

type TabId = "jobs" | "pipeline";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "jobs",     label: "Open Roles",      icon: <Briefcase className="w-4 h-4" />     },
  { id: "pipeline", label: "Hire Pipeline",   icon: <LayoutDashboard className="w-4 h-4" /> },
];

export default function RecruitmentDashboard() {
  const { user }     = useAuth();
  const isEnterprise = ENTERPRISE_TYPES.includes(user?.accountType ?? "");
  const [tab, setTab] = useState<TabId>("jobs");

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Background rings */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 flex items-start justify-center pt-16">
          <div className="w-[700px] h-[700px] border border-gray-800/50 rounded-full" />
          <div className="absolute w-[500px] h-[500px] border border-gray-800/30 rounded-full mt-16" />
        </div>
      </div>

      {/* Orange top accent */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-1 z-10"
        style={{ background: "linear-gradient(90deg, rgba(234,88,12,0) 0%, rgba(249,115,22,0.8) 50%, rgba(234,88,12,0) 100%)" }}
      />

      <div className="relative z-10 container mx-auto px-5 sm:px-8 py-10 max-w-7xl">
        {/* Hero header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 24 }}
          className="mb-8"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-orange-400 mb-2">
            Lamid Recruitment Hub
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Find Your Next{" "}
            <span className="text-orange-500">Great Expert</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400 max-w-xl">
            Explore open roles across leadership, strategy, sales and more — or manage your full
            hiring pipeline from one place.
          </p>
        </motion.div>

        {/* Tab nav */}
        <div className="flex items-center gap-1 mb-6 border-b border-white/10 pb-px">
          {TABS.map(({ id, label, icon }) => {
            const locked = id === "pipeline" && !isEnterprise;
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition
                  ${active
                    ? "text-orange-400 border-b-2 border-orange-500 -mb-px bg-orange-500/5"
                    : locked
                    ? "text-gray-600 cursor-pointer"
                    : "text-gray-400 hover:text-white"
                  }`}
              >
                {icon}
                {label}
                {locked && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30 font-bold">
                    ENT
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {tab === "jobs"     && <JobsTab />}
        {tab === "pipeline" && <PipelineTab />}
      </div>
    </div>
  );
}
