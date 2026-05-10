"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, FolderOpen, BarChart2,
  CreditCard, Settings, Bell, LogOut, Lock, MessageSquare,
  UsersRound, Mail, ChevronLeft, ChevronRight,
} from "lucide-react";

const TABS = [
  { key: "overview",      label: "Overview",      icon: LayoutDashboard },
  { key: "members",       label: "Members",        icon: Users           },
  { key: "teams",         label: "Teams",          icon: UsersRound      },
  { key: "projects",      label: "Projects",       icon: FolderOpen      },
  { key: "escrow",        label: "Escrow",         icon: Lock            },
  { key: "messaging",     label: "Messaging",      icon: MessageSquare   },
  { key: "invitations",   label: "Invitations",    icon: Mail            },
  { key: "analytics",     label: "Analytics",      icon: BarChart2       },
  { key: "billing",       label: "Billing",        icon: CreditCard      },
  { key: "settings",      label: "Settings",       icon: Settings        },
  { key: "notifications", label: "Notifications",  icon: Bell            },
];

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
  memberCount?: number;
  maxMembers?: number;
}

export default function EnterpriseSidebar({ activeTab, onTabChange, memberCount = 0, maxMembers = 50 }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const pct = Math.min((memberCount / maxMembers) * 100, 100);

  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 224 }}
      transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
      className="relative flex h-full flex-shrink-0 flex-col border-r border-white/10 bg-black overflow-hidden"
    >
      {/* ── Collapse toggle ─────────────────────────────────── */}
      <motion.button
        whileHover={{ scale: 1.15, backgroundColor: "rgba(193,33,41,0.15)" }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setCollapsed(c => !c)}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-6 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-[#0d1117] text-gray-400 shadow-lg transition hover:text-white"
      >
        {collapsed
          ? <ChevronRight className="h-3 w-3" />
          : <ChevronLeft  className="h-3 w-3" />}
      </motion.button>

      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-4">
        {TABS.map(({ key, label, icon: Icon }) => {
          const active = activeTab === key;
          return (
            <motion.button
              key={key}
              whileHover={{ backgroundColor: active ? undefined : "rgba(255,255,255,0.04)" }}
              whileTap={{ scale: 0.97 }}
              animate={active ? { boxShadow: "0 0 14px rgba(193,33,41,0.18)" } : { boxShadow: "none" }}
              transition={{ duration: 0.15 }}
              onClick={() => onTabChange(key)}
              title={collapsed ? label : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "border border-[#c12129]/30 bg-[#c12129]/10 text-white"
                  : "border border-transparent text-gray-400 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon className={`h-4 w-4 flex-shrink-0 transition-colors ${active ? "text-[#c12129]" : ""}`} />

              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    key="label"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden whitespace-nowrap flex-1 text-left"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Member badge — only when expanded */}
              {!collapsed && key === "members" && memberCount > 0 && (
                <motion.span
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="ml-auto rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-gray-400"
                >
                  {memberCount}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* ── Member capacity — only when expanded ─────────────── */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="capacity"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/10 px-4 py-4 overflow-hidden"
          >
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sign out ─────────────────────────────────────────── */}
      <div className="border-t border-white/10 px-2 py-3">
        <motion.a
          href="/signin"
          whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          title={collapsed ? "Sign out" : undefined}
          className={`flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm text-gray-500 transition hover:text-white ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                key="signout"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden whitespace-nowrap"
              >
                Sign out
              </motion.span>
            )}
          </AnimatePresence>
        </motion.a>
      </div>
    </motion.aside>
  );
}
