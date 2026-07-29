"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, FolderOpen, BarChart2,
  CreditCard, Settings, Bell, LogOut, Lock, MessageSquare,
  UsersRound, Mail, ChevronLeft, ChevronRight,
  CheckCircle2, ShieldCheck,
} from "lucide-react";
import PointsBalance from "@/components/points/PointsBalance";
import { UserGuide } from "@/components/Guides/UserGuide";
import { enterpriseSidebarGuide } from "@/lib/UserGuide/enterpriseGuide";

const TABS = [
  { key: "overview",      label: "Overview",      icon: LayoutDashboard, guide: "guide-ent-overview"    },
  { key: "members",       label: "Members",        icon: Users,           guide: "guide-ent-members"     },
  { key: "teams",         label: "Teams",          icon: UsersRound,      guide: "guide-ent-teams"       },
  { key: "projects",      label: "Projects",       icon: FolderOpen,      guide: "guide-ent-projects"    },
  { key: "escrow",        label: "Escrow",         icon: Lock,            guide: "guide-ent-escrow"      },
  { key: "messaging",     label: "Messaging",      icon: MessageSquare,   guide: "guide-ent-messaging"   },
  { key: "invitations",   label: "Invitations",    icon: Mail,            guide: "guide-ent-invitations" },
  { key: "analytics",     label: "Analytics",      icon: BarChart2,       guide: "guide-ent-analytics"   },
  { key: "approvals",     label: "Approvals",      icon: CheckCircle2,    guide: undefined               },
  { key: "auditlog",      label: "Audit Log",      icon: ShieldCheck,     guide: undefined               },
  { key: "billing",       label: "Billing",        icon: CreditCard,      guide: "guide-ent-billing"     },
  { key: "settings",      label: "Settings",       icon: Settings,        guide: "guide-ent-settings"    },
  { key: "notifications", label: "Notifications",  icon: Bell,            guide: undefined               },
];

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
  memberCount?: number;
  maxMembers?: number;
}

export default function EnterpriseSidebar({ activeTab, onTabChange, memberCount = 0, maxMembers = 50 }: Props) {
  const [collapsed,  setCollapsed]  = useState(false);
  const [showGuide,  setShowGuide]  = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("lamid-enterprise-guide-v1");
  });
  const pct = Math.min((memberCount / maxMembers) * 100, 100);

  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 224 }}
      transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] as const }}
      className="relative flex h-full flex-shrink-0 flex-col border-r border-white/10 bg-black overflow-hidden"
    >
      {/* ── Collapse toggle ─────────────────────────────────── */}
      <motion.button
        whileHover={{ scale: 1.15, backgroundColor: "rgba(37,99,235,0.15)" }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setCollapsed(c => !c)}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-6 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-[#0d1117] text-gray-600 shadow-lg transition hover:text-white"
      >
        {collapsed
          ? <ChevronRight className="h-3 w-3" />
          : <ChevronLeft  className="h-3 w-3" />}
      </motion.button>

      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-4">
        {TABS.map(({ key, label, icon: Icon, guide }) => {
          const active = activeTab === key;
          return (
            <motion.button
              key={key}
              data-guide={guide}
              whileHover={{ backgroundColor: active ? undefined : "rgba(255,255,255,0.04)" }}
              whileTap={{ scale: 0.97 }}
              animate={active ? { boxShadow: "0 0 14px rgba(37,99,235,0.18)" } : { boxShadow: "none" }}
              transition={{ duration: 0.15 }}
              onClick={() => onTabChange(key)}
              title={collapsed ? label : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "border border-[#2563EB]/30 bg-[#2563EB]/10 text-white"
                  : "border border-transparent text-gray-600 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon className={`h-4 w-4 flex-shrink-0 transition-colors ${active ? "text-[#2563EB]" : ""}`} />

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
                  className="ml-auto rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600"
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
                className={`h-full rounded-full ${pct > 80 ? "bg-[#2563EB]" : "bg-white/30"}`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
            {pct > 80 && (
              <p className="mt-1.5 text-[10px] text-[#2563EB]">Near limit — consider upgrading</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Points balance chip ──────────────────────────────── */}
      <div className={`border-t border-white/10 px-3 py-2 ${collapsed ? "flex justify-center" : ""}`}>
        <AnimatePresence initial={false}>
          {!collapsed ? (
            <motion.div
              key="pts-full"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <PointsBalance compact />
            </motion.div>
          ) : (
            <motion.div key="pts-icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PointsBalance compact />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
      {/* ── Workspace Guide trigger ───────────────────────────── */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="guide-btn"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 px-3 py-2"
          >
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowGuide(true)}
              className="w-full rounded-lg border border-white/10 bg-white/5 py-1.5 text-[11px] font-medium text-gray-500 transition hover:border-[#2563EB]/30 hover:text-[#2563EB]"
            >
              Workspace Guide
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <UserGuide
        storageKey="lamid-enterprise-guide-v1"
        steps={enterpriseSidebarGuide}
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
      />
    </motion.aside>
  );
}
