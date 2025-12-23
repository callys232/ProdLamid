"use client";
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Notification } from "@/types/client";
import { mockNotifications } from "@/mocks/mockJobs";

interface Props {
  notifications?: Notification[];
}

// Prepare chart data: count notifications per day
const aggregateByDay = (notifications: Notification[]) => {
  const counts: Record<string, number> = {};
  notifications.forEach((n) => {
    const day = n.createdAt ?? "Unknown";
    counts[day] = (counts[day] || 0) + 1;
  });
  return Object.entries(counts).map(([day, count]) => ({ day, count }));
};

export default function NotificationsPanel({
  notifications = mockNotifications, // ✅ use imported mock data as fallback
}: Props) {
  const chartData = aggregateByDay(notifications);

  return (
    <div
      className="bg-[#0f0f0f]/70 backdrop-blur-md border border-[#1f1f1f] rounded-lg p-6 
                 shadow-lg transition-transform duration-300 
                 hover:scale-105 hover:shadow-[0_0_25px_#c21229]"
    >
      <h3 className="text-lg font-semibold text-white mb-3">
        🔔 Notifications
      </h3>

      {/* Summary Chart */}
      <div className="h-40 mb-4">
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="day" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Bar dataKey="count" fill="#c21229" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Notifications List */}
      <ul className="space-y-2 text-sm text-gray-300">
        {notifications.map((n) => (
          <li
            key={n.id}
            className="flex justify-between items-center p-2 rounded-md hover:bg-[#c21229]/40 transition-colors"
          >
            <span>• {n.message}</span>
            {n.createdAt && (
              <span className="text-xs text-gray-400">{n.createdAt}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
