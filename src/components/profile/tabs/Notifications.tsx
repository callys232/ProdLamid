"use client";

import { useEffect, useState } from "react";
import { getActivities, getMessages, getAlerts } from "@/lib/api/notificationApi";

interface Activity {
  id?: string;
  type: string;
  title?: string;
  message?: string;
  label?: string;
  value?: string;
}
interface Message {
  id?: string;
  type: string;
  title?: string;
  message?: string;
  label?: string;
  count?: number;
}
interface Alert {
  id?: string;
  type: string;
  title?: string;
  message?: string;
  label?: string;
  status?: string;
  severity?: string;
}

export default function Notifications() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [actData, msgData, alertData] = await Promise.all([
          getActivities(10),
          getMessages(10),
          getAlerts(10),
        ]);
        setActivities(actData);
        setMessages(msgData);
        setAlerts(alertData);
      } catch (err: any) {
        console.error("Failed to load notifications", err);
        setError("Failed to load notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading)
    return <div className="p-6 text-gray-400">Loading notifications...</div>;

  if (error)
    return (
      <div className="p-6 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {/* RECENT ACTIVITIES */}
      <section className="bg-gray-900 border border-gray-800 rounded-md p-4 ring-1 ring-blue-500/40 hover:ring-blue-500 transition">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        {activities.length === 0 ? (
          <p className="text-gray-400 text-sm">No recent activities</p>
        ) : (
          <ul className="space-y-3">
            {activities.map((a) => (
              <li
                key={a.id}
                className="flex justify-between bg-gray-800 px-3 py-2 rounded-md hover:ring-1 hover:ring-blue-400 transition"
              >
                <span>{a.title || a.label || a.message}</span>
                <span className="text-gray-400">{a.value || ""}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* MESSAGES */}
      <section className="bg-gray-900 border border-gray-800 rounded-md p-4 ring-1 ring-purple-500/40 hover:ring-purple-500 transition">
        <h2 className="text-xl font-semibold mb-4">Messages</h2>
        {messages.length === 0 ? (
          <p className="text-gray-400 text-sm">No messages</p>
        ) : (
          <ul className="space-y-3">
            {messages.map((m) => (
              <li
                key={m.id}
                className="flex justify-between bg-gray-800 px-3 py-2 rounded-md hover:ring-1 hover:ring-purple-400 transition"
              >
                <span>{m.title || m.label || m.message}</span>
                <span className="text-blue-400">{m.count || ""}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ALERTS */}
      <section className="bg-gray-900 border border-gray-800 rounded-md p-4 ring-1 ring-yellow-500/40 hover:ring-yellow-500 transition">
        <h2 className="text-xl font-semibold mb-4">Alerts</h2>
        {alerts.length === 0 ? (
          <p className="text-gray-400 text-sm">No alerts</p>
        ) : (
          <ul className="space-y-3">
            {alerts.map((al) => (
              <li
                key={al.id}
                className="flex justify-between bg-gray-800 px-3 py-2 rounded-md hover:ring-1 hover:ring-yellow-400 transition"
              >
                <span>{al.title || al.label || al.message}</span>
                <span
                  className={
                    al.severity === "High"
                      ? "text-red-400"
                      : al.severity === "Medium"
                        ? "text-yellow-400"
                        : al.type === "payment"
                          ? "text-green-400"
                          : al.type === "review"
                            ? "text-blue-400"
                            : al.type === "profile"
                              ? "text-purple-400"
                              : "text-gray-400"
                  }
                >
                  {al.status || al.severity || ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
