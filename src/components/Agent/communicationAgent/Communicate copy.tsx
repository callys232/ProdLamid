"use client";

import React, { useState } from "react";

interface NotificationChannel {
  type: "Email" | "Slack" | "SMS";
  enabled: boolean;
}

interface EscalationWorkflow {
  name: string;
  thresholdDays: number;
  status: "Active" | "Paused";
}

interface RiskAlert {
  message: string;
  severity: "Low" | "Medium" | "High";
}

export default function CommunicationAgent() {
  // State
  const [channels, setChannels] = useState<NotificationChannel[]>([
    { type: "Email", enabled: false },
    { type: "Slack", enabled: false },
    { type: "SMS", enabled: false },
  ]);

  const [workflows, setWorkflows] = useState<EscalationWorkflow[]>([
    { name: "Overdue Tasks", thresholdDays: 3, status: "Active" },
    { name: "Billing Delays", thresholdDays: 7, status: "Paused" },
  ]);

  const [alerts, setAlerts] = useState<RiskAlert[]>([
    { message: "Milestone overdue!", severity: "High" },
    { message: "Quality review pending", severity: "Medium" },
  ]);

  // Track current step
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Handlers
  const toggleChannel = (type: NotificationChannel["type"]) => {
    setChannels((prev) =>
      prev.map((c) => (c.type === type ? { ...c, enabled: !c.enabled } : c))
    );
    setCurrentStep(2); // move to next step once a channel is toggled
  };

  const updateWorkflow = (name: string, thresholdDays: number) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.name === name ? { ...w, thresholdDays } : w))
    );
    setCurrentStep(3); // move to next step once workflow updated
  };

  const acknowledgeAlerts = () => {
    setCurrentStep(4); // final step
  };

  return (
    <div className="bg-[#010101] p-6 rounded-lg border border-[#1f1f1f]">
      <h3 className="text-lg font-semibold mb-3">
        📢 Communication, Notification & Risk Agent
      </h3>

      {/* Progress Tracker */}
      <div className="mb-6">
        <p className="text-gray-300 text-sm mb-2">
          Step {currentStep} of {totalSteps}
        </p>
        <div className="bg-[#333] h-2 rounded">
          <div
            className="bg-[#3b82f6] h-2 rounded transition-all duration-500"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Notification Channels */}
      {currentStep >= 1 && (
        <div className="bg-[#1a1a1a] p-4 rounded border border-[#374151] mb-4">
          <h4 className="text-white font-semibold mb-2">
            📩 Automated Reminders
          </h4>
          <p className="text-gray-400 text-sm mb-3">
            Choose where reminders should be sent.
          </p>
          <div className="flex gap-3">
            {channels.map((c) => (
              <button
                key={c.type}
                type="button"
                onClick={() => toggleChannel(c.type)}
                className={`px-3 py-1 rounded ${
                  c.enabled
                    ? "bg-[#3b82f6] text-white"
                    : "bg-[#0f0f0f] text-gray-300 border border-[#374151]"
                }`}
              >
                {c.type}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Escalation Workflows */}
      {currentStep >= 2 && (
        <div className="bg-[#1a1a1a] p-4 rounded border border-[#374151] mb-4">
          <h4 className="text-white font-semibold mb-2">
            ⚡ Escalation Workflows
          </h4>
          <p className="text-gray-400 text-sm mb-3">
            Define what happens when tasks or payments are overdue.
          </p>
          {workflows.map((w, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-[#0f0f0f] p-3 rounded mb-2"
            >
              <div>
                <p className="text-white font-medium">{w.name}</p>
                <p className="text-xs text-gray-400">
                  Threshold: {w.thresholdDays} days • Status: {w.status}
                </p>
              </div>
              <input
                aria-label="number"
                type="number"
                min={1}
                value={w.thresholdDays}
                onChange={(e) => updateWorkflow(w.name, Number(e.target.value))}
                className="w-16 p-1 rounded bg-[#1a1a1a] text-white text-sm"
              />
            </div>
          ))}
        </div>
      )}

      {/* Step 3: Risk Alerts */}
      {currentStep >= 3 && (
        <div className="bg-[#1a1a1a] p-4 rounded border border-[#374151] mb-4">
          <h4 className="text-white font-semibold mb-2">🚨 Risk Alerts</h4>
          <p className="text-gray-400 text-sm mb-3">
            Active alerts for delays or quality issues.
          </p>
          {alerts.map((a, i) => (
            <div
              key={i}
              className={`p-3 rounded mb-2 ${
                a.severity === "High"
                  ? "bg-red-900/40 border border-red-500"
                  : a.severity === "Medium"
                  ? "bg-yellow-900/40 border border-yellow-500"
                  : "bg-green-900/40 border border-green-500"
              }`}
            >
              <strong className="text-white">{a.message}</strong>
              <p className="text-xs text-gray-300">Severity: {a.severity}</p>
            </div>
          ))}
          <button
            type="button"
            onClick={acknowledgeAlerts}
            className="mt-2 px-3 py-1 bg-[#3b82f6] text-white rounded"
          >
            Acknowledge Alerts
          </button>
        </div>
      )}

      {/* Step 4: Admin Controls */}
      {currentStep >= 4 && (
        <div className="bg-[#1a1a1a] p-4 rounded border border-[#374151]">
          <h4 className="text-white font-semibold mb-2">⚙️ Admin Controls</h4>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>✏️ Customize notification templates (Email, Slack, SMS)</li>
            <li>📊 Set escalation thresholds</li>
            <li>📢 Broadcast announcements across teams</li>
          </ul>
        </div>
      )}
    </div>
  );
}
