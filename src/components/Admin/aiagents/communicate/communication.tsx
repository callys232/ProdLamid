"use client";
import React, { useEffect, useState } from "react";
import ConversationFlow from "./flow";
import NotificationCenter, { Notification } from "./notify";
import AdminControls from "./controls";
import { ClientProfile } from "@/types/client";

interface BackendNotification {
  message: string;
  channel?: string;
  severity?: string;
}

// Helper to safely map backend strings to Notification["type"]
function mapChannelType(channel?: string): Notification["type"] {
  switch (channel?.toLowerCase()) {
    case "email":
      return "Email";
    case "slack":
      return "Slack";
    case "sms":
      return "SMS";
    case "risk":
      return "Risk";
    case "broadcast":
      return "Broadcast";
    default:
      return "Email"; // fallback default
  }
}

export default function CommunicationAgent({ clientId }: { clientId: string }) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    async function fetchClient() {
      try {
        const res = await fetch(`/api/client/${clientId}`);
        if (!res.ok) throw new Error("Failed to fetch client");
        const data: ClientProfile = await res.json();
        setClient(data);

        // Map backend notifications into NotificationCenter format
        const mapped: Notification[] = (data.notifications || []).map(
          (msg: BackendNotification, i: number) => ({
            id: i + 1,
            type: mapChannelType(msg.channel),
            message: msg.message,
            severity: msg.severity,
          })
        );

        setNotifications(mapped);
      } catch (err) {
        console.error("Error fetching client, using mock data", err);
        // Fallback mock
        setNotifications([
          { id: 1, type: "Email", message: "Reminder: Team sync at 3 PM" },
          {
            id: 2,
            type: "Risk",
            message: "Milestone overdue!",
            severity: "High",
          },
        ]);
      }
    }
    fetchClient();
  }, [clientId]);

  const handleDismiss = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleBroadcast = (message: string) => {
    setNotifications((prev) => [
      ...prev,
      { id: Date.now(), type: "Broadcast", message },
    ]);
  };

  const steps = [
    {
      id: 1,
      title: "📩 Automated Reminders",
      description: "Choose where reminders should be sent.",
      content: (
        <p className="text-gray-300">Channels configured via backend.</p>
      ),
    },
    {
      id: 2,
      title: "⚡ Escalation Workflows",
      description: "Define what happens when tasks or payments are overdue.",
      content: (
        <p className="text-gray-300">Escalation rules loaded from backend.</p>
      ),
    },
    {
      id: 3,
      title: "🚨 Risk Alerts",
      description: "Active alerts for delays or quality issues.",
      content: (
        <p className="text-gray-300">Risk alerts synced from backend.</p>
      ),
    },
    {
      id: 4,
      title: "⚙️ Admin Controls",
      description: "Customize templates and broadcast announcements.",
      content: (
        <AdminControls
          onCustomizeTemplates={() => console.log("Customize templates")}
          onSetThresholds={() => console.log("Set thresholds")}
          onBroadcast={() => handleBroadcast("New broadcast message")}
        />
      ),
    },
  ];

  return (
    <div className="bg-[#010101] p-6 rounded-lg border border-[#1f1f1f] space-y-6">
      <h3 className="text-lg font-semibold text-white">
        📢 Communication Agent
      </h3>
      <ConversationFlow steps={steps} />
      <NotificationCenter
        notifications={notifications}
        onDismiss={handleDismiss}
        onBroadcast={handleBroadcast}
      />
    </div>
  );
}
