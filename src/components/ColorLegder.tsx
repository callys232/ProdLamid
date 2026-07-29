// components/EcosystemLedger.tsx
"use client";

import React from "react";

export default function EcosystemLedger() {
  const items = [
    {
      color: "#1E3A8A",
      label: "Blue",
      title: "Business Innovation Zone (BIZ)",
      tagline: "Where new ventures get built.",
      Icon: (props: { className?: string }) => (
        <svg
          className={props.className}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M10 4h4a2 2 0 0 1 2 2v2h3a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a1 1 0 0 1 1-1h3V6a2 2 0 0 1 2-2Zm4 4V6h-4v2h4Z" />
        </svg>
      ),
    },
    {
      color: "#F97316",
      label: "Orange",
      title: "Talent Development (TD)",
      tagline: "People and skills that compound.",
      Icon: (props: { className?: string }) => (
        <svg
          className={props.className}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-8 1a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm8 2c-2.67 0-8 1.34-8 4v2h12v-2c0-2.66-5.33-4-8-4Zm-10 1c-1.86 0-6 0.94-6 3v2h6v-2c0-0.86 0.34-1.62 0.9-2.26A9.2 9.2 0 0 0 6 15Z" />
        </svg>
      ),
    },
    {
      color: "#16A34A",
      label: "Green",
      title: "Sustainable Development (SD)",
      tagline: "Growth that outlasts the cycle.",
      Icon: (props: { className?: string }) => (
        <svg
          className={props.className}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M20.24 4.24C15 3 9 5 6 9c-3 4-2 9 1 11s7 2 11-1c4-3 6-9 3.24-14.76A1 1 0 0 0 20.24 4.24ZM8 14c2-3 6-5 9-5-3 3-6 4-9 5Z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-black text-white border-t border-white/10 px-6 pb-12">
      <h2 className="text-3xl font-bold text-[#2563EB] text-center mb-10">
        Ecosystem Color Ledger
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {items.map((item, idx) => (
          <article
            key={idx}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md transition duration-300 hover:border-white/25 hover:bg-white/10"
          >
            {/* Accent strip */}
            <div className="h-1.5 w-full" style={{ backgroundColor: item.color }} />

            {/* Card body */}
            <div className="p-6 flex flex-col items-center text-center">
              <div
                className="w-14 h-14 rounded-full mb-4 shadow-lg ring-2 ring-white/10"
                style={{ backgroundColor: item.color }}
              />
              <item.Icon className="h-9 w-9 mb-3 text-[#2563EB]" />
              <h3 className="text-base font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.tagline}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 font-mono">
                <span className="rounded px-2 py-0.5 border border-white/15 bg-white/5">
                  {item.color}
                </span>
                <span className="uppercase tracking-wide text-gray-600">{item.label}</span>
              </div>
            </div>

            {/* Hover glow */}
            <div
              className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300"
              style={{ boxShadow: `0 0 28px ${item.color}30` }}
            />
          </article>
        ))}
      </div>
    </section>
  );
}
