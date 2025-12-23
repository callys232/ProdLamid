"use client";

import React from "react";

const partners = [
  "LAFARGE",
  "Access Bank",
  "Unilever",
  "FirstBank Since 1894",
  "British Council",
];

const Slider: React.FC = () => {
  return (
    <div className="overflow-hidden w-full bg-gray-900 py-6">
      <div className="flex animate-slide gap-12 whitespace-nowrap">
        {partners.concat(partners).map((partner, index) => (
          <div
            key={index}
            className="flex-shrink-0 text-white font-semibold text-sm md:text-base px-6 py-2 bg-gray-800 rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
          >
            {partner}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
