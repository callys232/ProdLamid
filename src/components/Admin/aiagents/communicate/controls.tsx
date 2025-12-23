"use client";
import React from "react";

interface AdminControlsProps {
  onCustomizeTemplates?: () => void;
  onSetThresholds?: () => void;
  onBroadcast?: () => void;
}

export default function AdminControls({
  onCustomizeTemplates,
  onSetThresholds,
  onBroadcast,
}: AdminControlsProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-white font-semibold mb-2">Admin Controls</h4>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onCustomizeTemplates}
          className="px-4 py-2 bg-[#c21229] text-white rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-red-700"
        >
          ✏️ Customize Templates
        </button>
        <button
          onClick={onSetThresholds}
          className="px-4 py-2 bg-[#c21229] text-white rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-red-700"
        >
          📊 Set Escalation Thresholds
        </button>
        <button
          onClick={onBroadcast}
          className="px-4 py-2 bg-[#c21229] text-white rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-red-700"
        >
          📢 Broadcast Announcement
        </button>
      </div>
    </div>
  );
}
