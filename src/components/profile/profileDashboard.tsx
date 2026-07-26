"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProjectById } from "@/lib/api/projectApi";
import ProfileHeader from "./ProfileHeader";
import ProfileSidebar from "./ProfileSideBar";
import Overview from "./overview/overview";
import Settings from "./settings/Settings";
import Teams from "./Teams/Teams";
import Notifications from "./tabs/Notifications";
import ProjectsTab from "./tabs/ProjectsTab";

import EscrowDashboard from "@/components/Escrow/Dashboard";
import { Project } from "@/types/project";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import ProjectMatching from "./projectMatching/projectMatch";
import Messaging from "@/components/messaging/ProjectWorkspace";
import WalletPanel from "@/components/shared/WalletPanel";
import EarningsDashboard from "./EarningsDashboard";
import PortfolioSection from "./PortfolioSection";
import ProfileCompletionScore from "./ProfileCompletionScore";
import ToolUsageHistory from "@/components/lamidOne/ToolUsageHistory";

export default function ProfileDashboard({
  params,
}: {
  params?: { id?: string };
}) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => searchParams.get("tab") ?? "overview");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Import getMe from authApi
        const { getMe } = await import("@/lib/api/authApi");
        const userData = await getMe();
        setUser(userData);
      } catch (err: any) {
        setError("Unable to fetch profile data. Please login again.");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Listen for tab-switch events emitted by ProfileCompletionScore "Fix →" buttons
  useEffect(() => {
    function handleSetTab(e: Event) {
      const tab = (e as CustomEvent<string>).detail;
      if (tab) setActiveTab(tab);
    }
    window.addEventListener("lamid:setTab", handleSetTab);
    return () => window.removeEventListener("lamid:setTab", handleSetTab);
  }, []);

  const projects = user?.projects || [];
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0]._id || projects[0].id);
    }
  }, [projects, selectedProjectId]);

  // Derive portfolio & project completion status for ProfileCompletionScore
  const userId = user?._id ?? user?.id ?? "";
  const hasPortfolio =
    typeof window !== "undefined" && userId
      ? ((): boolean => {
          try {
            return JSON.parse(localStorage.getItem(`portfolio_${userId}`) ?? "[]").length > 0;
          } catch {
            return false;
          }
        })()
      : false;

  const hasCompletedProject = (user?.projects ?? []).some(
    (p: any) => p.status === "completed"
  );

  const renderTab = () => {
    if (loading) return <p>Loading...</p>;
    if (!user) return <p>No profile data available.</p>;

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <ProfileCompletionScore
              user={user}
              hasPortfolio={hasPortfolio}
              hasCompletedProject={hasCompletedProject}
            />
            <Overview projectId={selectedProjectId} />
            <ToolUsageHistory />
          </div>
        );
      case "projects":
        return <ProjectsTab projects={projects} />;
      case "settings":
        return <Settings user={user} />;
      case "teams":
        return <Teams user={user} /> as any;
      case "notifications":
        return <Notifications />;
      case "escrow":
        return <EscrowDashboard currentUserId={user._id} />;
      case "messaging":
        return <Messaging />;
      case "project-matching":
        return <ProjectMatching showSidebar={true} isPremiumUser={user.isPremium ?? true} />;
      case "wallet":
        return <WalletPanel userId={user._id || ""} role="seller" />;
      case "earnings":
        return <EarningsDashboard userId={userId} />;
      case "portfolio":
        return <PortfolioSection userId={userId} />;

      default:
        return (
          <div className="space-y-6">
            <ProfileCompletionScore
              user={user}
              hasPortfolio={hasPortfolio}
              hasCompletedProject={hasCompletedProject}
            />
            <Overview projectId={selectedProjectId} />
            <ToolUsageHistory />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0F19] text-white font-sans">
      <ProfileHeader user={user} />
      <div className="flex flex-col md:flex-row flex-1">
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-800">
          <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} role={user?.role} />
        </div>
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-2 bg-blue-600 text-white rounded">
              {error}
            </div>
          )}
          {renderTab()}
        </div>
      </div>
    </div>
  );
}
