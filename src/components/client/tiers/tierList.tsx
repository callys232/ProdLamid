"use client";

import { useState } from "react";
import Link from "next/link";
import TickingBullet from "./tickBullet";

interface Service {
  name: string;
  href?: string;
}

interface TierCardProps {
  title: string;
  services: Service[];
  highlight?: boolean;
  tierHref: string;
}

export default function TierCard({
  title,
  services,
  highlight = false,
  tierHref,
}: TierCardProps) {
  const [expanded, setExpanded] = useState(false);

  const keyFeatures = services.slice(0, 3);
  const otherFeatures = services.slice(3);

  return (
    <div
      className={`rounded-xl border bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_35px_rgba(193,33,41,0.45)]
      ${highlight ? "border-[#c12129]" : "border-gray-200"}`}
    >
      {/* Title */}
      <h3
        className={`text-2xl font-bold ${highlight ? "text-[#c12129]" : "text-black"
          }`}
      >
        {title}
      </h3>

      {/* red divider */}
      <div className="h-[2px] w-16 bg-[#c12129] my-4"></div>

      {/* Feature List */}
      <ul className="space-y-2">
        {keyFeatures.map((svc) => (
          <li
            key={svc.name}
            className="group relative flex items-center gap-3 px-2 py-2 rounded-md transition"
          >
            {/* hover background */}
            <span className="absolute inset-0 rounded-md bg-[#c12129]/10 opacity-0 group-hover:opacity-100 transition"></span>

            <TickingBullet />

            {svc.href ? (
              <Link
                href={svc.href}
                className="relative text-black group-hover:text-[#c12129] transition"
              >
                {svc.name}
              </Link>
            ) : (
              <span className="relative text-black group-hover:text-[#c12129]">
                {svc.name}
              </span>
            )}
          </li>
        ))}

        {expanded &&
          otherFeatures.map((svc) => (
            <li
              key={svc.name}
              className="group relative flex items-center gap-3 px-2 py-2 rounded-md transition"
            >
              <span className="absolute inset-0 rounded-md bg-[#c12129]/10 opacity-0 group-hover:opacity-100 transition"></span>

              <TickingBullet />

              {svc.href ? (
                <Link
                  href={svc.href}
                  className="relative text-black group-hover:text-[#c12129] transition"
                >
                  {svc.name}
                </Link>
              ) : (
                <span className="relative text-black group-hover:text-[#c12129]">
                  {svc.name}
                </span>
              )}
            </li>
          ))}
      </ul>

      {/* Expand button */}
      {otherFeatures.length > 0 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 text-sm font-semibold text-[#c12129] hover:text-black transition"
        >
          {expanded ? "Show Less ▲" : "Show More ▼"}
        </button>
      )}

      {/* CTA */}
      <div className="mt-6">
        <Link
          href={tierHref}
          className="block w-full text-center bg-[#c12129] text-white py-2 rounded-lg font-semibold transition hover:bg-black"
        >
          Upgrade to {title}
        </Link>
      </div>
    </div>
  );
}