"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, LayoutDashboard, FolderKanban, Users, Bell, MessageSquare,
  BarChart3, TrendingUp, HeadphonesIcon, Settings, Star, UserCheck, Lock, Mail,
  ChevronLeft, ChevronRight, ShieldCheck, Activity,
} from "lucide-react";

import Overview            from "./tabs/ConciergeOverview";
import Teams               from "./tabs/ConciergeTeams";
import Notifications       from "@/components/client/tabs/Notifications";
import Settings_           from "@/components/client/settings/Settings";
import ConciergeProjects   from "./tabs/ConciergeProjects";
import ConciergePM         from "./tabs/ConciergePM";
import ConciergeReports    from "./tabs/ConciergeReports";
import ConciergeSupport    from "./tabs/ConciergeSupport";
import EscrowTab           from "@/components/client/escrow/Escrow";
import WorkspaceTab        from "@/components/client/messaging/ProjectWorkspace";
import ConciergeInvitations from "./tabs/ConciergeInvitations";
import ConciergeAnalytics   from "./tabs/ConciergeAnalytics";
import SLATracker           from "./SLATracker";
import ConciergeKPIs        from "./ConciergeKPIs";
import { UserGuide } from "@/components/Guides/UserGuide";
import { conciergeGuide } from "@/lib/UserGuide/conciergeGuide";

/* ── Nav items ─────────────────────────────────────────────────── */
const NAV = [
  { key: "overview",      label: "Overview",         icon: LayoutDashboard, guide: "guide-con-overview"    },
  { key: "projects",      label: "Projects",         icon: FolderKanban,    guide: "guide-con-projects"    },
  { key: "dedicated-pm",  label: "Dedicated PM",     icon: UserCheck,       guide: "guide-con-pm"          },
  { key: "teams",         label: "Teams",            icon: Users,           guide: "guide-con-teams"       },
  { key: "escrow",        label: "Escrow",           icon: Lock,            guide: "guide-con-escrow"      },
  { key: "messaging",     label: "Messaging",        icon: MessageSquare,   guide: "guide-con-messaging"   },
  { key: "invitations",   label: "Invitations",      icon: Mail,            guide: "guide-con-invitations" },
  { key: "sla",           label: "SLA Tracking",     icon: ShieldCheck,     guide: undefined               },
  { key: "kpis",          label: "KPIs",             icon: Activity,        guide: undefined               },
  { key: "analytics",     label: "Analytics",        icon: TrendingUp,      guide: undefined               },
  { key: "reports",       label: "Reports",          icon: BarChart3,       guide: "guide-con-reports"     },
  { key: "notifications", label: "Notifications",    icon: Bell,            guide: undefined               },
  { key: "support",       label: "Priority Support", icon: HeadphonesIcon,  guide: "guide-con-support"     },
  { key: "settings",      label: "Settings",         icon: Settings,        guide: undefined               },
];

const SIDEBAR_FULL = 256;  // w-64
const SIDEBAR_RAIL = 56;   // icon-only rail

