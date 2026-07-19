"use client";

import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Typewriter } from "react-simple-typewriter";

const BizHeader = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <Head>
        <title>Lamid Consulting - Business Innovation Zone</title>
        <meta
          name="description"
          content="The one-stop place that rapidly nurtures and expands startups"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-grow relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/90 z-10" />

        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/LD3.jpg"
            alt="Dark business background"
            layout="fill"
            objectFit="cover"
            priority
            className="opacity-50 transition-opacity duration-700"
          />
        </div>

        <div className="relative z-20 container mx-auto px-4 py-10 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8 h-full">
          {/* Left - Logo */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-start">
            <div className="relative w-64 h-64 transform transition duration-700 ease-in-out hover:scale-105">
              <Image
                src="/BIZ_LOGOS.png"
                alt="BIZ Logo"
                layout="fill"
                objectFit="contain"
                className={`transition-opacity duration-1000 ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          </div>

          {/* Right - Text */}
          <div className="w-full md:w-2/3 flex flex-col items-center md:items-start space-y-6">
            <div className="bg-black/60 border border-blue-800 rounded-md p-4 w-full max-w-lg text-center hover:bg-blue-900 transition duration-300">
              <div
                className={`transition-opacity duration-1000 delay-300 ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                <h1
                  className="
    text-3xl md:text-4xl
    font-bold text-blue-500
    border-r-2 border-white
    whitespace-normal md:whitespace-nowrap   /* ✅ allow wrapping on small, prevent on md+ */
    overflow-hidden max-w-full
  "
                >
                  <Typewriter
                    words={["Business Innovation Zone"]}
                    loop={Infinity}
                    typeSpeed={60}
                    deleteSpeed={30}
                    delaySpeed={1800}
                    cursor
                    cursorStyle="|"
                  />
                </h1>
              </div>
            </div>

            <p className="text-lg md:text-xl text-center md:text-left max-w-2xl hover:text-gray-300 transition duration-300 font-semibold">
              Clarity at the Speed of Decision.
            </p>

            <p className="text-base md:text-lg text-center md:text-left max-w-2xl hover:text-gray-400 transition duration-300">
              Tools, diagnostics, and guidance powered by trusted expertise and advanced AI. Designed for SMEs, startups, and entrepreneurs who need clarity, structure, and momentum.
            </p>
            <p className="text-sm md:text-base text-center md:text-left max-w-2xl text-gray-400">
              We reveal uncommon opportunities and grow organizations to dominate their competition — through Management Solutions, Innovation Consulting, Strategy, Process Improvement, and digital transformation.
            </p>

            {/* Read More Section
            <div className="text-base md:text-lg text-center md:text-left max-w-2xl transition duration-300">
              {showMore ? (
                <p className="transition-all duration-500 ease-in-out hover:text-blue-600">
                  We avert crisis and rescue distressed organizations by
                  diagnosing health challenges and restoring operational
                  vitality through sustainable transformation programs that
                  align people, processes, and performance.
                </p>
              ) : (
                <p className="transition-all duration-500 ease-in-out hover:text-blue-600">
                  We avert crisis and rescue distressed organizations by
                  diagnosing health challenges and
                </p>
              )}
              <button
                onClick={() => setShowMore(!showMore)}
                className="mt-1 text-sm text-blue-500 hover:text-blue-800 transition"
              >
                {showMore ? "Read Less" : "Read More"}
              </button>
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BizHeader;
