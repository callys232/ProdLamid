"use client";
import React, { useState } from "react";

export default function KeywordTracker({ keywords }: { keywords: string[] }) {
  const [newKeyword, setNewKeyword] = useState("");

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      keywords.push(newKeyword); // In real app, call backend mutation
      setNewKeyword("");
    }
  };

  return (
    <div>
      <h4 className="text-white font-semibold mb-2">Keyword Tracking</h4>
      <ul className="text-gray-300 space-y-1">
        {keywords.map((k, i) => (
          <li key={i}>🔍 {k}</li>
        ))}
      </ul>
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          placeholder="Add keyword"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          className="p-2 rounded bg-[#0f0f0f] text-white flex-1 focus:outline-none focus:border-[#c21229] border border-[#1f1f1f]"
        />
        <button
          onClick={handleAddKeyword}
          className="px-3 py-1 bg-[#c21229] text-white rounded transition-transform transform hover:scale-105 hover:bg-red-700"
        >
          Add
        </button>
      </div>
    </div>
  );
}
