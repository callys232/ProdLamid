// components/TierCard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import TickingBullet from "./tickBullet";

interface TierCardProps {
  title: string;
  services: { name: string; href?: string }[];
  highlight?: boolean;
  tierHref: string;
}

export default function TierCard({
  title,
  services,
  highlight,
  tierHref,
}: TierCardProps) {
  const [expanded, setExpanded] = useState(false);

  const keyFeatures = services.slice(0, 2);
  const otherFeatures = services.slice(2);

  return (
    <div
      className={`rounded-lg shadow-lg p-6 border ${
        highlight ? "border-[#c12129]" : "border-white"
      } bg-white transform transition duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(193,33,41,0.6)]`}
    >
      <h3
        className={`text-2xl font-bold mb-6 ${
          highlight ? "text-[#c12129]" : "text-black"
        }`}
      >
        {title}
      </h3>

      <ul className="space-y-4">
        {keyFeatures.map((svc, idx) => (
          <li
            key={idx}
            className="flex items-center gap-3 border-b border-gray-200 pb-2"
          >
            <TickingBullet />
            <span className="text-black">{svc.name}</span>
          </li>
        ))}

        {expanded &&
          otherFeatures.map((svc, idx) => (
            <li
              key={idx}
              className="flex items-center gap-3 border-b border-gray-200 pb-2"
            >
              <TickingBullet />
              <span className="text-black">{svc.name}</span>
            </li>
          ))}
      </ul>

      {otherFeatures.length > 0 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 text-sm font-semibold text-[#c12129] hover:text-black transition"
        >
          {expanded ? "Show Less ▲" : "Show More ▼"}
        </button>
      )}

      {/* Tier-level button */}
      <div className="mt-6">
        <Link
          href={tierHref}
          className="w-full block text-center bg-[#c12129] text-white py-2 rounded hover:bg-black transition"
        >
          {/* Go to {title} Page */}
          Upgrade to Premuim
        </Link>
      </div>
    </div>
  );
}
