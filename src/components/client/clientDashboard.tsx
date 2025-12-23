"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ProfileSidebar from "./CprofileSidebar";
import Overview from "./tabs/Overview";
import Settings from "./settings/Settings";
import Teams from "./tabs/Teams";
import Notifications from "./tabs/Notifications";
import ClientEscrow from "./escrow/CEscrow";
import Invitations from "./tabs/Invitation";
import ClientProjectSettings from "./settings/projectSettings";
import { ClientProfile } from "@/types/client";
import { Project } from "@/types/project";
import { FaBars } from "react-icons/fa";
import { mockClients } from "@/mocks/mockClient";
import CProfileHeader from "./CprofileHeader";

/* -------------------- Skeleton Loader -------------------- */
function SkeletonLoader() {
  return (
    <div className="animate-pulse p-6 space-y-4">
      <div className="h-6 bg-gray-700 rounded w-1/3"></div>
      <div className="h-4 bg-gray-700 rounded w-2/3"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
    </div>
  );
}

export default function ClientProfileDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [usingMock, setUsingMock] = useState(false);

  /* -------------------- Fetch Client -------------------- */
  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        setUsingMock(false);

        const clientId = "654321abcdef1234567890";
        const res = await axios.get(`/api/clients/${clientId}`);

        if (res.data.success && res.data.data) {
          setClient(res.data.data);
        } else {
          throw new Error("No client data from API");
        }
      } catch (err) {
        console.warn("Using mock client data due to error:", err);
        setClient(mockClients[0]); // ✅ fallback
        setUsingMock(true);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
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
        return <Overview client={client} />;
      case "settings":
        return <Settings client={client} />;
      case "teams":
        return <Teams client={client} />;
      case "notifications":
        return <Notifications clientId={client.id} />;
      case "project-settings":
        return (
          <ClientProjectSettings
            projects={client.projects}
            onSave={handleProjectSave}
          />
        );
      case "escrow":
        return (
          <ClientEscrow
            client={client}
            projects={client.projects}
            initialEscrows={client.escrowTransactions}
          />
        );
      case "invitations":
        return <Invitations client={client} consultants={client.consultants} />;
      default:
        return <Overview client={client} />;
    }
  };

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
          className={`md:w-64 bg-gray-900 md:border-r border-gray-800 ${
            sidebarOpen ? "block" : "hidden"
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
