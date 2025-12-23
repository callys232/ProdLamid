"use client";
import React, { useState } from "react";

interface Alert {
  id: string;
  type:
    | "escrow"
    | "payment"
    | "milestone"
    | "message"
    | "document"
    | "complaint"
    | "document"
    | "complaint"
    | "Email"
    | "Slack"
    | "Risk"
    | "Broadcast"
    | "Sms";
  message: string;
  channel?: string;
  severity?: "Low" | "Medium" | "High";
  createdAt?: string;
}

interface Props {
  alerts?: Alert[];
}

const mockAlerts: Alert[] = [
  { id: "1", type: "escrow", message: "Escrow dispute on Project Alpha" },
  { id: "2", type: "payment", message: "Pending payment for Project Beta" },
  { id: "3", type: "milestone", message: "Overdue milestone in Project Gamma" },
  { id: "4", type: "message", message: "New message from Consultant Jane Doe" },
  { id: "5", type: "document", message: "Review required: Compliance Report" },
  {
    id: "6",
    type: "complaint",
    message: "Client complaint filed for Project Delta",
  },
];

export default function AlertsPanel({ alerts = mockAlerts }: Props) {
  const [filter, setFilter] = useState<Alert["type"] | "all">("all");

  const typeIcons: Record<Alert["type"], string> = {
    escrow: "💰",
    payment: "💳",
    milestone: "📌",
    message: "✉️",
    document: "📄",
    complaint: "⚠️",
    Email: "📧",
    Slack: "💬",
    Risk: "🚨",
    Broadcast: "📢",
    Sms: "📱",
  };

  const filteredAlerts =
    filter === "all" ? alerts : alerts.filter((a) => a.type === filter);

  const categories: (Alert["type"] | "all")[] = [
    "all",
    "escrow",
    "payment",
    "milestone",
    "message",
    "document",
    "complaint",
  ];

  return (
    <div
      className="bg-[#0f0f0f]/80 backdrop-blur-md border border-[#1f1f1f] rounded-lg p-6 
                 shadow-lg transition-transform duration-300 
                 hover:scale-105 hover:shadow-[0_0_25px_#c21229]"
    >
      <h3 className="text-lg font-semibold text-white mb-3">⚠️ Alerts</h3>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors
              ${
                filter === cat
                  ? "bg-[#c21229] text-white"
                  : "bg-[#1f1f1f] text-gray-300 hover:bg-[#c21229]/40 hover:text-white"
              }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <ul className="space-y-2 text-sm text-gray-100">
        {filteredAlerts.map((alert) => (
          <li
            key={alert.id}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-[#c21229]/40 transition-colors"
          >
            <span>{typeIcons[alert.type]}</span>
            <span>{alert.message}</span>
          </li>
        ))}
        {filteredAlerts.length === 0 && (
          <li className="text-gray-400 italic">No alerts in this category</li>
        )}
      </ul>
    </div>
  );
}
