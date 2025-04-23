import React from "react";
import Image from "next/image";

const BizBestSection = () => {
  return (
    <section className="bg-black text-white py-12 px-4 md:px-8">
      {/* Header with BEST title and logo */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12">
        <div className="w-32 h-32 relative flex-shrink-0 transform hover:scale-105 transition duration-300">
          <Image
            src="/best-icon.png"
            alt="BEST Logo"
            width={128}
            height={128}
            objectFit="contain"
          />
        </div>

        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 hover:text-gray-300 transition duration-300">
            <span className="text-red-500">B</span>usiness
            <span className="text-yellow-500"> E</span>xpansion
            <span className="text-orange-500"> S</span>trategy
            <span> and </span>
            <span className="text-green-500">T</span>echnology
            <span className="text-gray-400">
              {" "}
              -BEST - Our all-in-one Growth Tool Box
            </span>
          </h2>

          <p className="text-base text-gray-300 hover:text-white transition duration-300">
            BEST is part of our BIZ suite which constructs the bridge that
            connects your idea and dream to the global market. Our portfolio of
            proven, custom-built, simple, easy-to-use advisory and tools. BEST
            executes a lean plan around client-centered, nimble, cost-effective
            and digitalized systems, structures and processes, focusing on
            continuous innovation that delivers rapid and sustainable growth.
          </p>
        </div>
      </div>

      {/* Four-column feature section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Column 1 - Innovate */}
        <div className="flex flex-col items-center md:items-start hover:scale-105 transition duration-300">
          <div className="bg-gray-900 rounded-lg p-4 mb-4 w-32 h-32 flex items-center justify-center">
            <Image
              src="/biz-lightbulb.png"
              alt="Innovate"
              width={80}
              height={80}
              objectFit="contain"
            />
          </div>
          <h3 className="text-xl font-semibold mt-2">
            Innovate, Build and Grow.
          </h3>
        </div>

        {/* Column 2 - Globally accessible */}
        <div className="flex flex-col hover:scale-105 transition duration-300">
          <h3 className="text-xl font-semibold mb-4 hover:text-gray-300 transition duration-300">
            Become globally accessible
          </h3>
          <div className="flex justify-center mb-4">
            <div className="relative w-32 h-32">
              <Image
                src="/biz-businessman-icon.png"
                alt="Global Access"
                width={128}
                height={128}
                objectFit="contain"
              />
            </div>
          </div>
        </div>

        {/* Column 3 - Dominate the market */}
        <div className="flex flex-col hover:scale-105 transition duration-300">
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4 hover:text-gray-300 transition duration-300">
              Dominate the market as you build capacity and trust with venture
              capitalists and clients
            </h3>
            <div className="relative w-32 h-32 mt-2">
              <Image
                src="/biz-buildings.png"
                alt="Market Domination"
                width={128}
                height={128}
                objectFit="contain"
              />
            </div>
          </div>
        </div>

        {/* Column 4 - Crisis management */}
        <div className="flex flex-col hover:scale-105 transition duration-300">
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4 hover:text-gray-300 transition duration-300">
              We avert crisis and rescue distressed organizations by diagnosing
              health challenges and ...
            </h3>
            <div className="relative w-32 h-32 mt-2">
              <Image
                src="/biz-running-figure.png"
                alt="Crisis Management"
                width={128}
                height={128}
                objectFit="contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BizBestSection;
