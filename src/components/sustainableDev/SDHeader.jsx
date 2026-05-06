"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Impact from "@/components/Impact";

const SDHeader = () => {
  const [showImpact, setShowImpact] = useState(false);

  return (
    <>
      <div className="relative min-h-screen bg-black text-white pt-12 md:pt-24">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/LD4sd.png"
            alt="Lush forest background representing sustainability"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-8 flex flex-col min-h-screen">
          {/* Header with logo and title */}
          <div className="flex flex-col sm:flex-row items-center mt-4 sm:mt-8 animate-fadeIn">
            <div className="w-24 h-24 sm:w-32 sm:h-32 mb-4 sm:mb-0 sm:mr-4 relative">
              <Image
                src="/sustainable-icon.png"
                alt="Icon of globe held in hands symbolizing sustainability"
                width={128}
                height={128}
              />
            </div>
            <div className="text-center sm:text-left">
              {/* <h1
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-green-400 via-emerald-500 to-green-700 bg-clip-text animate-colorCycle animate-blurIn [animation-duration:5s] [animation-delay:4s]
 [animation-iteration-count:infinite]"
              >
                Sustainable Development
              </h1> */}
              <h1
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-green-400 via-emerald-500 to-green-700 bg-clip-text
  [animation:colorCycle_5s_linear_infinite,blurIn_5s_ease-in-out_4s_infinite]"
              >
                Sustainable Development
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-gray-300 animate-glitchPulse [animation-delay:3s]text-xs sm:text-sm  text-gray-300 animate-glitchPulse [animation-delay:3s]">
                Growing groups to world-class communities with sustainable
                development
              </p>
            </div>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center my-8 md:my-auto">
            <div className="order-2 lg:order-1">
              <p className="text-white text-sm sm:text-base md:text-lg text-center lg:text-left">
                We achieved social inclusion, managed healthcare partnerships,
                gender equality, youth and women's empowerment with
                digitalization, as crucial means to equity, diversity,
                governance and peace-building in accelerating the Sustainable
                Development Goals.
              </p>

              {/* SEE HOW Button */}
              <div className="flex justify-center lg:justify-start mt-4 sm:mt-6">
                <button
                  onClick={() => setShowImpact((prev) => !prev)}
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-emerald-400 hover:text-white transition-colors duration-200"
                >
                  SEE HOW
                  <motion.svg
                    animate={{ rotate: showImpact ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </button>
              </div>
            </div>

            {/* Earth Image */}
            <div className="flex justify-center lg:justify-end order-1 lg:order-2 mb-6 lg:mb-0">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-lg overflow-hidden">
                <video
                  src="/SdHero.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Bottom spacing */}
          <div className="mb-8 md:mb-16" />
        </div>
      </div>

      {/* Animated Impact dropdown */}
      <AnimatePresence initial={false}>
        {showImpact && (
          <motion.div
            key="sd-impact"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <Impact />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SDHeader;
