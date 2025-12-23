"use client";

import { useState, ChangeEvent } from "react";

type CommunicationTone = "professional" | "friendly" | "direct";

interface AISettings {
  communicationTone: CommunicationTone;
  automationLevel: "low" | "moderate" | "high";
  notifyForUpdates: boolean;
  autoInviteConsultants: boolean;
  enableAIProjectScoping: boolean;
}

export default function AIPreferences() {
  const [aiSettings, setAiSettings] = useState<AISettings>({
    communicationTone: "professional",
    automationLevel: "moderate",
    notifyForUpdates: true,
    autoInviteConsultants: false,
    enableAIProjectScoping: true,
  });

  const toggle = (key: keyof AISettings) => {
    setAiSettings((prev) => ({
      ...prev,
      [key]: !prev[key] as boolean,
    }));
  };

  const handleToneChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setAiSettings((prev) => ({
      ...prev,
      communicationTone: e.target.value as CommunicationTone,
    }));
  };

  const handleAutomationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setAiSettings((prev) => ({
      ...prev,
      automationLevel: e.target.value as AISettings["automationLevel"],
    }));
  };

  const switches: { label: string; key: keyof AISettings }[] = [
    { label: "Get notified on project updates", key: "notifyForUpdates" },
    {
      label: "AI auto-invite consultants for roles",
      key: "autoInviteConsultants",
    },
    {
      label: "Enable AI project scoping assistant",
      key: "enableAIProjectScoping",
    },
  ];

  return (
    <div className="p-6 bg-gray-950 rounded-xl max-w-2xl border border-gray-800 shadow-lg">
      <h2 className="text-2xl font-bold mb-2 text-white">AI Preferences</h2>
      <p className="text-gray-400 mb-6 text-sm">
        Fine-tune how <span className="text-red-500 font-medium">Lamid AI</span>{" "}
        assists your workflow.
      </p>

      <div className="space-y-8">
        {/* Tone */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Communication Tone
          </label>
          <select
            aria-label="Communication Tone"
            value={aiSettings.communicationTone}
            onChange={handleToneChange}
            className="w-full bg-gray-900 text-white border border-gray-700 px-3 py-2 rounded-md focus:ring-2 focus:ring-red-500 transition"
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="direct">Direct</option>
          </select>
        </div>

        {/* Automation Level */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Automation Level
          </label>
          <select
            aria-label="Automation Level"
            value={aiSettings.automationLevel}
            onChange={handleAutomationChange}
            className="w-full bg-gray-900 text-white border border-gray-700 px-3 py-2 rounded-md focus:ring-2 focus:ring-red-500 transition"
          >
            <option value="low">Low – Minimal AI involvement</option>
            <option value="moderate">Moderate – Balanced automation</option>
            <option value="high">High – AI-driven workflow</option>
          </select>
        </div>

        {/* Switches */}
        <div className="space-y-4">
          {switches.map(({ label, key }) => (
            <div
              key={key}
              className="flex justify-between items-center bg-gray-900 px-4 py-3 rounded-md border border-gray-800 hover:border-red-500 transition"
            >
              <span className="text-gray-300 text-sm">{label}</span>
              <button
                aria-label="btn"
                onClick={() => toggle(key)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                  aiSettings[key]
                    ? "bg-red-600 justify-end"
                    : "bg-gray-700 justify-start"
                }`}
              >
                <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
              </button>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <button className="w-full mt-6 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 px-4 py-2 rounded-md font-medium text-white shadow-md transition">
          Save Preferences
        </button>
      </div>
    </div>
  );
}
