"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AdminSidebar, { TabName } from "./sideBar"; // ✅ import TabName type
import Ecosystem from "./ecosystem/Ecosystem";
import EscrowQueue from "./escrow/EscrowQueue";
import Overview from "./overview/Overview";
import AnalyticsAgent from "./analytic/analytic";
import OutreachAgent from "./aiagents/outreach/outreachAgent";
import CommunicationAgent from "./aiagents/communicate/communication";
import FinanceBilling from "./finance/finance";
import PolicyCompliance from "./policy/policy";
import ActivityLogs from "./activityLog/activityLog";
import KycQueue from "./kyc/KycQueue";
import DeletionRequests from "./requests/DeletionRequests";
import ConciergeRequests from "./requests/ConciergeRequests";
import { FaBars } from "react-icons/fa";
import AdminHeader from "./Header";

/* -------------------- Skeleton Loader -------------------- */
function SkeletonLoader() {
  return (
    <div className="animate-pulse p-6 space-y-4">
      <div className="h-6 bg-[#1f1f1f] rounded w-1/3"></div>
      <div className="h-4 bg-[#1f1f1f] rounded w-2/3"></div>
      <div className="h-4 bg-[#1f1f1f] rounded w-1/2"></div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabName>("Overview"); // ✅ matches sidebar TabName
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  const [denied, setDenied] = useState(false);
  const router = useRouter();

  /* -------------------- Fetch Admin Data -------------------- */
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/admin/admin");
        setProjectId(data.projectId);
        setClientId(data.clientId);
      } catch (err: any) {
        /* The catch was empty, so a 403 was swallowed, loading flipped false,
           and the whole admin shell rendered for a non-admin — every panel
           empty behind it. The server routes held, but it read as broken and
           showed an interface nobody outside the team should see. */
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          setDenied(true);
          return;
        }
        console.error("[Admin] could not load admin context", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  /* Send anyone without admin rights away rather than showing them the shell. */
  useEffect(() => {
    if (!denied) return;
    const t = setTimeout(() => router.replace("/"), 2200);
    return () => clearTimeout(t);
  }, [denied, router]);

  if (denied) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#010101] px-6">
        <div className="max-w-sm rounded-2xl border border-[#1f1f1f] bg-[#0a0a0a] p-8 text-center">
          <p className="mb-2 text-sm font-bold text-white">Administrator access required</p>
          <p className="text-xs text-gray-500">
            This area is restricted. Returning you to the site.
          </p>
        </div>
      </div>
    );
  }

  /* -------------------- Tab Switcher -------------------- */
  const renderTab = () => {
    if (loading) return <SkeletonLoader />;

    switch (activeTab) {
      case "Overview":
        return <Overview />;
      case "Ecosystem":
        return <Ecosystem />;
      case "Escrow":
        return <EscrowQueue />;
      case "Analytics Agent":
        return <AnalyticsAgent />;
      case "Outreach & SEO Agent":
        return projectId ? (
          <OutreachAgent projectId={projectId} />
        ) : (
          <SkeletonLoader />
        );
      case "Communication Agent":
        return clientId ? (
          <CommunicationAgent clientId={clientId} />
        ) : (
          <SkeletonLoader />
        );
      case "Finance & Billing":
        return <FinanceBilling />;
      case "Policy & Compliance":
        return <PolicyCompliance />;
      case "Activity Logs":
        return <ActivityLogs />;
      case "KYC Review":
        return <KycQueue />;
      case "Deletion Requests":
        return <DeletionRequests />;
      case "Concierge Requests":
        return <ConciergeRequests />;
      default:
        return <Overview />;
    }
  };

  /* -------------------- Layout -------------------- */
  return (
    <div className="flex flex-col min-h-screen bg-[#010101] text-white font-sans">
      <AdminHeader />

      {/* Mobile Toggle */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 border-b border-[#1f1f1f]">
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <FaBars />
          <span className="text-sm">Menu</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row flex-1">
        {/* Sidebar */}
        <div
          className={`md:w-64 bg-[#0f0f0f]/90 md:border-r border-[#1f1f1f] ${
            sidebarOpen ? "block" : "hidden"
          } md:block md:relative absolute inset-y-0 left-0 z-40`}
        >
          <AdminSidebar
            activeTab={activeTab}
            onTabChange={(tab: TabName) => {
              setActiveTab(tab);
              setSidebarOpen(false);
            }}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6">{renderTab()}</div>
      </div>
    </div>
  );
}
