import React from "react";
import Image from "next/image";
import "animate.css";

const BizToolbox = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-md p-6 shadow-lg hover:shadow-xl transition duration-300">
          {/* Icon */}
          <div className="w-32 h-32 relative flex-shrink-0 transform hover:scale-105 transition duration-300">
            <Image
              src="/best-icon.png"
              alt="BEST Logo"
              width={128}
              height={128}
              priority
              loading="eager"
              style={{ objectFit: "contain" }}
            />
          </div>

          {/* Text Block */}
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 hover:text-gray-300 transition duration-300">
              <span className="text-blue-500 animate-float">B</span>usiness
              <span className="text-yellow-500 animate-float"> E</span>xpansion
              <span className="text-orange-500 animate-float"> S</span>trategy
              <span> and </span>
              <span className="text-green-500 animate-float">T</span>echnology
              {/* Tooltip wrapper */}
              <div className="relative group inline-block ml-2">
                <span className="text-gray-400 group-hover:text-white transition">
                  - The-All-in-One-BIZ ToolBox
                </span>
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-max px-3 py-1 text-xs bg-black/80 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Here, we accelerate your business growth with a comprehensive
                  suite of services.
                </div>
              </div>
            </h2>

            <p className="text-gray-300 text-sm md:text-base hover:text-white transition duration-300">
              We use expertise and technology to innovate and hand-hold the
              entrepreneur and business.
            </p>
            <p className="text-base text-gray-300 hover:text-white transition duration-300 mt-4">
              BEST constructs the bridge that connects your idea and dream to
              the global market.
            </p>
          </div>
        </div>

        {/* SUITE TOUR heading */}
        <h2 className="text-center text-xl md:text-2xl font-bold text-orange-400 mb-8 relative overflow-hidden group transition duration-300">
          <span className="relative z-10 group-hover:text-yellow-300 transition duration-300">
            SUITE TOUR
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-600 to-transparent opacity-0 group-hover:opacity-60 blur-md scale-150 transition duration-500"></span>
        </h2>

        {/* Cards */}
        <div className="flex flex-col md:flex-row justify-between items-stretch gap-4 mt-10">
          {/* Green */}
          <div className="relative group bg-transparent border-2 border-green-500 rounded-lg p-6 md:w-1/3 hover:border-green-700 transition duration-300 animate__animated animate__fadeInUp animate__delay-1s overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-green-400/30 to-transparent opacity-0 group-hover:opacity-20 transition duration-700 blur-lg pointer-events-none z-0"></div>
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 h-8 w-8 bg-gray-900 border-2 border-green-500 rotate-45 z-10"></div>
            <ul className="space-y-2 text-sm md:text-base relative z-10">
              <li className="font-semibold hover:text-green-600 transition duration-300">
                Business Health Assessment
              </li>
              <li> Growth Readiness Diagnosis </li>
              <li>Business Model Design</li>
              <li>Entrepreneurial Leadership Development</li>
              <li>HR Services</li>
              <li>Marketing Development</li>
              <li>Demand Acceleration</li>
              <li>Strategy</li>
            </ul>
          </div>

          {/* Orange */}
          <div className="relative group bg-transparent border-2 border-orange-500 rounded-lg p-6 md:w-1/3 hover:border-orange-700 transition duration-300 animate__animated animate__fadeInUp animate__delay-2s overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-orange-400/30 to-transparent opacity-0 group-hover:opacity-20 transition duration-700 blur-lg pointer-events-none z-0"></div>
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 h-8 w-8 bg-gray-900 border-2 border-orange-500 rotate-45 z-10"></div>
            <ul className="space-y-2 text-sm md:text-base relative z-10">
              <li>E-Accounting</li>
              <li>Growth Financing and Credit Access</li>
              <li>Digital Integration</li>
              <li>Executive Immersion & Momentorship </li>
              <li>E-commerce</li>
              <li>Export Acceleration</li>
            </ul>
          </div>

          {/* Blue */}
          <div className="relative group bg-transparent border-2 border-blue-500 rounded-lg p-6 md:w-1/3 hover:border-blue-700 transition duration-300 animate__animated animate__fadeInUp animate__delay-3s overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-400/30 to-transparent opacity-0 group-hover:opacity-20 transition duration-700 blur-lg pointer-events-none z-0"></div>
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 h-8 w-8 bg-gray-900 border-2 border-blue-500 rotate-45 z-10"></div>
            <ul className="space-y-2 text-sm md:text-base relative z-10">
              <li>Opportunities' Discovery</li>
              <li>Develop state-of-the-art services</li>
              <li>Set up robust financial, operational and control systems</li>
              <li>Innovate and re-position for sustainable margins</li>
              <li>Connect to, and harness diverse talents</li>
              <li>Scale and make the solution globally accessible</li>
              <li>Discover new opportunities</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BizToolbox;
