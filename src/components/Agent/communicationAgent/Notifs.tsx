"use client";

import React, { useState } from "react";

export interface Notification {
  id: number;
  type: "Email" | "Slack" | "SMS" | "Risk" | "Broadcast";
  message: string;
  // severity?: "Low" | "Medium" | "High"; // only for risk alerts
  severity?: string;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onDismiss: (id: number) => void;
  onBroadcast: (message: string) => void;
}

export default function NotificationCenter({
  notifications,
  onDismiss,
  onBroadcast,
}: NotificationCenterProps) {
  const [broadcastMessage, setBroadcastMessage] = useState("");

  const handleBroadcast = () => {
    if (!broadcastMessage.trim()) return;
    onBroadcast(broadcastMessage);
    setBroadcastMessage("");
  };

  return (
    <div className="bg-[#1a1a1a] p-4 rounded border border-[#374151]">
      <h4 className="text-white font-semibold mb-2">🔔 Notifications</h4>

      {/* Broadcast Announcement */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Broadcast message to all channels"
          value={broadcastMessage}
          onChange={(e) => setBroadcastMessage(e.target.value)}
          className="w-full mb-2 p-2 rounded bg-[#0f0f0f] text-white text-sm"
        />
        <button
          type="button"
          onClick={handleBroadcast}
          className="px-3 py-1 bg-[#3b82f6] text-white rounded hover:bg-[#2563eb]"
        >
          Broadcast
        </button>
      </div>

      {/* Notification List */}
      {notifications.length === 0 ? (
        <p className="text-gray-400 text-sm">No active notifications.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`p-3 rounded flex justify-between items-center ${
                n.type === "Risk"
                  ? n.severity === "High"
                    ? "bg-red-900/40 border border-red-500"
                    : n.severity === "Medium"
                    ? "bg-yellow-900/40 border border-yellow-500"
                    : "bg-green-900/40 border border-green-500"
                  : n.type === "Broadcast"
                  ? "bg-blue-900/40 border border-blue-500"
                  : "bg-[#0f0f0f] border border-[#374151]"
              }`}
            >
              <div>
                <p className="text-white text-sm">{n.message}</p>
                <p className="text-xs text-gray-400">
                  {n.type}
                  {n.type === "Risk" && n.severity ? ` • ${n.severity}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onDismiss(n.id)}
                className="text-xs px-2 py-1 bg-[#3b82f6] text-white rounded hover:bg-[#2563eb]"
              >
                Dismiss
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
