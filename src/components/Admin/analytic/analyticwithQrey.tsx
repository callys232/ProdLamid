"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

/* ---------- Register Chart.js components ---------- */
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/* ---------- Types ---------- */
type AnalyticsData = {
  traffic: { visits: number[]; labels: string[]; prevWeek?: number[] };
  topPages: { url: string; views: number }[];
  engagement: { avgSessionDuration: string; pagesPerSession: number };
  conversions: { stages: string[]; counts: number[]; prevWeek?: number[] };
};

type ActiveUsersData = { active: number };

/* ---------- Fallback Mock ---------- */
const fallbackData: AnalyticsData = {
  traffic: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    visits: [1200, 1500, 1800, 1700, 2000, 2200, 2500],
    prevWeek: [1000, 1300, 1600, 1400, 1800, 1900, 2100],
  },
  topPages: [
    { url: "/home", views: 3200 },
    { url: "/pricing", views: 2100 },
    { url: "/contact", views: 1800 },
  ],
  engagement: { avgSessionDuration: "3m 45s", pagesPerSession: 4.2 },
  conversions: {
    stages: ["Visits", "Signups", "Trials", "Purchases"],
    counts: [12000, 3000, 1200, 456],
    prevWeek: [10000, 2500, 1000, 400],
  },
};

/* ---------- Helper Components ---------- */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="bg-[#010101]/80 border border-[#1f1f1f] rounded-lg p-4 shadow-md backdrop-blur-md"
      aria-label={title}
    >
      <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
      {children}
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="bg-[#0f0f0f]/60 border border-[#1f1f1f] rounded-lg p-4 text-white shadow-sm
                 hover:border-[#c21229] hover:shadow-lg transition-all"
    >
      <div className="text-sm text-gray-400">{label}</div>
      <div className="text-xl font-bold text-[#c21229] mt-1">{value}</div>
    </div>
  );
}

function TrendIndicator({ current, prev }: { current: number; prev?: number }) {
  if (prev === undefined) return null;
  if (current > prev) {
    return <FaArrowUp className="inline text-green-400 ml-2" />;
  } else if (current < prev) {
    return <FaArrowDown className="inline text-red-400 ml-2" />;
  }
  return null;
}

/* ---------- Main Component ---------- */
export default function AnalyticsAgent(): React.ReactElement {
  // Main analytics data (refresh every 30s)
  const { data, error, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const res = await fetch("/api/admin/analytics", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
    staleTime: 30000,
    retry: 1,
    refetchInterval: 30000,
  });

  // Active users counter (refresh every 10s)
  const { data: activeUsers } = useQuery<ActiveUsersData>({
    queryKey: ["active-users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/active-users", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch active users");
      return res.json();
    },
    refetchInterval: 10000,
  });

  const analytics = data ?? fallbackData;

  /* ---------- Chart Data ---------- */
  const trafficChart = {
    labels: analytics.traffic.labels,
    datasets: [
      {
        label: "This Week",
        data: analytics.traffic.visits,
        borderColor: "#c21229",
        backgroundColor: "rgba(194,18,41,0.3)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Last Week",
        data: analytics.traffic.prevWeek ?? [],
        borderColor: "#888",
        backgroundColor: "rgba(136,136,136,0.3)",
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const conversionChart = {
    labels: analytics.conversions.stages,
    datasets: [
      {
        label: "This Week",
        data: analytics.conversions.counts,
        backgroundColor: "#c21229",
      },
      {
        label: "Last Week",
        data: analytics.conversions.prevWeek ?? [],
        backgroundColor: "#444",
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Active Users */}
      <Section title="🟢 Active Users">
        <MetricCard
          label="Currently Online"
          value={activeUsers?.active?.toString() ?? "120"}
        />
      </Section>

      {/* Traffic Overview */}
      <Section title="📊 Traffic Overview (Week over Week)">
        <Line
          data={trafficChart}
          options={{
            responsive: true,
            plugins: { legend: { labels: { color: "#fff" } } },
            scales: {
              x: { ticks: { color: "#fff" } },
              y: { ticks: { color: "#fff" } },
            },
          }}
        />
        <div className="mt-2 text-gray-300">
          Visits this week:{" "}
          {analytics.traffic.visits
            .reduce((a: number, b: number) => a + b, 0)
            .toLocaleString()}
          <TrendIndicator
            current={analytics.traffic.visits.reduce(
              (a: number, b: number) => a + b,
              0
            )}
            prev={analytics.traffic.prevWeek?.reduce(
              (a: number, b: number) => a + b,
              0
            )}
          />
        </div>
      </Section>

      {/* Top Pages */}
      <Section title="📈 Top Pages">
        <ul className="space-y-2 text-sm text-gray-300">
          {analytics.topPages.map((page: { url: string; views: number }) => (
            <li
              key={page.url}
              className="flex justify-between items-center bg-[#0f0f0f]/60 hover:bg-[#c21229]/30 px-4 py-2 rounded transition-all"
            >
              <span>{page.url}</span>
              <span>{page.views.toLocaleString()} views</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Engagement */}
      <Section title="🧭 User Engagement">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard
            label="Avg. Session Duration"
            value={analytics.engagement.avgSessionDuration}
          />
          <MetricCard
            label="Pages per Session"
            value={analytics.engagement.pagesPerSession.toFixed(1)}
          />
        </div>
      </Section>

      {/* Conversions */}
      <Section title="🎯 Conversion Funnel (Week over Week)">
        <Bar
          data={conversionChart}
          options={{
            responsive: true,
            plugins: { legend: { labels: { color: "#fff" } } },
            scales: {
              x: { ticks: { color: "#fff" } },
              y: { ticks: { color: "#fff" } },
            },
          }}
        />
        <div className="mt-2 text-gray-300">
          Conversions this week:{" "}
          {analytics.conversions.counts.slice(-1)[0].toLocaleString()}
          <TrendIndicator
            current={analytics.conversions.counts.slice(-1)[0]}
            prev={analytics.conversions.prevWeek?.slice(-1)[0]}
          />
        </div>
      </Section>

      {isLoading && (
        <p className="text-gray-400 text-sm">Loading analytics...</p>
      )}
      {error && (
        <p className="text-red-400 text-sm mt-4">
          Failed to load live analytics. Showing fallback data.
        </p>
      )}
    </div>
  );
}
