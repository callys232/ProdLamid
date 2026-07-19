"use client";

import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";

const Header = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-black">
      {/* Background with overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/LD2.jpg"
          alt="Background audience"
          fill
          style={{ objectFit: "cover" }}
          priority
          className="opacity-60"
        />
      </div>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-center max-w-6xl w-full mx-auto gap-6 md:gap-8 lg:gap-16">
          {/* Light bulb image in dark container */}
          <div className="relative w-full max-w-xs sm:max-w-sm md:w-2/5 mb-6 md:mb-0">
            <div className="p-2 sm:p-4 md:p-8 flex items-center justify-center">
              {mounted && (
                <Image
                  src="/bizp-lightbulb.png"
                  alt="Light bulb"
                  width={180}
                  height={180}
                  sizes="(max-width: 640px) 150px, (max-width: 768px) 180px, 250px"
                  priority
                  className="glow-circle transition-transform duration-300 ease-in-out hover:scale-110 hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]"
                />
              )}
            </div>
          </div>

          {/* Text content */}

          <div className="text-center md:text-left w-full md:w-3/5">
            <h1
              id="BIZpROTOYPES-heading"
              className="text-6xl md:text-8xl font-bold tracking-wider space-y-2"
            >
              {["ADVICE", "INNOVATION", "FUNDING"].map((word, i) => (
                <span
                  key={word}
                  className={`block pop-item animate-colorCycle drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`}
                  style={{ animationDelay: `${i * 0.5}s` }}
                >
                  {word}
                </span>
              ))}
            </h1>
          </div>
        </div>

        {/* Red paragraph (now inside main with proper spacing) */}
        <section
          className="w-full mt-4 sm:mt-6 md:mt-8 lg:mt-12"
          aria-label="Client Transformations"
        >
          <div className="w-full flex justify-center mb-4">
            <div className="w-16 h-1 bg-[#2563EB] rounded-full animate-slide-horizontal" />
          </div>
          <header>
            <h2 className="text-center text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#f87171] text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mx-auto max-w-4xl px-4">
              You do not have to re-invent the wheel, see our proven successful
              transformations.
            </h2>
          </header>
        </section>
      </main>
      {/* Custom styles */}
      <style jsx>{`
        @keyframes colorCycle {
          0% {
            color: #761917ff;
          }
          25% {
            color: #083b5eff;
          }
          50% {
            color: #22c55e;
          }
          75% {
            color: #3b82f6;
          }
          100% {
            color: #ffffff;
          }
        }

        .animate-colorCycle {
          animation: colorCycle 6s infinite ease-in-out;
        }

        .pop-item {
          transition: transform 0.3s ease, text-shadow 0.3s ease;
        }

        .pop-item:hover {
          transform: scale(1.05);
          text-shadow: 0 0 12px rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
};

export default Header;
