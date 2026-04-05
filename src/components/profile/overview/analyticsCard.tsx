"use client";
import { useEffect, useState } from "react";
import { Milestone } from "@/types/project";
import { Consultant } from "@/types/client";
import { mockClients } from "@/mocks/mockClient";
import CompletionSpeedChart from "./speedChart";
import FreelancerGrowthChart from "./growthCard";

export default function AnalyticsCards({ projectId }: { projectId: string }) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const res = await fetch(`/api/analytics/${projectId}`);
        if (!res.ok) throw new Error("Backend not ok");

        const { data } = await res.json();
        setMilestones(data.milestones || []);
        setConsultants(data.consultants || []);
      } catch {
        const fallbackProject = mockClients[0].projects.find(
          (p) => p.id === projectId || p._id === projectId
        );
        setMilestones(fallbackProject?.milestones || []);
        setConsultants(fallbackProject?.consultants || []);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [projectId]);

  if (loading) {
    return (
      <div className="text-gray-400 text-sm mt-6">
        Loading analytics for project…
      </div>
    );
  }

  // Metrics
  const avgCompletion =
    milestones.length > 0
      ? Math.round(
        milestones.reduce(
          (sum, m) =>
            sum +
            (m.progress ?? (m.status === "completed" ? 100 : 0)),
          0
        ) / milestones.length
      )
      : 0;

  const nextDue =
    milestones.find(
      (m) =>
        (m.progress ?? (m.status === "completed" ? 100 : 0)) < 100
    )?.dueDate ?? "All complete";

  const totalFreelancers = consultants.length;
  const growthRate =
    totalFreelancers > 1
      ? Math.round(((totalFreelancers - 1) / totalFreelancers) * 100)
      : 0;

  // Trend indicators (simple logic: >50% completion = positive, growthRate > 0 = positive)
  const completionTrend =
    avgCompletion >= 50 ? (
      <span className="text-green-400 ml-1">▲</span>
    ) : (
      <span className="text-red-400 ml-1">▼</span>
    );

  const growthTrend =
    growthRate > 0 ? (
      <span className="text-green-400 ml-1">▲</span>
    ) : (
      <span className="text-red-400 ml-1">▼</span>
    );

  const Card = ({
    title,
    children,
    tooltip,
  }: {
    title: string;
    children: React.ReactNode;
    tooltip: string;
  }) => (
    <div
      className="bg-black border border-gray-700 rounded-xl p-6 shadow-lg 
                 transition transform hover:scale-[1.02] hover:bg-gray-900 
                 hover:border-[#c12129] relative group"
    >
      <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
        {title}
        {error && (
          <span className="text-xs text-red-500">(fallback data)</span>
        )}
      </h3>
      {children}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
        <span className="bg-[#c12129] text-white text-xs px-2 py-1 rounded shadow-md">
          {tooltip}
        </span>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <Card title="Completion Speed" tooltip="Milestone completion analytics">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>
            Average Completion:{" "}
            <span className="text-white">{avgCompletion}%</span>
            {completionTrend}
          </span>
          <span>
            Next Due: <span className="text-white">{nextDue}</span>
          </span>
        </div>
        <CompletionSpeedChart milestones={milestones} accent="#c12129" />
      </Card>

      <Card title="Freelancer Growth" tooltip="Growth of freelancers over time">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>
            Total Freelancers:{" "}
            <span className="text-white">{totalFreelancers}</span>
          </span>
          <span>
            Growth Rate:{" "}
            <span className="text-white">{growthRate}%</span>
            {growthTrend}
          </span>
        </div>
        <FreelancerGrowthChart consultants={consultants} accent="#c12129" />
      </Card>
    </div>
  );
}
