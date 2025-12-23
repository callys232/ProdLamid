"use client";

import React from "react";

export default function LockedMessage({
  agentName,
  onSignup,
  onClose,
}: {
  agentName: string;
  onSignup: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#374151] text-center max-w-sm w-full">
        <h4 className="text-white font-semibold mb-2">🔒 {agentName} Locked</h4>
        <p className="text-sm text-gray-400 mb-4">
          This agent is available to members only. Sign up to unlock premium
          access and continue with {agentName}.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onSignup}
            className="px-4 py-2 bg-gradient-to-r from-[#c21219] to-[#a40e14] text-white rounded hover:opacity-90 transition"
          >
            Sign Up / Log In
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
