"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LayoutDashboard, FolderKanban, Users, Bell, MessageSquare, BarChart3, HeadphonesIcon, Settings, Star, UserCheck } from "lucide-react";

// Concierge overview
import Overview     from "./tabs/ConciergeOverview";
import Teams        from "./tabs/ConciergeTeams";
import Notifications from "@/components/client/tabs/Notifications";
import Settings_    from "@/components/client/settings/Settings";

// Concierge-specific tabs
import ConciergeProjects  from "./tabs/ConciergeProjects";
import ConciergePM        from "./tabs/ConciergePM";
import ConciergeReports   from "./tabs/ConciergeReports";
import ConciergeSupport   from "./tabs/ConciergeSupport";

/* ── Nav items ────────────────────────────────────────────────── */
const NAV = [
  { key: "overview",      label: "Overview",          icon: LayoutDashboard },
  { key: "projects",      label: "Projects",          icon: FolderKanban },
  { key: "dedicated-pm",  label: "Dedicated PM",      icon: UserCheck },
  { key: "teams",         label: "Teams",             icon: Users },
  { key: "reports",       label: "Reports",           icon: BarChart3 },
  { key: "notifications", label: "Notifications",     icon: Bell },
  { key: "support",       label: "Priority Support",  icon: HeadphonesIcon },
  { key: "settings",      label: "Settings",          icon: Settings },
];

export default function ConciergeDashboard() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") ?? "overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const switchTab = (key: string) => {
    setActiveTab(key);
    router.push(`?tab=${key}`, { scroll: false });
    setSidebarOpen(false);
  };

  const renderTab = () => {
    switch (activeTab) {
      case "overview":      return <Overview />;
      case "projects":      return <ConciergeProjects />;
      case "dedicated-pm":  return <ConciergePM />;
      case "teams":         return <Teams />;
      case "reports":       return <ConciergeReports />;
      case "notifications": return <Notifications />;
      case "support":       return <ConciergeSupport />;
      case "settings":      return <Settings_ />;
      default:              return <Overview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050000] text-white">
      {/* ── Sidebar ─────────────────────────────────── */}
      <AnimatePresence>
        {(sidebarOpen || true) && ( // always visible on desktop
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={`fixed inset-y-0 left-0 z-40 w-64 bg-black border-r border-white/10 flex flex-col
              ${sidebarOpen ? "flex" : "hidden md:flex"}`}
          >
            {/* Logo */}
            <div className="px-5 py-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c21219]/20">
                  <Star className="h-4 w-4 text-[#c21219]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Lamid Concierge</p>
                  <p className="text-[10px] text-gray-500">White-glove service portal</p>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {NAV.map(({ key, label, icon: Icon }) => {
                const active = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => switchTab(key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-[#c21219]/15 text-[#c21219] border border-[#c21219]/30"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className={`h-4 w-4 flex-shrink-0 ${active ? "text-[#c21219]" : ""}`} />
                    {label}
                    {key === "support" && (
                      <span className="ml-auto text-[9px] bg-[#c21219] text-white px-1.5 py-0.5 rounded-full">24/7</span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Concierge badge */}
            <div className="px-5 py-4 border-t border-white/10">
              <div className="rounded-xl bg-[#c21219]/10 border border-[#c21219]/20 px-3 py-2 text-center">
                <p className="text-[10px] text-[#c21219] font-semibold uppercase tracking-widest">Concierge Tier</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Dedicated PM · Priority Support</p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay on mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between bg-black/80 backdrop-blur-md border-b border-white/10 px-4 py-3">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-400 hover:text-white">
            <Menu className="h-5 w-5" />
          </button>
          <p className="text-sm font-semibold text-white capitalize md:ml-0 ml-3">
            {NAV.find(n => n.key === activeTab)?.label ?? "Dashboard"}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#c21219] bg-[#c21219]/10 border border-[#c21219]/20 px-2.5 py-1 rounded-full font-semibold">
              ★ Concierge
            </span>
          </div>
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
      </div>
    </div>
  );
}
