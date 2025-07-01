import React from "react";
import Image from "next/image";
import Link from "next/link";

const SustainableDevelopmentSection = () => {
  return (
    <div className="relative w-full bg-black text-white overflow-hidden">
      {/* Floating Leaf Particles */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => {
          const randomLeft = Math.random() * 100;
          const randomTop = Math.random() * 100;
          const delay = `${i * 0.3}s`;
          const duration = `${4 + Math.random() * 4}s`;
          return (
            <span
              key={i}
              className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 opacity-20 animate-float"
              style={{
                left: `${randomLeft}%`,
                top: `${randomTop}%`,
                animationDelay: delay,
                animationDuration: duration,
              }}
            />
          );
        })}
      </div>

      {/* Background Tree Image */}
      <div className="absolute inset-0 opacity-70">
        <Image
          src="/tree-background.jpg"
          alt="Tree background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col px-4">
        {/* Header section with content and images */}
        <div className="flex items-center justify-between w-full pt-20 pb-8">
          <div className="flex items-center">
            {/* Left globe image - smaller size */}
            <div className="w-1/4 max-w-[140px] transform hover:scale-105 transition duration-300">
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
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center group">
                <span className="text-white">
                  <span className="animate-pulse">S</span>
                  <span className="text-emerald-400">ustainable </span>
                  <span className="group-hover:text-white transition-colors duration-500 text-emerald-400">
                    Development
                  </span>
                </span>
              </h1>

              <div className="inline-block border border-emerald-400 rounded-xl px-6 py-2 bg-black/60 backdrop-blur-sm hover:bg-emerald-500 hover:text-black transition duration-300">
                <p className="text-xs md:text-sm">
                  Growing groups to world-class communities with sustainable
                  development
                </p>
              </div>
            </div>
          </div>

          {/* Right globe image - larger size */}
          <div className="w-1/3 max-w-[340px] transform hover:scale-105 transition duration-300">
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
            className="inline-flex items-center text-xs font-medium text-gray-300 hover:text-white transition duration-300"
          >
            SEE HOW
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-2 transform hover:scale-110 transition duration-300"
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