export default function ConciergeDashboard() {
  const searchParams   = useSearchParams();
  const router         = useRouter();
  const [activeTab, setActiveTab]       = useState(searchParams.get("tab") ?? "overview");
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [collapsed, setCollapsed]       = useState(false);
  const [userId, setUserId]             = useState("");
  const [showGuide, setShowGuide]       = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("lamid-concierge-guide-v1");
  });

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.data) setUserId(d.data._id ?? d.data.id ?? ""); })
      .catch(() => {});
  }, []);

  const switchTab = (key: string) => {
    setActiveTab(key);
    router.push(`?tab=${key}`, { scroll: false });
    setSidebarOpen(false);
  };

  const renderTab = () => {
    switch (activeTab) {
      case "overview":      return <Overview />;
      case "projects":      return (
        <ConciergeProjects
          onOpenMessaging={() => switchTab("messaging")}
          onOpenEscrow={() => switchTab("escrow")}
        />
      );
      case "dedicated-pm":  return <ConciergePM />;
      case "teams":         return <Teams />;
      case "sla":           return <SLATracker userId={userId} />;
      case "kpis":          return <ConciergeKPIs />;
      case "analytics":     return <ConciergeAnalytics />;
      case "reports":       return <ConciergeReports />;
      case "notifications": return <Notifications clientId={userId} />;
      case "escrow":        return <EscrowTab />;
      case "messaging":     return <WorkspaceTab />;
      case "invitations":   return <ConciergeInvitations />;
      case "support":       return <ConciergeSupport onStartChat={() => switchTab("messaging")} />;
      case "settings":      return <Settings_ client={null} />;
      default:              return <Overview />;
    }
  };

  const sidebarWidth = collapsed ? SIDEBAR_RAIL : SIDEBAR_FULL;

  return (
    <div className="flex min-h-screen bg-[#050000] text-white">

      {/* ── Desktop sidebar ─────────────────────────────────── */}
      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] as const }}
        className="hidden md:flex fixed inset-y-0 left-0 z-40 flex-col bg-black border-r border-white/10 overflow-hidden"
      >
        {/* Logo */}
        <div className={`flex items-center border-b border-white/10 px-3 py-4 ${collapsed ? "justify-center" : "gap-2 px-5"}`}>
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#2563EB]/20">
            <Star className="h-4 w-4 text-[#2563EB]" />
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                key="brand"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <p className="text-sm font-bold text-white whitespace-nowrap">Lamid Concierge</p>
                <p className="text-[10px] text-gray-500 whitespace-nowrap">White-glove service portal</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] px-2 py-4 space-y-0.5">
          {NAV.map(({ key, label, icon: Icon, guide }) => {
            const active = activeTab === key;
            return (
              <motion.button
                key={key}
                data-guide={guide}
                onClick={() => switchTab(key)}
                whileHover={{ backgroundColor: active ? undefined : "rgba(255,255,255,0.04)" }}
                whileTap={{ scale: 0.97 }}
                animate={active ? { boxShadow: "0 0 16px rgba(194,18,25,0.15)" } : { boxShadow: "none" }}
                transition={{ duration: 0.15 }}
                title={collapsed ? label : undefined}
                className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#2563EB]/15 text-[#2563EB] border border-[#2563EB]/30"
                    : "text-gray-400 hover:text-white border border-transparent"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${active ? "text-[#2563EB]" : ""}`} />
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span
                      key="lbl"
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
                {!collapsed && key === "support" && (
                  <motion.span
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                    className="ml-auto text-[9px] bg-[#2563EB] text-white px-1.5 py-0.5 rounded-full flex-shrink-0"
                  >24/7</motion.span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Concierge badge — only when expanded */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="badge"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="px-5 py-4 border-t border-white/10 overflow-hidden"
            >
              <div className="rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 px-3 py-2 text-center">
                <p className="text-[10px] text-[#2563EB] font-semibold uppercase tracking-widest">Concierge Tier</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Dedicated PM · Priority Support</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Portal Guide trigger — visible only when expanded */}
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
                className="w-full rounded-lg border border-[#2563EB]/20 bg-[#2563EB]/5 py-1.5 text-[11px] font-medium text-[#2563EB]/70 transition hover:bg-[#2563EB]/15 hover:text-[#2563EB]"
              >
                Portal Guide
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse toggle */}
        <div className="border-t border-white/10 px-2 py-3">
          <motion.button
            whileHover={{ backgroundColor: "rgba(194,18,25,0.08)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? "Expand" : "Collapse"}
            className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-xs text-gray-500 transition hover:text-white ${collapsed ? "justify-center" : ""}`}
          >
            {collapsed
              ? <ChevronRight className="h-4 w-4 flex-shrink-0" />
              : <><ChevronLeft className="h-4 w-4 flex-shrink-0" /><span className="whitespace-nowrap">Collapse</span></>}
          </motion.button>
        </div>
      </motion.aside>

      {/* ── Mobile overlay sidebar ───────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-30 bg-black/60 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 z-40 w-64 bg-black border-r border-white/10 flex flex-col md:hidden"
            >
              <div className="flex items-center gap-2 px-5 py-4 border-b border-white/10">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB]/20">
                  <Star className="h-4 w-4 text-[#2563EB]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Lamid Concierge</p>
                  <p className="text-[10px] text-gray-500">White-glove service portal</p>
                </div>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                {NAV.map(({ key, label, icon: Icon }) => {
                  const active = activeTab === key;
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => switchTab(key)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        active
                          ? "bg-[#2563EB]/15 text-[#2563EB] border border-[#2563EB]/30"
                          : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                      }`}
                    >
                      <Icon className={`h-4 w-4 flex-shrink-0 ${active ? "text-[#2563EB]" : ""}`} />
                      {label}
                    </button>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ─────────────────────────────────────── */}
      <motion.div
        animate={{ marginLeft: sidebarWidth }}
        transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] as const }}
        className="flex flex-1 flex-col md:ml-0 ml-0"
      >
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between bg-black/80 backdrop-blur-md border-b border-white/10 px-4 py-3 shadow-[0_1px_24px_rgba(0,0,0,0.4)]">
          <motion.button
            onClick={() => setSidebarOpen(true)}
            whileTap={{ scale: 0.9 }}
            className="md:hidden text-gray-400 hover:text-white transition-colors"
          >
            <Menu className="h-5 w-5" />
          </motion.button>
          <p className="text-sm font-semibold text-white capitalize md:ml-0 ml-3">
            {NAV.find(n => n.key === activeTab)?.label ?? "Dashboard"}
          </p>
          <motion.span
            whileHover={{ scale: 1.05, boxShadow: "0 0 12px rgba(194,18,25,0.3)" }}
            transition={{ duration: 0.2 }}
            className="text-xs text-[#2563EB] bg-[#2563EB]/10 border border-[#2563EB]/20 px-2.5 py-1 rounded-full font-semibold cursor-default"
          >
            ★ Concierge
          </motion.span>
        </header>

        {/* Tab content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderTab()}
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>

      {/* Concierge Portal Guide */}
      <UserGuide
        storageKey="lamid-concierge-guide-v1"
        steps={conciergeGuide}
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
      />
    </div>
  );
}
