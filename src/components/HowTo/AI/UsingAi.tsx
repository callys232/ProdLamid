"use client";

import { useState } from "react";

interface PromoLeftProps {
  title: string;
  subtitle: string;
  placeholder?: string;
  buttonLabel?: string;
  botUrl: string; // URL to your bot
}

export default function PromoLeft({
  title,
  subtitle,
  placeholder = "Let's build your team...",
  buttonLabel = "Search",
  botUrl,
}: PromoLeftProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    // Redirect user to your bot with query
    const url = `${botUrl}?q=${encodeURIComponent(query)}`;
    window.location.href = url;
  };

  return (
    <div className="bg-black text-white p-6 rounded-lg space-y-4">
      {/* Title */}
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-sm text-gray-300">{subtitle}</p>

      {/* Input + Button */}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 rounded-md border border-[#c21219] focus:ring-2 focus:ring-[#c21219] text-black"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-black hover:bg-[#c21219] text-white rounded-md border border-[#c21219] transition-colors"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
