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
import { Project } from "@/types/project";
import { SkeletonLoader } from "@/components/SkeletonLoader";

export default function ProfileDashboard({
  params,
}: {
  params?: { id?: string };
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const PROJECT_ID = params?.id;

      if (!PROJECT_ID) {
        setError("No project ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getProjectById(PROJECT_ID);
        setProject(data);
      } catch (err: any) {
        console.error("Failed to fetch project:", err);
        setError("Unable to fetch project data. Please try again.");
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params?.id]);

  const renderTab = () => {
    if (loading) return <p>Loading...</p>;
    if (!project) return <p>No project data available.</p>;

    const projectId = project.id;

    switch (activeTab) {
      case "overview":
        return projectId ? (
          <Overview projectId={projectId} />
        ) : (
          <SkeletonLoader />
        );
      case "settings":
        return <Settings />;
      case "teams":
        return <Teams />;
      case "notifications":
        return <Notifications />;
      case "escrow":
        return <Escrow />;
      // case "Project":
      //   return <ProjectEscrow />;
      default:
        return projectId ? (
          <Overview projectId={projectId} />
        ) : (
          <SkeletonLoader />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0F19] text-white font-sans">
      <ProfileHeader />
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
