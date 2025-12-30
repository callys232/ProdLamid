"use client";

import React from "react";

const partners = [
  { name: "LAFARGE", logo: "lafarge-logo.png" },
  { name: "Access Bank", logo: "diamond-logo.png" },
  { name: "Champion", logo: "champion-logo.png" },
  { name: "Unilever", logo: "unileverlogo.svg" },
  { name: "FirstBank Since 1894", logo: "firstbank.png" },
  { name: "British Council", logo: "British_Council_logo.png" },
];

const Slider: React.FC = () => {
  return (
    <div className="overflow-hidden w-full bg-gray-900 py-6">
      <div className="flex animate-slide gap-12 whitespace-nowrap">
        {partners.concat(partners).map((partner, index) => (
          <div
            key={index}
            className="flex-shrink-0 px-6 py-2 bg-gray-800 rounded-lg shadow-md hover:scale-105 transition-transform duration-300 flex items-center justify-center"
          >
            <img
              src={partner.logo}
              alt={partner.name}
              className="h-12 w-auto object-contain"
              loading="lazy" // 👈 Lazy-load attribute
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
