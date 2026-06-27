"use client";

import React from "react";
import Image from "next/image";
import { FaLeaf, FaHospital, FaUsers } from "react-icons/fa";

// Glassmorphic tooltip with dark orange tone
const tooltipClasses =
  "absolute left-0 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 " +
  "bg-orange-900/80 backdrop-blur-md border border-orange-400/40 text-sm text-orange-100 " +
  "px-3 py-2 rounded-lg shadow-lg w-64 z-10";

// Arrow pointer styled in dark orange glassmorphic
const arrowClasses =
  "absolute -top-2 left-4 w-4 h-4 bg-yellow-900/80 backdrop-blur-md border border-yellow-400/40 rotate-45";

const Impact: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-300 mb-20">
          Impact
        </h1>

        <div className="space-y-20">
          {/* Section 1: Job and Wealth Creation */}
          <section className="flex flex-col md:flex-row gap-8 relative">
            <div className="w-full md:w-1/4 flex-shrink-0">
              <div className="relative h-48 w-full rounded-lg overflow-hidden">
                <Image
                  src="/farmers.png"
                  alt="Farmers working together"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            </div>

            <div className="w-full md:w-3/4">
              <div className="flex items-start gap-4 mb-3 relative">
                <div className="mt-1">
                  <FaUsers className="h-8 w-8 text-yellow-500" />
                </div>
                {/* Heading with tooltip */}
                <div className="relative group flex-grow">
                  <div className="bg-transparent border border-green-500 text-green-400 px-4 py-2 rounded-md">
                    <h2 className="text-xl font-medium">
                      Job and Wealth Creation for Social Cohesion & Economic
                      Recovery
                    </h2>
                  </div>
                  <div className={tooltipClasses}>
                    <div className={arrowClasses}></div>
                    Cooperatives drive job creation and wealth distribution
                    across communities.
                  </div>
                </div>
              </div>

              <p className="text-[15px] text-gray-400 leading-relaxed mb-6 pl-12">
                We re-positioned cooperatives to re-set globalization; starting
                from few groups to communities and nations. By experience, we
                see job and wealth creation with cooperatives as ...
              </p>

              <p className="text-yellow-500 hover:underline cursor-pointer pl-12">
                Learn how this unique opportunity transformed over 5000
                cooperatives.
              </p>
            </div>
          </section>

          {/* Section 2: Healthcare Partnerships */}
          <section className="flex flex-col md:flex-row gap-8 relative">
            <div className="w-full md:w-1/4 flex-shrink-0">
              <div className="relative h-48 w-full rounded-lg overflow-hidden">
                <Image
                  src="/hospital.png"
                  alt="Hospital room"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            </div>

            <div className="w-full md:w-3/4">
              <div className="flex items-start gap-4 mb-3 relative">
                <div className="mt-1">
                  <FaHospital className="h-8 w-8 text-white" />
                </div>
                {/* Heading with tooltip */}
                <div className="relative group flex-grow">
                  <div className="bg-transparent border border-green-500 text-green-400 px-4 py-2 rounded-md">
                    <h2 className="text-xl font-medium">
                      Building Communities on Managed Healthcare Partnerships
                    </h2>
                  </div>
                  <div className={tooltipClasses}>
                    <div className={arrowClasses}></div>
                    Sustainable healthcare partnerships improved maternal care
                    and child survival.
                  </div>
                </div>
              </div>

              <p className="text-[15px] text-gray-400 leading-relaxed pl-12">
                We improved maternal care, child survival and primary healthcare
                delivery and achieved organizational and financial
                sustainability among five communities partnerships-for-health,
                after USAIDs grant withdrawal by Johns Hopkins University,
                Centre for Educational Development and Population Activities
                (CEDPA) and BASICS/Initiatives Virginia.
              </p>
            </div>
          </section>

          {/* Section 3: Climate Change */}
          <section className="flex flex-col md:flex-row gap-8 relative">
            <div className="w-full md:w-1/5 flex-shrink-0 flex justify-center">
              <FaLeaf className="h-12 w-12 text-white" />
            </div>

            <div className="w-full md:w-2/3 relative">
              <div className="mb-3 relative group">
                <div className="bg-transparent border border-green-500 text-green-400 px-4 py-2 rounded-md">
                  <h2 className="text-xl font-medium">
                    Combating Climate Change with Renewable Energy
                  </h2>
                </div>
                <div className={tooltipClasses}>
                  <div className={arrowClasses}></div>
                  Renewable energy projects foster peace and sustainability in
                  Niger Delta communities.
                </div>
              </div>

              <p className="text-[15px] text-gray-400 leading-relaxed mb-6">
                By building women and youth-led entrepreneurial services
                clusters around Shells renewable energy assets, we achieved
                equalization, mediation and peace making in the volatile,
                conflict-prone Niger Delta communities with environmental
                remediation and tactical stakeholder engagements.
              </p>

              <p className="text-yellow-500 hover:underline cursor-pointer">
                Read more
              </p>
            </div>

            <div className="w-full md:w-1/4 order-3 md:order-3">
              <div className="relative h-64 w-full rounded-lg overflow-hidden">
                <Image
                  src="/lightbulb.png"
                  alt="Lightbulb with green plant inside"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </section>

          {/* Section 4: Digital Divide */}
          <section className="flex flex-col md:flex-row gap-8 relative">
            <div className="w-full md:w-1/5 flex-shrink-0 flex justify-center">
              <FaUsers className="h-12 w-12 text-white" />
            </div>

            <div className="w-full md:w-1/2 relative">
              <div className="mb-3 relative group">
                <div className="bg-transparent border border-green-500 text-green-400 px-4 py-2 rounded-md">
                  <h2 className="text-xl font-medium">
                    Bridging the Digital and Generational Divide for Global
                    Partnerships
                  </h2>
                </div>
                <div className={tooltipClasses}>
                  <div className={arrowClasses}></div>
                  Digital skills and startups help bridge youth unemployment and
                  generational gaps.
                </div>
              </div>

              <p className="text-[15px] text-gray-400 leading-relaxed mb-8">
                We addressed youth unemployment and bridged the wealth creation
                gap by: supporting startups, addressing youth unemployability,
                generating high-growth jobs, and retained local talents through
                ...
              </p>

              <div className="flex items-center">
                <span className="text-yellow-500 text-sm">Read more</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="w-full md:w-1/4 flex justify-end">
              <div className="relative h-64 w-full rounded-lg overflow-hidden">
                <Image
                  src="/helping-hand.png"
                  alt="Person helping another climb up"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </section>
        </div>
      </main>

    </div>
  );
};

export default Impact;
