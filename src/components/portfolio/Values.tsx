"use client";

import React from "react";

const values = [
  "Integrity",
  "Authenticity & Simplicity",
  "Innovation & Results Driven",
  "Seamless Service",
  "Partnership",
  "Client Value Creation",
  "Learning Advantage",
  "Timely Solution",
];

const ValuesSection: React.FC = () => {
  return (
    <section
      id="values"
      className="relative bg-black text-white overflow-hidden"
    >
      <section className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold uppercase tracking-wide text-red-400">
              CORE VALUES
            </h2>
          </div>

          {/* Grid of Values */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-gray-800/40 border border-red-500 rounded-xl p-6 text-center 
              hover:bg-gray-700/60 hover:scale-105 transition-all duration-300 shadow-md"
              >
                <h3 className="text-lg font-semibold text-white">{value}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
};

export default ValuesSection;
