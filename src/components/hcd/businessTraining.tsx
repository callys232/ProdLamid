"use client";

import React from "react";
import Image from "next/image";

const BusinessTraining: React.FC = () => {
  return (
    <div className="relative bg-black text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left side - Business diagram */}
          <div className="w-full md:w-1/3">
            <div className="relative w-56 h-56 mx-auto transition-transform duration-300 hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              <Image
                src="/BIZ_LOGOS.png"
                alt="Business Diagram with BIZ, prototypes, and bbgr sections"
                width={220}
                height={220}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>

          {/* Middle - Training description and options */}
          <div className="w-full md:w-1/3 space-y-3">
            <p className="text-gray-200 text-sm mb-3 hover:text-white transition-colors duration-300">
              Use cutting-edge tools to secure top-tier talent for permanent,
              temporary, and contract roles.
            </p>

            <div className="space-y-2">
              <div className="bg-red-900 px-3 py-2 text-sm text-white rounded-md cursor-pointer transition-transform duration-300 hover:scale-105 hover:bg-red-700">
                Functional management training
              </div>
              <div className="bg-amber-800 px-3 py-2 text-sm text-white rounded-md cursor-pointer transition-transform duration-300 hover:scale-105 hover:bg-amber-600">
                Leadership awareness training
              </div>
              <div className="bg-green-900 px-3 py-2 text-sm text-white rounded-md cursor-pointer transition-transform duration-300 hover:scale-105 hover:bg-green-700">
                Job Search workshops
              </div>
            </div>
          </div>

          {/* Right side - People with rising arrow illustration */}
          <div className="w-full md:w-1/3">
            <div className="relative w-56 h-56 mx-auto transition-transform duration-300 hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              <Image
                src="/hcd-team-illustration.png"
                alt="Business growth illustration with people and rising arrow"
                width={260}
                height={260}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessTraining;
