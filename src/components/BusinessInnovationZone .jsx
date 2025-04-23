import Image from "next/image";
import Link from "next/link";

const BusinessInnovationZone = () => {
  return (
    <div className="bg-black text-white py-6 sm:py-8 md:py-10 px-3 sm:px-4 md:px-8">
      <div className="w-full h-px bg-gray-700 mb-6"></div>
      <div className="max-w-6xl mx-auto">
        {/* BIZ Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start mb-6 sm:mb-8">
          {/* BIZ Logo */}
          <div className="border border-blue-500 rounded-md p-4 md:mr-6 max-w-[200px] transform hover:scale-105 transition duration-300">
            <Image
              src="/biz-icon.png"
              alt="BIZ Logo"
              width={150}
              height={150}
              className="object-contain"
            />
          </div>

          {/* BIZ Text */}
          <div className="flex flex-col justify-center mt-2 w-full">
            <h2 className="text-3xl font-bold text-center md:text-left transition-all duration-300 hover:text-blue-300">
              <span className="text-blue-500 hover:text-blue-300">B</span>
              usiness{" "}
              <span className="text-blue-500 hover:text-blue-300">I</span>
              nnovation{" "}
              <span className="text-blue-500 hover:text-blue-300">Z</span>one
            </h2>
            <div className="border border-blue-500 rounded-md p-4 mt-2 transform hover:scale-105 transition duration-300">
              <p className="text-white text-center md:text-left">
                The one-stop place that rapidly nurtures and expands startups to
                deliver exceptional value.
              </p>
            </div>
          </div>
        </div>

        {/* BEST Section with Hover & Animation */}
        <div className="mt-8 sm:mt-10 md:mt-12">
          <div className="border border-amber-500 rounded-md p-4 flex flex-col md:flex-row justify-between items-center mb-4 hover:bg-amber-800 transition duration-300">
            <h3 className="text-xl text-center md:text-left mb-3 md:mb-0 transform hover:scale-105 transition duration-300">
              <span className="text-red-500 hover:text-red-700">B</span>usiness{" "}
              <span className="text-green-500 hover:text-green-700">E</span>
              xpansion{" "}
              <span className="text-blue-500 hover:text-blue-700">S</span>
              trategy & Technology -{" "}
              <span className="text-amber-500 hover:text-amber-700">
                BEST
              </span>{" "}
              - our all-in-one growth toolbox
            </h3>

            {/* BEST Icon */}
            <div className="w-16 h-16 sm:w-20 md:w-24 transform hover:scale-110 transition duration-300">
              <Image
                src="/best-icon.png"
                alt="BEST Icon"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          </div>
          {/* Added Paragraph */}
          <p className="text-sm md:text-base text-center md:text-left mt-4 px-2 md:px-4">
            Our portfolio of simple, easy-to- use entrepreneurial management
            know-how delivers sustainable growth by executing a lean plan on
            digitalized, client-centered systems and processes.{" "}
          </p>
        </div>

        {/* Buttons & Image Section */}
        <div className="mt-8">
          <div className="w-full relative">
            <Image
              src="/BIT-picture.png"
              alt="Innovation Zone"
              width={1920}
              height={1080}
              priority
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Interactive Buttons */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mt-4 px-4">
            <button className="border border-white px-6 py-3 rounded-md bg-transparent hover:bg-gray-900 text-white font-medium text-lg transform hover:scale-105 transition duration-300">
              Build Right! Avoid costly trial and error.
            </button>

            <button className="border border-white px-6 py-3 rounded-md bg-transparent hover:bg-red-700 text-white font-medium text-lg transform hover:scale-105 transition duration-300">
              Get started - FREE Diagnostics, Limited time only!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessInnovationZone;
