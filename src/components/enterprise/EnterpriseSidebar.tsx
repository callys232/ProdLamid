"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, FolderOpen, BarChart2,
  CreditCard, Settings, Bell, LogOut,
} from "lucide-react";

const TABS = [
  { key: "overview",       label: "Overview",       icon: LayoutDashboard },
  { key: "members",        label: "Members",         icon: Users },
  { key: "projects",       label: "Projects",        icon: FolderOpen },
  { key: "analytics",      label: "Analytics",       icon: BarChart2 },
  { key: "billing",        label: "Billing",         icon: CreditCard },
  { key: "settings",       label: "Settings",        icon: Settings },
  { key: "notifications",  label: "Notifications",   icon: Bell },
];

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
  memberCount?: number;
  maxMembers?: number;
}

export default function EnterpriseSidebar({ activeTab, onTabChange, memberCount = 0, maxMembers = 50 }: Props) {
  const pct = Math.min((memberCount / maxMembers) * 100, 100);

  return (
    <aside className="flex h-full w-56 flex-shrink-0 flex-col border-r border-white/10 bg-black">
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {TABS.map(({ key, label, icon: Icon }) => {
          const active = activeTab === key;
          return (
            <motion.button
              key={key}
              whileHover={{ x: active ? 0 : 3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onTabChange(key)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "border-l-2 border-[#c12129] bg-[#c12129]/10 text-white"
                  : "border-l-2 border-transparent text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className={`h-4 w-4 flex-shrink-0 ${active ? "text-[#c12129]" : ""}`} />
              {label}
              {key === "members" && memberCount > 0 && (
                <span className="ml-auto rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-gray-400">
                  {memberCount}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Member capacity */}
      <div className="border-t border-white/10 px-4 py-4">
        <div className="mb-1.5 flex items-center justify-between text-[11px] text-gray-500">
          <span>Members</span>
          <span>{memberCount} / {maxMembers}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className={`h-full rounded-full ${pct > 80 ? "bg-[#c12129]" : "bg-white/30"}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
        {pct > 80 && (
          <p className="mt-1.5 text-[10px] text-[#c12129]">Near limit — consider upgrading</p>
        )}
      </div>

      {/* Logout */}
      <div className="border-t border-white/10 px-3 py-3">
        <motion.a
          href="/signin"
          whileHover={{ x: 3 }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-500 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </motion.a>
      </div>
    </aside>
  );
}
