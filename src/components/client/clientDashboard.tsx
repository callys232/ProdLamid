"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FaBars } from "react-icons/fa";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import ProfileSidebar from "./CprofileSidebar";
import Overview from "@/components/client/tabs/overview/overview";
import Settings from "./settings/Settings";
import Teams from "./tabs/Teams";
import Notifications from "./tabs/Notifications";
import ClientEscrow from "./escrow/Escrow";
import Invitations from "./tabs/Invitation";
import ProjectsSection from "./project";
import ClientProjectSettings from "./settings/projectSettings";
import { ClientProfile } from "@/types/client";
import { Project } from "@/types/project";
import { mockClients } from "@/mocks/mockClient";
import CProfileHeader from "./CprofileHeader";
import Messaging from "./messaging/ProjectWorkspace";
import WalletPanel from "@/components/shared/WalletPanel";
import InvoiceHistory from "./InvoiceHistory";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import ToolUsageHistory from "@/components/lamidOne/ToolUsageHistory";

export default function ClientProfileDashboard() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => searchParams.get("tab") ?? "overview");
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [usingMock, setUsingMock] = useState(false);

  /* -------------------- Fetch Client -------------------- */
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        const { getClientDashboardProfile } = await import("@/lib/api/clientApi");
        const userData = await getClientDashboardProfile();
        setClient(userData);
      } catch (err) {
        setUsingMock(true);
        setClient(mockClients[0]); // fallback to mock
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, []);

  /* -------------------- Project Update -------------------- */
  const handleProjectSave = (updated: Project) => {
    setClient((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        projects: prev.projects.map((p) =>
          (p.id && updated.id && p.id === updated.id) ||
            (p._id && updated._id && p._id === updated._id)
            ? { ...p, ...updated }
            : p
        ),
      };
    });
  };

  /* -------------------- Tab Switcher -------------------- */
  const renderTab = () => {
    if (loading) return <SkeletonLoader />;
    if (!client)
      return <p className="p-6 text-gray-400">No client data found.</p>;

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <Overview client={client} consultants={client.consultants || []} />
            <ToolUsageHistory />
          </div>
        );
      case "settings":
        return <Settings client={client} />;
      case "teams":
        return <Teams client={client} />;
      case "projects":
        return <ProjectsSection client={client} />;
      case "notifications":
        return <Notifications clientId={client.id} />;
      case "escrow":
        return <ClientEscrow client={client} />;
      case "project-settings":
        return (
          <ClientProjectSettings
            projects={client.projects}
            onSave={handleProjectSave}
          />
        );
      case "project-escrow":
        return (
          <ClientEscrow
            client={client}
            projects={client.projects}
            initialEscrows={client.escrowTransactions}
          />
        );
      case "messaging": return <Messaging />;
      case "wallet":
        return <WalletPanel userId={client?.id || ""} role="client" />;
      case "invoices":
        return <InvoiceHistory userId={client.id ?? client._id ?? ""} />;
      case "invitations":
        return <Invitations client={client} consultants={client.consultants} />;
      default:
        return <Overview client={client} consultants={client.consultants || []} />;
    }
  };

  /* -------------------- Auth Gate -------------------- */
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6 bg-gray-950 text-white px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-blue-600/30 bg-blue-600/10">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="7" r="4" />
            <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Sign in to access your dashboard</h2>
          <p className="mt-2 text-sm text-gray-400">
            Manage your projects, escrow, teams, and consultants — all in one place.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/signin"
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-95"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="rounded-xl border border-white/10 px-6 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-white/30 hover:text-white"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  /* -------------------- Layout -------------------- */
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white font-sans">
      <CProfileHeader client={client} loading={loading} />

      {/* Dev-only banner for mock fallback */}
      {usingMock && process.env.NODE_ENV === "development" && (
        <div className="p-3 bg-yellow-900/50 border border-yellow-700 text-yellow-300 text-sm">
          Live data unavailable — showing mock client profile
        </div>
      )}

      {/* Mobile Toggle */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 border-b border-gray-800">
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
          className={`md:w-64 bg-gray-900 md:border-r border-gray-800 ${sidebarOpen ? "block" : "hidden"
            } md:block md:relative absolute inset-y-0 left-0 z-40`}
        >
          <ProfileSidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
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
