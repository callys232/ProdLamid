"use client";
import { useEffect, useState } from "react";
import { Milestone } from "@/types/project";
import { Consultant } from "@/types/client";
import { mockClients } from "@/mocks/mockClient";
import CompletionSpeedChart from "./speedChart";
import FreelancerGrowthChart from "./growthCard";

export default function AnalyticsCards({ projectId }: { projectId: string }) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [consultants, setConsultants] = useState<Consultant[] | string[]>([]);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch(`/api/analytics/${projectId}`);
        if (res.ok) {
          const { data } = await res.json();
          setMilestones(data.milestones || []);
          setConsultants(data.consultants || []);
          return;
        }
        throw new Error("Backend not ok");
      } catch {
        const fallbackProject = mockClients[0].projects.find(
          (p) => p.id === projectId || p._id === projectId
        );
        setMilestones(fallbackProject?.milestones || []);
        setConsultants(fallbackProject?.consultants || []);
      }
    }
    fetchAnalytics();
  }, [projectId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div
        className="bg-black border border-gray-700 rounded-xl p-6 shadow-lg 
                      transition transform hover:scale-[1.02] hover:bg-gray-900 
                      hover:border-[#c12129] relative group"
      >
        <h3 className="text-sm font-semibold text-white mb-2">
          Completion Speed
        </h3>
        <CompletionSpeedChart milestones={milestones} accent="#c12129" />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
          <span className="bg-[#c12129] text-white text-xs px-2 py-1 rounded shadow-md">
            Milestone completion analytics
          </span>
        </div>
      </div>

      <div
        className="bg-black border border-gray-700 rounded-xl p-6 shadow-lg 
                      transition transform hover:scale-[1.02] hover:bg-gray-900 
                      hover:border-[#c12129] relative group"
      >
        <h3 className="text-sm font-semibold text-white mb-2">
          Freelancer Growth
        </h3>
        <FreelancerGrowthChart consultants={consultants} accent="#c12129" />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
          <span className="bg-[#c12129] text-white text-xs px-2 py-1 rounded shadow-md">
            Growth of freelancers over time
          </span>
        </div>
      </div>
    </div>
  );
}
