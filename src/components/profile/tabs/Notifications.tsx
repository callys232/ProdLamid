"use client";

import { useEffect, useState } from "react";

interface Activity {
  id: string;
  type: string;
  label: string;
  value: string;
}
interface Message {
  id: string;
  type: string;
  label: string;
  count: number;
}
interface Alert {
  id: string;
  type: string;
  label: string;
  status: string;
}

export default function Notifications() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [actRes, msgRes, alertRes] = await Promise.all([
          fetch("/api/notifications/activities"),
          fetch("/api/notifications/messages"),
          fetch("/api/notifications/alerts"),
        ]);
        const actData = await actRes.json();
        const msgData = await msgRes.json();
        const alertData = await alertRes.json();
        setActivities(actData.data || []);
        setMessages(msgData.data || []);
        setAlerts(alertData.data || []);
      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading)
    return <div className="p-6 text-gray-400">Loading notifications...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {/* RECENT ACTIVITIES */}
      <section className="bg-gray-900 border border-gray-800 rounded-md p-4 ring-1 ring-blue-500/40 hover:ring-blue-500 transition">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <ul className="space-y-3">
          {activities.map((a) => (
            <li
              key={a.id}
              className="flex justify-between bg-gray-800 px-3 py-2 rounded-md hover:ring-1 hover:ring-blue-400 transition"
            >
              <span>{a.label}</span>
              <span className="text-gray-400">{a.value}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* MESSAGES */}
      <section className="bg-gray-900 border border-gray-800 rounded-md p-4 ring-1 ring-purple-500/40 hover:ring-purple-500 transition">
        <h2 className="text-xl font-semibold mb-4">Messages</h2>
        <ul className="space-y-3">
          {messages.map((m) => (
            <li
              key={m.id}
              className="flex justify-between bg-gray-800 px-3 py-2 rounded-md hover:ring-1 hover:ring-purple-400 transition"
            >
              <span>{m.label}</span>
              <span className="text-blue-400">{m.count}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ALERTS */}
      <section className="bg-gray-900 border border-gray-800 rounded-md p-4 ring-1 ring-yellow-500/40 hover:ring-yellow-500 transition">
        <h2 className="text-xl font-semibold mb-4">Alerts</h2>
        <ul className="space-y-3">
          {alerts.map((al) => (
            <li
              key={al.id}
              className="flex justify-between bg-gray-800 px-3 py-2 rounded-md hover:ring-1 hover:ring-yellow-400 transition"
            >
              <span>{al.label}</span>
              <span
                className={
                  al.type === "todo"
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
                {al.status}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
