import React from "react";
import Image from "next/image";

const BizToolbox = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">

    <main className="container mx-auto px-4 py-16">
      {/* Header Section */}
      <header className="mb-12 text-center">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">
          <span className="text-red-500">B</span>usiness 
          <span className="text-red-500"> E</span>xpansion 
          <span className="text-red-500"> S</span>trategy and 
          <span className="text-red-500"> T</span>echnology
          <span className="text-gray-300"> - BEST - Our all-in-one Growth Tool Box</span>
        </h1>
        <p className="text-gray-300 text-sm md:text-base">
          We use expertise and technology to innovate and hand-hold the entrepreneur and business
        </p>
      </header>

      {/* Suite Tour Section */}
      <div className="mt-16">
        <h2 className="text-center text-xl md:text-2xl font-bold text-yellow-400 mb-8">SUITE TOUR</h2>
        
        <div className="flex flex-col md:flex-row justify-between items-stretch gap-4 mt-10">
          {/* Left Green Section */}
          <div className="bg-transparent border-2 border-green-500 rounded-lg p-6 md:w-1/3 relative">
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-gray-900 border-2 border-green-500 rotate-45"></div>
            <ul className="space-y-2 text-sm md:text-base">
              <li className="font-semibold">Diagnostics and Health Check</li>
              <li>Opportunity Identification</li>
              <li>Business Model Canvas</li>
              <li>Structures, Processes and Systems</li>
              <li>Advisory & Innovation</li>
              <li>Entrepreneurship & Training</li>
              <li>Strategy</li>
            </ul>
          </div>

          {/* Middle Orange Section */}
          <div className="bg-transparent border-2 border-orange-500 rounded-lg p-6 md:w-1/3 relative">
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-gray-900 border-2 border-orange-500 rotate-45"></div>
            <ul className="space-y-2 text-sm md:text-base">
              <li>e-Accounting, Finance Syndication & Credit sourcing</li>
              <li>Digital Tools and Services</li>
              <li>Executive Attachment and Mentoring</li>
              <li>e-Clients Relations Management</li>
              <li>Brand Building</li>
              <li>e-Commerce, Linkages, Joint Venture</li>
              <li>Export Syndication</li>
            </ul>
          </div>

          {/* Right Blue Section */}
          <div className="bg-transparent border-2 border-blue-500 rounded-lg p-6 md:w-1/3 relative">
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-gray-900 border-2 border-blue-500 rotate-45"></div>
            <ul className="space-y-2 text-sm md:text-base">
              <li>Dominate markets</li>
              <li>Develop state-of-the-art products and services</li>
              <li>Set up robust financial, operational and control systems</li>
              <li>Innovate and re-position for sustainable margins</li>
              <li>Connect to, and harness diverse talents</li>
              <li>Find new opportunities</li>
              <li>Scale and make the solution globally accessible</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
  );
};

export default BizToolbox;
