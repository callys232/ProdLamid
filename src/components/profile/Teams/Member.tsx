"use client";
import React from "react";

interface MemberItemProps {
  name: string;
  role: string;
  avatarUrl?: string; // optional avatar image
}

export function MemberItem({ name, role, avatarUrl }: MemberItemProps) {
  // fallback initials if no avatar
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <li
      role="listitem"
      className="flex items-center justify-between bg-gray-800 px-4 py-3 rounded-lg 
                 ring-1 ring-gray-700 hover:ring-2 hover:ring-red-500 
                 transition transform hover:scale-[1.02] shadow-sm"
    >
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${name || "Unknown"} avatar`}
            className="w-8 h-8 rounded-full border border-gray-600 object-cover 
                       hover:scale-105 transition"
          />
        ) : (
          <div
            aria-hidden="true"
            className="w-8 h-8 flex items-center justify-center rounded-full 
                       bg-gray-700 text-white text-xs font-bold"
          >
            {initials}
          </div>
        )}
        <span className="font-medium text-white">{name || "Unknown"}</span>
      </div>
      <span className="text-xs text-gray-400">{role}</span>
    </li>
  );
}
