// components/BusinessInnovationZone.jsx
import Image from "next/image";
import Link from "next/link";

const BusinessInnovationZone = () => {
  return (
    <div className="bg-black text-white py-6 sm:py-8 md:py-10 px-3 sm:px-4 md:px-8">
      <div className="w-full h-px bg-gray-700 mb-6"></div>
      <div className="max-w-6xl mx-auto">
        {/* BIZ Section with colored letters */}
        <div className="flex flex-col md:flex-row items-center md:items-start mb-4 sm:mb-6">
          {/* BIZ Logo */}
          <div className="border border-blue-500 rounded-md p-2 sm:p-3 md:p-4 mb-4 md:mb-0 md:mr-6 w-full max-w-[180px] md:max-w-[200px]">
            <div className="w-full aspect-square relative flex items-center justify-center">
              <Image
                src="/biz-icon.png"
                alt="BIZ Logo"
                width={150}
                height={150}
                className="object-contain w-full h-full"
              />
            </div>
          </div>

          {/* BIZ Text with colored letters */}
          <div className="flex flex-col justify-center mt-2 sm:mt-3 md:mt-6 w-full">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-center md:text-left">
              <span className="text-blue-500">B</span>usiness{" "}
              <span className="text-blue-500">I</span>nnovation{" "}
              <span className="text-blue-500">Z</span>one
            </h2>

            {/* Blue bordered box with description */}
            <div className="border border-blue-500 rounded-md p-3 sm:p-4 mt-1 sm:mt-2 w-full">
              <p className="text-white text-sm sm:text-base text-center md:text-left">
                The one-stop place that rapidly nurtures and expands startups to
                deliver exceptional value and become world-class organizations
              </p>
            </div>
          </div>
        </div>

        {/* Description text below */}
        <div className="text-center mb-6 sm:mb-8 px-2 sm:px-4">
          <p className="text-sm sm:text-base">
            We help all organizations continuously innovate around the client
            and adapt to the digital age for efficiency and competitiveness.
          </p>
        </div>

        {/* BEST Section */}
        <div className="mt-8 sm:mt-10 md:mt-12">
          {/* BEST Box with colored text */}
          <div className="border border-amber-500 rounded-md p-3 sm:p-4 flex flex-col md:flex-row justify-between items-center mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg md:text-xl text-center md:text-left mb-3 md:mb-0 md:mr-4 md:flex-1">
              <span className="text-amber-500">B</span>usiness{" "}
              <span className="text-amber-500">E</span>xpansion Strategy &
              Technology -<span className="text-amber-500">BEST</span>- our
              all-in-one growth tool box
            </h3>

            {/* BEST Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
              <Image
                src="/best-icon.png"
                alt="BEST Icon"
                width={80}
                height={80}
                className="object-contain w-full h-full"
              />
            </div>
          </div>

          {/* BEST Description */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-center space-y-3 md:space-y-0">
            <p className="text-xs sm:text-sm md:text-base max-w-3xl text-center md:text-left md:pr-4 md:flex-1">
              Our portfolio of simple, easy-to-use entrepreneurial management
              know-how that generates sustainable growth by executing a lean
              plan on digitalized, client-centered systems and processes.
            </p>

            <div className="flex items-center whitespace-nowrap">
              <span className="uppercase text-xs sm:text-sm font-medium mr-2">
                Read More
              </span>
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* picture stuff */}
        <div className="w-full mt-8">
          {/* Full-width responsive image container with preserved content */}
          <div className="w-full relative">
            <Image
              src="/BIT-picture.png"
              alt="Title"
              width={1920}
              height={1080}
              priority
              className="w-full h-auto object-contain"
              sizes="100vw"
            />
          </div>

          {/* Responsive buttons/text sections */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mt-4 px-4">
            <div className="border border-white px-4 py-3 mb-4 md:mb-8 rounded-md hover:bg-gray-900 transition-colors cursor-pointer">
              <h2 className="text-base sm:text-lg md:text-xl text-center md:text-left">
                Build Right! Don't struggle along by costly trial and error.
              </h2>
            </div>

            <div className="border border-white px-4 py-3 mb-8 rounded-md hover:bg-gray-900 transition-colors cursor-pointer">
              <h2 className="text-base sm:text-lg md:text-xl text-center md:text-left">
                Get started - FREE Diagnostics, Limited time only! Click here
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessInnovationZone;
