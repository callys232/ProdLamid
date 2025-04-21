import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const SustainableDevelopmentSection = () => {
  return (
    <div className="relative w-full bg-black text-white overflow-hidden">
      {/* Background Tree Image */}
      <div className="absolute inset-0 opacity-70">
        <Image
          src="/tree-background.jpg"
          alt="Tree background"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col px-4">
        {/* Header section with content and images */}
        <div className="flex items-center justify-between w-full pt-20 pb-8">
          <div className='flex items-center'>
            {/* Left globe image - smaller size */}
            <div className="w-1/4 max-w-[140px]">
              <Image
                src="/sustainable-icon.png"
                alt="Hands holding small globe"
                width={140}
                height={140}
                className="rounded-md"
              />
            </div>

            {/* Center text content */}
            <div className="text-center mx-4">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                <span className="text-emerald-400">S</span>ustainable
                <span className="text-emerald-400"> D</span>evelopment
              </h1>

              <div className="inline-block border border-emerald-400 rounded-xl px-6 py-2 bg-black/60 backdrop-blur-sm">
                <p className="text-xs md:text-sm">
                  Growing groups to world-class communities with sustainable
                  development
                </p>
              </div>
            </div>
          </div>

          {/* Right globe image - larger size */}
          <div className="w-1/3 max-w-[340px]">
            <Image
              src="/sustainable-icon.png"
              alt="Multiple hands holding globe"
              width={340}
              height={340}
              className="rounded-md"
            />
          </div>
        </div>

        {/* Empty space for the middle area */}
        <div className="flex-grow"></div>

        {/* Bottom message section */}
        <div className="text-center mb-16 max-w-xl mx-auto">
          <p className="text-base md:text-lg mb-4">
            We achieved social inclusion, managed healthcare partnerships,
            gender equality...
          </p>

          <Link
            href="/details"
            className="inline-flex items-center text-xs font-medium text-gray-300 hover:text-white"
          >
            SEE HOW
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-2"
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
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SustainableDevelopmentSection;