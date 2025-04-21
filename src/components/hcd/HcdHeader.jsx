import React from "react";
import Image from "next/image";

const HcdHeader = () => {
  return (
    <div className="relative min-h-screen bg-black pt-12 md:pt-24">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <Image
            src="/LD3.jpg"
            alt="Business People Background"
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-4 md:py-8">
        <main>
          {/* Header and Logo Section - Flex column on mobile, row on larger screens */}
          <div className="flex flex-col lg:flex-row lg:justify-between gap-8">
            <div className="w-full lg:w-3/5">
              {/* Header Text */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-500 mb-4">
                Human Capital Development
              </h1>

              {/* Main Title Banner - Black box with white text */}
              <div className="bg-black border border-gray-800 py-2 px-4 inline-block mb-4 md:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                  Attracting and Growing World-Class Talent
                </h2>
              </div>

              {/* Description Text */}
              <p className="text-white text-xs sm:text-sm md:text-base max-w-2xl mb-8 md:mb-12">
                We recruit and build visionary leaders and talents with a
                singular purpose - to create continuous innovation and
                disruption for client advantage.
              </p>
            </div>

            {/* Logo Section - Center on mobile, align right on desktop */}
            <div className="w-full lg:w-2/5 flex flex-col items-center lg:items-end mb-8 md:mb-12">
              <div className="border-2 border-orange-500 rounded-lg p-2 mb-3 w-40 sm:w-48 md:w-64">
                <Image
                  src="/human-capital-icon.png"
                  alt="HCD Brain Logo"
                  width={250}
                  height={250}
                  className="w-full h-auto"
                />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-orange-500">
                HCD
              </h2>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="w-full mt-4 md:mt-8">
            <h3 className="text-lg md:text-xl text-orange-500 font-bold mb-4 md:mb-6">
              BENEFITS
            </h3>

            {/* Benefits Grid - 2 columns on small screens, 4 on medium and up */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {/* Row 1 - Text ABOVE icons */}
              <div className="flex flex-col items-center">
                <p className="text-white text-xs sm:text-sm mb-2 md:mb-3 text-center">
                  Convenience
                </p>
                <div className="p-1 sm:p-2 rounded-full bg-transparent border-2 border-blue-400">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center">
                    <Image
                      src="/EfficiencyIcon.png"
                      alt="Convenience Icon"
                      width={45}
                      height={45}
                      className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-white text-xs sm:text-sm mb-2 md:mb-3 text-center">
                  Cost Effectiveness
                </p>
                <div className="p-1 sm:p-2 rounded-full bg-transparent border-2 border-cyan-400">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center">
                    <Image
                      src="/CostEffectivenessIcon.png"
                      alt="Cost Effectiveness Icon"
                      width={45}
                      height={45}
                      className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-white text-xs sm:text-sm mb-2 md:mb-3 text-center">
                  Client Responsive Culture
                </p>
                <div className="p-1 sm:p-2 rounded-full bg-transparent border-2 border-blue-500">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center">
                    <Image
                      src="/ClientResponsivenessIcon.png"
                      alt="Client Responsive Culture Icon"
                      width={45}
                      height={45}
                      className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-white text-xs sm:text-sm mb-2 md:mb-3 text-center">
                  Higher Worker Morale
                </p>
                <div className="p-1 sm:p-2 rounded-full bg-transparent border-2 border-yellow-400">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center">
                    <Image
                      src="/StaffEngagementIcon.png"
                      alt="Higher Worker Morale Icon"
                      width={45}
                      height={45}
                      className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2 - Icons ABOVE text */}
              <div className="flex flex-col items-center mt-4 md:mt-6">
                <div className="p-1 sm:p-2 rounded-full bg-transparent border-2 border-blue-400 mb-2 md:mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center">
                    <Image
                      src="/EfficiencyIcon.png"
                      alt="Additional Sales Icon"
                      width={45}
                      height={45}
                      className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
                    />
                  </div>
                </div>
                <p className="text-white text-xs sm:text-sm text-center">
                  Additional Sales
                </p>
              </div>

              <div className="flex flex-col items-center mt-4 md:mt-6">
                <div className="p-1 sm:p-2 rounded-full bg-transparent border-2 border-cyan-400 mb-2 md:mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center">
                    <Image
                      src="/CostEffectivenessIcon.png"
                      alt="Flexibility Icon"
                      width={45}
                      height={45}
                      className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
                    />
                  </div>
                </div>
                <p className="text-white text-xs sm:text-sm text-center">
                  Flexibility
                </p>
              </div>

              <div className="flex flex-col items-center mt-4 md:mt-6">
                <div className="p-1 sm:p-2 rounded-full bg-transparent border-2 border-blue-500 mb-2 md:mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center">
                    <Image
                      src="/ClientResponsivenessIcon.png"
                      alt="Leading Edge Skills Icon"
                      width={45}
                      height={45}
                      className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
                    />
                  </div>
                </div>
                <p className="text-white text-xs sm:text-sm text-center">
                  Leading Edge Skills
                </p>
              </div>

              <div className="flex flex-col items-center mt-4 md:mt-6">
                <div className="p-1 sm:p-2 rounded-full bg-transparent border-2 border-yellow-400 mb-2 md:mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center">
                    <Image
                      src="/StaffEngagementIcon.png"
                      alt="Increased Productivity Icon"
                      width={45}
                      height={45}
                      className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
                    />
                  </div>
                </div>
                <p className="text-white text-xs sm:text-sm text-center">
                  Increased Productivity
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HcdHeader;
