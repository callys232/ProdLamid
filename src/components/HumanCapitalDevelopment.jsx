import React from "react";
import Image from "next/image";
import Events from "./Event";

export default function HumanCapitalDevelopment() {
  return (
    <div className="bg-black text-white min-h-screen w-full">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="w-full h-px bg-gray-700 mb-6"></div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="border-2 border-orange-500 rounded-lg p-4 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image
                src="/human-capital-icon.png"
                alt="Human Capital Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-xl md:text-2xl lg:text-3xl">
              <span className="text-orange-500">H</span>uman
              <span className="text-orange-500"> C</span>apital
              <span className="text-orange-500"> D</span>evelopment
            </h1>
            <div className="border border-orange-500 rounded-full mt-2 md:mt-4 p-2">
              <p className="text-center text-xs md:text-sm lg:text-base">
                Attracting and Growing World-class Talent
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Recruitment Section */}
          <div className="flex flex-col sm:flex-row">
            <div className="bg-gray-300 w-full sm:w-24 md:w-32 h-24 md:h-32 mb-4 sm:mb-0 sm:mr-4"></div>
            <div>
              <h2 className="text-orange-500 text-lg md:text-xl lg:text-2xl mb-2 md:mb-4">
                Recruitment
              </h2>
              <p className="text-xs md:text-sm mb-3 md:mb-4">
                We recognize and deal with the challenges posed by the growing
                scarcity of skilled management and technical talent.
              </p>
              <div className="flex gap-2">
                <button className="bg-black text-white border border-white px-3 py-1 text-xs md:text-sm">
                  Learn How
                </button>
                <button className="bg-black text-white border border-white px-3 py-1 text-xs md:text-sm">
                  Learn How
                </button>
              </div>
            </div>
          </div>

          {/* Training Section */}
          <div className="flex flex-col items-start md:items-end">
            <h2 className="text-orange-500 text-lg md:text-xl lg:text-2xl mb-2 md:mb-4">
              Training
            </h2>
            <p className="text-xs md:text-sm mb-3 md:mb-4 text-left md:text-right">
              We light-up your team and remodel their mindset and strategies to
              succeed beyond the 21st century.
            </p>
            <button className="bg-gray-800 text-white px-3 py-1 text-xs md:text-sm">
              See How
            </button>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-wrap justify-center gap-1 md:gap-2 mb-6 md:mb-8">
          <div className="bg-gray-700 text-white px-2 py-1 text-xs md:text-sm">
            STRATEGY
          </div>
          <div className="bg-orange-500 text-white px-2 py-1 text-xs md:text-sm">
            SOFT SKILLS
          </div>
          <div className="bg-green-700 text-white px-2 py-1 text-xs md:text-sm">
            LEADERSHIP
          </div>
          <div className="bg-purple-900 text-white px-2 py-1 text-xs md:text-sm">
            MANAGEMENT
          </div>
          <div className="bg-amber-700 text-white px-2 py-1 text-xs md:text-sm">
            ENTREPRENEURSHIP
          </div>
          <div className="bg-blue-700 text-white px-2 py-1 text-xs md:text-sm">
            MARKETING
          </div>
          <div className="bg-transparent text-white border border-white px-2 py-1 text-xs md:text-sm">
            SALES
          </div>
        </div>

        {/* Benefits & Results */}
        <div className="mb-8">
          <div className="border border-orange-500 rounded-lg inline-block px-4 md:px-8 py-1 md:py-2 mb-6 md:mb-8">
            <h2 className="text-orange-500 text-lg md:text-xl">
              BENEFITS & RESULTS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 md:gap-8">
            <div className="flex flex-col items-center lg:col-span-1">
              <h3 className="text-sm md:text-base mb-3 md:mb-4">Efficiency</h3>
              <div className="relative w-16 h-16 md:w-20 md:h-20 mb-3 md:mb-4">
                <div className="bg-blue-500 rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                  <Image
                    src="/EfficiencyIcon.png"
                    alt="Efficiency Icon"
                    width={48}
                    height={48}
                  />
                </div>
              </div>
              <h3 className="text-sm md:text-base mt-2 md:mt-4">
                Competitiveness
              </h3>
            </div>

            <div className="flex flex-col items-center lg:col-span-1">
              <h3 className="text-sm md:text-base mb-3 md:mb-4">
                Cost Effectiveness
              </h3>
              <div className="relative w-16 h-16 md:w-20 md:h-20 mb-3 md:mb-4">
                <div className="bg-cyan-300 rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                  <Image
                    src="/CostEffectivenessIcon.png"
                    alt="Cost Effectiveness Icon"
                    width={48}
                    height={48}
                  />
                </div>
              </div>
              <h3 className="text-sm md:text-base mt-2 md:mt-4">Flexibility</h3>
            </div>

            <div className="flex flex-col items-center lg:col-span-1">
              <h3 className="text-sm md:text-base mb-3 md:mb-4">
                Client Responsiveness
              </h3>
              <div className="relative w-16 h-16 md:w-20 md:h-20 mb-3 md:mb-4">
                <div className="bg-blue-500 rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                  <Image
                    src="/ClientResponsivenessIcon.png"
                    alt="Client Responsiveness Icon"
                    width={48}
                    height={48}
                  />
                </div>
              </div>
              <h3 className="text-sm md:text-base mt-2 md:mt-4">
                Leading Edge Skills
              </h3>
            </div>

            <div className="flex flex-col items-center sm:col-span-2 lg:col-span-2">
              <div className="relative w-28 h-28 md:w-32 md:h-32 lg:w-40 lg:h-40">
                <Image
                  src="/Training.png"
                  alt="Training"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <div className="flex flex-col items-center lg:col-span-1">
              <h3 className="text-sm md:text-base mb-3 md:mb-4">
                Staff Engagement
              </h3>
              <div className="relative w-16 h-16 md:w-20 md:h-20 mb-3 md:mb-4">
                <div className="bg-yellow-500 rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                  <Image
                    src="/StaffEngagementIcon.png"
                    alt="Staff Engagement Icon"
                    width={48}
                    height={48}
                  />
                </div>
              </div>
              <h3 className="text-sm md:text-base mt-2 md:mt-4">
                Productivity
              </h3>
            </div>
          </div>
        </div>
      </div>

<div className="container mx-auto px-4 py-6 md:py-8">
<div className="w-full h-px bg-gray-700 mb-6"></div>
</div>
      
      <Events/>
    </div>
  );
}
