"use client";

import React from "react";
import Head from "next/head";

import Image from "next/image";

const HcdHeader = () => {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Discover how our Human Capital Development strategy attracts and grows visionary leaders to drive innovation and client success."
        />
        <meta
          name="keywords"
          content="Human Capital, Talent Development, Leadership, Innovation, Recruitment, Workforce"
        />
        <meta name="lamid" content="Lamid Consulting" />
        <meta
          property="og:title"
          content="Human Capital Development | Attracting World-Class Talent"
        />
        <meta
          property="og:description"
          content="We build visionary leaders to drive innovation and disruption for client advantage."
        />
        <meta property="og:image" content="/LD3.jpg" />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="relative min-h-screen bg-black pt-12 md:pt-24">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <Image
              src="/LD3.jpg"
              alt="Business professionals in discussion"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-70" />
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 py-4 md:py-6">
          <main>
            {/* Header and Logo Section */}
            <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
              <div className="w-full lg:w-3/5">
                <h1
                  className="animate-rainbowPulse drop-shadow-md text-2xl sm:text-3xl md:text-4xl mb-2"
                  data-text="Human Capital Development"
                >
                  Human Capital Development
                </h1>

                <div className="bg-black border border-gray-800 py-2 px-4 inline-block mb-2 md:mb-4">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white animate-glitchPulse [animation-delay:0.6s]">
                    Attracting and Growing World-Class Talent
                  </h2>
                </div>

                <p className="text-white text-xs sm:text-sm md:text-base max-w-2xl mb-6 md:mb-10">
                  We recruit and build visionary leaders and talents with a
                  singular purpose — to create continuous innovation and
                  disruption for client advantage.
                </p>
              </div>

              <div className="w-full lg:w-2/5 flex flex-col items-center lg:items-end mb-8 md:mb-12">
                <div className="glow-circle border-2 border-orange-500 rounded-lg p-2 mb-3 w-40 sm:w-48 md:w-64 hover:scale-105 hover:shadow-lg transition-transform duration-300 ease-in-out">
                  {" "}
                  <Image
                    src="/human-capital-icon.png"
                    alt="Human Capital Development Logo"
                    width={250}
                    height={250}
                  />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-orange-500">
                  HCD
                </h2>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="w-full mt-4 md:mt-8">
              <h3 className="glitch text-lg md:text-xl text-orange-500 font-bold mb-4 md:mb-6">
                BENEFITS
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {[
                  {
                    label: "Convenience",
                    icon: "/EfficiencyIcon.png",
                    border: "border-blue-400",
                  },
                  {
                    label: "Cost Effectiveness",
                    icon: "/CostEffectivenessIcon.png",
                    border: "border-cyan-400",
                  },
                  {
                    label: "Client Responsive Culture",
                    icon: "/ClientResponsivenessIcon.png",
                    border: "border-blue-500",
                  },
                  {
                    label: "Higher Worker Morale",
                    icon: "/StaffEngagementIcon.png",
                    border: "border-yellow-400",
                  },
                  {
                    label: "Additional Sales",
                    icon: "/EfficiencyIcon.png",
                    border: "border-blue-400",
                  },
                  {
                    label: "Flexibility",
                    icon: "/CostEffectivenessIcon.png",
                    border: "border-cyan-400",
                  },
                  {
                    label: "Leading Edge Skills",
                    icon: "/ClientResponsivenessIcon.png",
                    border: "border-blue-500",
                  },
                  {
                    label: "Increased Productivity",
                    icon: "/StaffEngagementIcon.png",
                    border: "border-yellow-400",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="pop-item flex flex-col items-center mt-4 md:mt-6"
                  >
                    <div
                      className={`glow-circle w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border-4 ${item.border} bg-black transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-lg`}
                    >
                      <Image
                        src={item.icon}
                        alt={`${item.label} Icon`}
                        width={45}
                        height={45}
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                      />
                    </div>
                    <p className="text-white text-xs sm:text-sm text-center mt-2">
                      {item.label}
                    </p>
                  </div>

                  //   </div>
                  //   <p className="text-white text-xs sm:text-sm text-center">
                  //     {item.label}
                  //   </p>
                  // </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default HcdHeader;
