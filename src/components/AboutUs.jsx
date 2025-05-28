import React from "react";
import Image from "next/image";
import Link from "next/link";

const AboutUs = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 text-white">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-70">
        <Image
          src="/LD1.jpg"
          alt="Tree background representing stability and growth"
          fill
          className="object-cover"
          quality={100}
          priority
        />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 py-8 sm:py-12 z-10">
        {/* Header */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div
            className="bg-gray-800 px-6 py-3 text-center rounded-md transition-all duration-300 
          hover:border hover:border-blue-500 hover:text-blue-300 hover:scale-105 hover:shadow-lg"
          >
            <h1 className="text-lg sm:text-xl font-semibold tracking-wide uppercase">
              Who We Are
            </h1>
          </div>
        </div>

        {/* Main description */}
        <div
          className="max-w-4xl mx-auto mb-10 sm:mb-16 text-center p-5 rounded-lg transition-all duration-300 
        hover:border hover:border-blue-500 hover:text-blue-300 hover:scale-105 hover:shadow-lg"
        >
          <p className="text-sm sm:text-base leading-relaxed">
            Since 1988, LAMID Consulting has accelerated clients' performance
            with transformational results by fostering partnerships that
            customize innovative and sustainable solutions. Our **verifiable
            track record** in working with the private sector, international
            organizations, and governments has earned us strong referrals and
            lasting leadership.
          </p>
        </div>

        {/* Three columns section with links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-16">
          {/* Column 1: Our Values and Approach */}
          <Link href="/values-approach">
            <div
              className="flex flex-col bg-blue-950/40 p-5 rounded-lg shadow-lg transition-all duration-300 
            hover:border hover:border-blue-500 hover:text-blue-300 hover:scale-105 hover:shadow-lg cursor-pointer"
            >
              <div className="flex items-start mb-4">
                <div className="mr-4 shrink-0">
                  <Image
                    src="/people-icon.png"
                    alt="Team collaboration icon"
                    width={50}
                    height={50}
                    className="w-12 h-12 md:w-14 md:h-14"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-1">
                    Our Values & Approach
                  </h2>
                  <p className="text-sm leading-relaxed">
                    Our principles define how we solve challenges and innovate
                    sustainable solutions. We stand for:
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Column 2: Our Pledge */}
          <Link href="/our-pledge">
            <div
              className="flex flex-col bg-blue-950/40 p-5 rounded-lg shadow-lg transition-all duration-300 
            hover:border hover:border-blue-500 hover:text-blue-300 hover:scale-105 hover:shadow-lg cursor-pointer"
            >
              <div className="flex items-start mb-4">
                <div className="mr-4 shrink-0">
                  <Image
                    src="/target-icon.png"
                    alt="Target icon for commitment"
                    width={50}
                    height={50}
                    className="w-12 h-12 md:w-14 md:h-14"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-1">Our Pledge</h2>
                  <p className="text-sm leading-relaxed">
                    We go the extra mile to build long-term relationships,
                    ensuring lasting value for our clients through **exceptional
                    customer service** and **continued referrals**.
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Column 3: Our Approach */}
          <Link href="/our-approach">
            <div
              className="flex flex-col bg-blue-950/40 p-5 rounded-lg shadow-lg transition-all duration-300 
            hover:border hover:border-blue-500 hover:text-blue-300 hover:scale-105 hover:shadow-lg cursor-pointer"
            >
              <div className="flex items-start mb-4">
                <div className="mr-4 shrink-0">
                  <Image
                    src="/growth-icon.png"
                    alt="Growth strategy icon"
                    width={50}
                    height={50}
                    className="w-12 h-12 md:w-14 md:h-14"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-1">Our Approach</h2>
                  <p className="text-sm leading-relaxed">
                    Sustainable success relies on **performance and
                    leadership**. We prioritize **highly profitable
                    operations**, **strategic management**, and **visionary
                    leadership** to achieve lasting impact.
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
