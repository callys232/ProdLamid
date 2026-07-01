"use client";

import React from "react";

const partners = [
  { name: "LAFARGE",          logo: "lafarge-logo.png" },
  { name: "Access Bank",      logo: "diamond-logo.png" },
  { name: "Champion",         logo: "champion-logo.png" },
  { name: "Unilever",         logo: "unileverlogo.svg" },
  { name: "FirstBank",        logo: "firstbank.png" },
  { name: "British Council",  logo: "British_Council_logo.png" },
];

/* Duplicate list so the loop is seamless (animate-slide moves -50%) */
const ITEMS = [...partners, ...partners];

const Slider: React.FC = () => {
  return (
    <div className="overflow-hidden w-full bg-gray-900 py-10">
      <div className="flex animate-slide gap-20 whitespace-nowrap">
        {ITEMS.map((partner, index) => (
          <div
            key={index}
            className="flex-shrink-0 px-10 py-5 bg-gray-800 rounded-2xl shadow-md hover:scale-105 transition-transform duration-300 flex items-center justify-center"
          >
            <img
              src={partner.logo}
              alt={partner.name}
              className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
