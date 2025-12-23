"use client";
import React from "react";

interface TopbarProps {
  userEmail?: string;
  onSignOut?: () => void;
}

export default function Topbar({
  userEmail = "admin@lamid.com",
  onSignOut,
}: TopbarProps) {
  return (
    <header className="h-14 border-b border-[#1f1f1f] flex items-center justify-between px-6 bg-[#0f0f0f]">
      {/* Search */}
      <input
        type="text"
        placeholder="Search projects, campaigns..."
        className="bg-[#010101] border border-[#1f1f1f] rounded px-3 py-1 text-sm text-white focus:border-[#c21229] w-1/3"
      />

      {/* User Info */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400">{userEmail}</span>
        <button
          onClick={onSignOut}
          className="px-2 py-1 bg-[#c21229] rounded text-white text-xs transition-transform hover:scale-105 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-[#c21229] focus:ring-offset-2"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
