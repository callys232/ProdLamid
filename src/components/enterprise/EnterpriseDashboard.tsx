"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

import EnterpriseHeader   from "./EnterpriseHeader";
import EnterpriseSidebar  from "./EnterpriseSidebar";
import Overview           from "./tabs/Overview";
import Members            from "./tabs/Members";
import Projects           from "./tabs/Projects";
import Analytics          from "./tabs/Analytics";
import Billing            from "./tabs/Billing";
import OrgSettings        from "./tabs/OrgSettings";
import Notifications      from "./tabs/Notifications";
import EscrowTab          from "@/components/client/escrow/Escrow";
import WorkspaceTab       from "@/components/client/messaging/ProjectWorkspace";
import EnterpriseTeams    from "./tabs/Teams";
import EnterpriseInvitations from "./tabs/Invitations";

import type { Organization, EnterpriseDashboardStats, OrgTier, OrgRole } from "@/types/enterprise";

const MOCK_ORG: Organization = {
  _id: "org-mock-001",
  name: "Acme Corp",
  slug: "acme-corp",
  tier: "enterprise",
  maxMembers: 50,
  ownerId: "user-001",
  industry: "Financial Services",
  website: "https://acme.com",
  billingCycle: "monthly",
  isPaid: false,
  status: "trial",
  settings: { allowPublicProjects: true, requireApprovalForBids: false, whiteLabelEnabled: false },
  createdAt: "2026-01-01",
  updatedAt: "2026-04-01",
};

const MOCK_STATS: EnterpriseDashboardStats = {
  activeProjects: 7,
  totalSpend: 95000,
  activeConsultants: 12,
  memberCount: 9,
  maxMembers: 50,
  pendingInvites: 2,
};

export default function EnterpriseDashboard() {
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const [activeTab, setActiveTab]     = useState(searchParams.get("tab") ?? "overview");
  const [org, setOrg]                 = useState<Organization | null>(null);
  const [stats, setStats]             = useState<EnterpriseDashboardStats | null>(null);
  const [orgRole, setOrgRole]         = useState<OrgRole>("org_member");
  const [loading, setLoading]         = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        // Verify user is actually an enterprise member
        const accountRes = await fetch("/api/groupware/get-account");
        if (accountRes.status === 401) { router.replace("/signin"); return; }
        if (accountRes.ok) {
          const { accountType, orgRole: userOrgRole } = await accountRes.json();
          // Also check localStorage in case API lags
          const stored = typeof window !== "undefined" ? localStorage.getItem("account_type") : null;
          const resolved = accountType || stored;

          if (resolved !== "Enterprise") {
            const dest =
              resolved === "Admin"      ? "/admin"     :
              resolved === "Freelancer" ? "/profile"   :
              resolved === "Concierge"  ? "/concierge" : "/client";
            router.replace(dest);
            return;
          }
          if (userOrgRole) setOrgRole(userOrgRole as OrgRole);
        }

        const res = await fetch("/api/enterprise/dashboard");
        if (res.ok) {
          const { data } = await res.json();
          setStats(data);
          // Also fetch org
          const orgRes = await fetch("/api/enterprise/org");
          if (orgRes.ok) {
            const { data: orgData } = await orgRes.json();
            setOrg(orgData);
          } else {
            setOrg(MOCK_ORG);
          }
        } else {
          setOrg(MOCK_ORG);
          setStats(MOCK_STATS);
        }
      } catch {
        setOrg(MOCK_ORG);
        setStats(MOCK_STATS);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  function handleTabChange(tab: string) {
    setActiveTab(tab);
    setSidebarOpen(false);
    window.history.replaceState(null, "", `?tab=${tab}`);
  }

  const tier  = (org?.tier  ?? "enterprise") as OrgTier;
  const count = stats?.memberCount  ?? 0;
  const max   = stats?.maxMembers   ?? 50;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0F19]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c12129] border-t-transparent" />
      </div>
    );
  }

  function renderTab() {
    switch (activeTab) {
      case "overview":      return <Overview       stats={stats} tier={tier} orgName={org?.name ?? ""} onTabChange={handleTabChange} />;
      case "members":       return <Members        orgId={org?._id ?? ""} orgRole={orgRole} memberCount={count} maxMembers={max} tier={tier} />;
      case "teams":         return <EnterpriseTeams orgId={org?._id ?? ""} />;
      case "invitations":   return <EnterpriseInvitations orgId={org?._id ?? ""} />;
      case "projects":      return <Projects       tier={tier} onOpenMessaging={() => handleTabChange("messaging")} />;
      case "escrow":        return <EscrowTab />;
      case "messaging":     return <WorkspaceTab />;
      case "analytics":     return <Analytics />;
      case "billing":       return <Billing        tier={tier} orgStatus={org?.status ?? "trial"} />;
      case "settings":      return <OrgSettings    org={org} orgRole={orgRole} />;
      case "notifications": return <Notifications />;
      default:              return <Overview       stats={stats} tier={tier} orgName={org?.name ?? ""} onTabChange={handleTabChange} />;
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0F19] text-white">
      {/* Header */}
      <EnterpriseHeader
        org={org}
        stats={stats}
        onTabChange={handleTabChange}
        alertCount={stats?.pendingInvites ?? 0}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar toggle */}
        <div className="flex items-center border-b border-white/10 px-4 py-2 md:hidden">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2 text-sm text-gray-400"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span>Menu</span>
          </motion.button>
        </div>

        {/* Sidebar — desktop always visible, mobile overlay */}
        <div className="hidden md:block">
          <EnterpriseSidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            memberCount={count}
            maxMembers={max}
          />
        </div>

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -240, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -240, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-y-0 left-0 z-40 md:hidden"
            >
              <EnterpriseSidebar
                activeTab={activeTab}
                onTabChange={handleTabChange}
                memberCount={count}
                maxMembers={max}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
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
