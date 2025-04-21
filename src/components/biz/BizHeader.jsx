"use client";

import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";

const BizHeader = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
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

      {/* Main content */}
      <main className="flex-grow relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/90 z-10"></div>

        {/* Background image */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/LD3.jpg"
            alt="Dark business background"
            layout="fill"
            objectFit="cover"
            priority
            className="opacity-50"
          />
        </div>

        <div className="relative z-20 container mx-auto px-4 py-10 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8 h-full">
          {/* Left side - Logo */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-start">
            <div className="relative w-64 h-64">
              <Image
                src="/BIZ_LOGOS.png"
                alt="BIZ Logo"
                layout="fill"
                objectFit="contain"
                className={`transition-opacity duration-1000 ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="w-full md:w-2/3 flex flex-col items-center md:items-start space-y-6">
            {/* BIZ Heading with colored letters */}
            <div className="bg-black/60 border border-red-800 rounded-md p-4 w-full max-w-lg text-center">
              <h1 className="text-3xl md:text-4xl font-bold">
                <span className="text-blue-500">B</span>usiness
                <span className="text-blue-500"> I</span>nnovation
                <span className="text-blue-500"> Z</span>one
              </h1>
            </div>

            {/* Main description */}
            <p className="text-lg md:text-xl text-center md:text-left max-w-2xl">
              The one-stop place that rapidly nurtures and expands startups to
              deliver exceptional value and become world-class organizations
            </p>

            {/* Secondary description */}
            <p className="text-base md:text-lg text-center md:text-left max-w-2xl">
              The BIZ suite of services empowers organizations to attract a
              continuous stream of clients and excel as best practices, thriving
              on a culture of innovation, management and sustainability.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BizHeader;
