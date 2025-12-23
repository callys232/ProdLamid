"use client";

import React, { useEffect, useState } from "react";
import AnalyticsFlow from "./analyticsFlow";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsData {
  progressTrend: number[];
  workload: { consultant: string; tasks: number }[];
  profitability: { milestone: string; revenue: number; cost: number }[];
  risks: string[];
  kpis?: string[];
  refreshFrequency?: "Daily" | "Weekly" | "Monthly";
}

export default function AnalyticsAgent({ projectId }: { projectId: string }) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newKpi, setNewKpi] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const res = await fetch(`/api/projects/${projectId}/analytics`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data: AnalyticsData = await res.json();
        setAnalytics(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("Error fetching analytics, using mock data", message);
        setError(message);
        setAnalytics({
          progressTrend: [20, 40, 60, 80],
          workload: [
            { consultant: "Aisha N.", tasks: 5 },
            { consultant: "David K.", tasks: 8 },
          ],
          profitability: [
            { milestone: "Website Redesign", revenue: 10000, cost: 6000 },
            { milestone: "Content Migration", revenue: 5000, cost: 4500 },
          ],
          risks: [
            "Milestone overdue: Content Migration",
            "Consultant workload exceeds 120%",
          ],
          kpis: ["Completion Rate", "Utilization", "Profit Margin"],
          refreshFrequency: "Weekly",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [projectId]);

  async function updateSettings(updated: Partial<AnalyticsData>) {
    if (!analytics) return;
    const newData = { ...analytics, ...updated };
    setAnalytics(newData);

    try {
      await fetch(`/api/projects/${projectId}/analytics/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      setStatusMessage("✅ Settings updated successfully");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Failed to update settings", message);
      setStatusMessage("❌ Failed to update settings");
    }
    setTimeout(() => setStatusMessage(null), 3000); // auto-clear after 3s
  }

  const sections = [
    // ... charts, bottlenecks, profitability unchanged ...
    {
      id: "admin",
      title: "⚙️ Admin Controls",
      description: "Define KPIs, export reports, and adjust refresh frequency.",
      content: analytics ? (
        <div className="space-y-4">
          {statusMessage && (
            <div className="text-sm text-center p-2 rounded bg-[#1a1a1a] border border-[#374151]">
              {statusMessage}
            </div>
          )}

          {/* KPI Management */}
          <div>
            <h5 className="text-white font-semibold mb-2">KPIs</h5>
            <ul className="text-sm text-gray-400 space-y-1">
              {(analytics.kpis || []).map((kpi, i) => (
                <li key={i} className="flex justify-between items-center">
                  <span>✔️ {kpi}</span>
                  <button
                    onClick={() =>
                      updateSettings({
                        kpis: (analytics.kpis || []).filter(
                          (_, idx) => idx !== i
                        ),
                      })
                    }
                    className="text-red-400 text-xs hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newKpi}
                onChange={(e) => setNewKpi(e.target.value)}
                placeholder="Add KPI"
                className="p-2 rounded bg-[#0f0f0f] text-white text-sm flex-1"
              />
              <button
                onClick={() => {
                  if (newKpi.trim()) {
                    updateSettings({
                      kpis: [...(analytics.kpis || []), newKpi],
                    });
                    setNewKpi("");
                  }
                }}
                className="px-3 py-1 bg-[#3b82f6] text-white rounded hover:bg-[#2563eb]"
              >
                Add
              </button>
            </div>
          </div>

          {/* Refresh Frequency */}
          <div>
            <h5 className="text-white font-semibold mb-2">Refresh Frequency</h5>
            <select
              aria-label="refresh"
              value={analytics.refreshFrequency || "Weekly"}
              onChange={(e) =>
                updateSettings({
                  refreshFrequency: e.target.value as
                    | "Daily"
                    | "Weekly"
                    | "Monthly",
                })
              }
              className="p-2 rounded bg-[#0f0f0f] text-white text-sm"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          {/* Export Reports */}
          <div>
            <h5 className="text-white font-semibold mb-2">Export Reports</h5>
            <button
              type="button"
              onClick={async () => {
                try {
                  await fetch(`/api/projects/${projectId}/analytics/export`, {
                    method: "POST",
                  });
                  setStatusMessage("✅ Export triggered successfully");
                } catch (err: unknown) {
                  setStatusMessage("❌ Failed to export reports");
                }
                setTimeout(() => setStatusMessage(null), 3000);
              }}
              className="px-3 py-1 bg-[#3b82f6] text-white rounded hover:bg-[#2563eb]"
            >
              Export Reports
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-400">Loading admin settings...</p>
      ),
    },
  ];

  return (
    <div className="bg-[#010101] p-6 rounded-lg border border-[#1f1f1f]">
      <h3 className="text-lg font-semibold mb-3">📈 Analytics Agent</h3>
      <AnalyticsFlow sections={sections} />
    </div>
  );
}
