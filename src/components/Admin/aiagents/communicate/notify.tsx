"use client";
import React, { useState } from "react";

export interface Notification {
  id: number;
  type: "Email" | "Slack" | "SMS" | "Risk" | "Broadcast";
  message: string;
  // severity?: "Low" | "Medium" | "High";
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
  const [newMessage, setNewMessage] = useState("");

  const handleBroadcast = () => {
    if (newMessage.trim()) {
      onBroadcast(newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-white font-semibold">Notification Center</h4>

      {/* Notification list */}
      <ul className="space-y-2">
        {notifications.map((n) => (
          <li
            key={n.id}
            className="flex justify-between items-center bg-[#010101]/80 border border-[#1f1f1f] rounded-lg p-3 shadow-md backdrop-blur-md hover:border-[#c21229] transition-colors"
          >
            <div>
              <span className="text-[#c21229] font-bold mr-2">{n.type}</span>
              <span className="text-gray-300">{n.message}</span>
              {n.severity && (
                <span
                  className={`ml-2 text-xs ${
                    n.severity === "High"
                      ? "text-red-400"
                      : n.severity === "Medium"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}
                >
                  {n.severity}
                </span>
              )}
            </div>
            <button
              onClick={() => onDismiss(n.id)}
              className="text-gray-400 hover:text-[#c21229] transition-colors"
            >
              ✖
            </button>
          </li>
        ))}
        {notifications.length === 0 && (
          <li className="text-gray-400 text-sm">No notifications</li>
        )}
      </ul>

      {/* Broadcast input */}
      <div className="flex gap-2 mt-3">
        <input
          type="text"
          placeholder="Broadcast a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 rounded bg-[#0f0f0f] text-white focus:outline-none focus:border-[#c21229] border border-[#1f1f1f]"
        />
        <button
          onClick={handleBroadcast}
          className="px-3 py-1 bg-[#c21229] text-white rounded transition-transform transform hover:scale-105 hover:bg-red-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
