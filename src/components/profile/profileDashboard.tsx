"use client";

import { useEffect, useState } from "react";
import { getProjectById } from "@/lib/api/projectApi";
import ProfileHeader from "./ProfileHeader";
import ProfileSidebar from "./ProfileSideBar";
import Overview from "./overview/overview";
import Settings from "./settings/Settings";
import Teams from "./Teams/Teams";
import Notifications from "./tabs/Notifications";
import Escrow from "./escrow/Escrow";
import EscrowDashboard from "@/components/Escrow/Dashboard";
import { Project } from "@/types/project";
import { SkeletonLoader } from "@/components/SkeletonLoader";

export default function ProfileDashboard({
  params,
}: {
  params?: { id?: string };
}) {
  const [activeTab, setActiveTab] = useState("overview");
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
        console.error("Failed to fetch user:", err);
        setError("Unable to fetch profile data. Please login again.");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const renderTab = () => {
    if (loading) return <p>Loading...</p>;
    if (!user) return <p>No profile data available.</p>;

    // For now, Overview expects a projectId. If we don't have one, we might need to adjust Overview.
    // Let's pass null for now and see if we need to fix Overview.
    const projectId = "";

    switch (activeTab) {
      case "overview":
        return <Overview projectId={projectId} />;
      case "settings":
        return <Settings user={user} />;
      case "teams":
        return <Teams user={user} /> as any;
      case "notifications":
        return <Notifications />;
      case "escrow":
        return <EscrowDashboard currentUserId={user._id} />;
      default:
        return <Overview projectId={projectId} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0F19] text-white font-sans">
      <ProfileHeader user={user} />
      <div className="flex flex-col md:flex-row flex-1">
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-800">
          <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-2 bg-red-600 text-white rounded">
              {error}
            </div>
          )}
          {renderTab()}
        </div>
      </div>
    </div>
  );
}
