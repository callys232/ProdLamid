"use client";

import { useEffect, useState } from "react";

export interface Notification {
  id: string;
  type:
    | "review"
    | "deadline"
    | "payment"
    | "invitation"
    | "profile"
    | "team"
    | "system";
  title: string;
  message: string;
  createdAt: string;
  status?: "pending" | "approved" | "overdue" | "resolved";
}

interface ClientNotificationPageProps {
  clientId: string;
}

export default function ClientNotificationPage({
  clientId,
}: ClientNotificationPageProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await fetch(`/api/clients/${clientId}/notifications`);
        const data = await res.json();
        setNotifications(data.data || []);
      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        setLoading(false);
      }
    }
    loadNotifications();
  }, [clientId]);

  const typeColor = (type: Notification["type"]) => {
    switch (type) {
      case "review":
        return "text-blue-400";
      case "deadline":
        return "text-red-400";
      case "payment":
        return "text-green-400";
      case "invitation":
        return "text-yellow-400";
      case "profile":
        return "text-purple-400";
      case "team":
        return "text-pink-400";
      case "system":
        return "text-gray-400";
      default:
        return "text-white";
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-400">Loading notifications...</div>;
  }

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-400">No notifications available</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="bg-gray-900 border border-gray-800 rounded-md p-4 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-white">{n.title}</h3>
                <p className="text-sm text-gray-400">{n.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="mt-2 md:mt-0 flex items-center gap-3">
                <span className={`text-sm font-medium ${typeColor(n.type)}`}>
                  {n.type.toUpperCase()}
                </span>
                {n.status && (
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      n.status === "pending"
                        ? "bg-yellow-600 text-white"
                        : n.status === "approved"
                        ? "bg-green-600 text-white"
                        : n.status === "overdue"
                        ? "bg-red-600 text-white"
                        : n.status === "resolved"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {n.status}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
