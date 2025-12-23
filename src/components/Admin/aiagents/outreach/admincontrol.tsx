"use client";
import React from "react";

export default function AdminControls() {
  return (
    <div>
      <h4 className="text-white font-semibold mb-2">Admin Controls</h4>
      <div className="flex gap-2">
        <button className="px-3 py-1 bg-[#c21229] text-white rounded transition-transform transform hover:scale-105 hover:bg-red-700">
          Approve Draft
        </button>
        <button className="px-3 py-1 bg-[#c21229] text-white rounded transition-transform transform hover:scale-105 hover:bg-red-700">
          Manage Mailing Lists
        </button>
        <button className="px-3 py-1 bg-[#c21229] text-white rounded transition-transform transform hover:scale-105 hover:bg-red-700">
          Adjust Keywords
        </button>
      </div>
    </div>
  );
}
