import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AboutUs = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 text-white">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-70">
        <Image
          src="/LD1.jpg"
          alt="Tree background"
          fill
          className="object-cover"
          quality={100}
          priority
        />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 py-8 sm:py-12 z-10">
        {/* Header */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="bg-gray-800 px-4 sm:px-8 py-2 text-center">
            <h1 className="text-lg sm:text-xl font-semibold tracking-wider">WHO WE ARE</h1>
          </div>
        </div>

        {/* Main description */}
        <div className="max-w-4xl mx-auto mb-10 sm:mb-16">
          <p className="text-sm sm:text-base leading-relaxed">
            Since 1988, LAMID Consulting has accelerated clients' performance
            with transformational results, by creating partnerships that
            customize innovative and sustainable solutions in confidence. Our
            verifiable track performance with the private sector, international
            organizations, and governments have earned us their referrals and a
            lasting leadership position.
          </p>
        </div>

        {/* Three columns section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-16">
          {/* Column 1: Our Values and Approach */}
          <div className="flex flex-col bg-blue-950/30 p-4 rounded-lg">
            <div className="flex items-start mb-4">
              <div className="mr-3 sm:mr-4 shrink-0">
                <Image
                  src="/people-icon.png"
                  alt="People icon"
                  width={50}
                  height={50}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
                />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold mb-1">
                  Our Values and Approach
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed">
                  What we stand for, have defined and shaped our approach to
                  proftering solutions, and what sums up our business ideas,
                  culture, products and services are embedded in our values.
                  They are represented in:
                </p>
              </div>
            </div>
            <div className="mt-auto pl-8 sm:pl-12 md:pl-16">
              <p className="text-xs leading-relaxed text-blue-300">
                Authenticity and simplicity, guided by integrity.
                <br />
                Making decisions based on evidence and objective feedback.
                <br />
                Consistently solving engaging difficult issues to create
                workable solutions.
              </p>
            </div>
          </div>

          {/* Column 2: Our Pledge */}
          <div className="flex flex-col bg-blue-950/30 p-4 rounded-lg">
            <div className="flex items-start mb-4">
              <div className="mr-3 sm:mr-4 shrink-0">
                <Image
                  src="/target-icon.png"
                  alt="Target icon"
                  width={50}
                  height={50}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
                />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold mb-1">Our Pledge</h2>
                <p className="text-xs sm:text-sm leading-relaxed">
                  We go the extra mile always, we value and build longer-term
                  relationships with business, in order to create and grow our
                  customers' value through sustained great customer service and
                  create referrals.
                </p>
              </div>
            </div>
          </div>

          {/* Column 3: Our Approach */}
          <div className="flex flex-col bg-blue-950/30 p-4 rounded-lg">
            <div className="flex items-start mb-4">
              <div className="mr-3 sm:mr-4 shrink-0">
                <Image
                  src="/growth-icon.png"
                  alt="Growth icon"
                  width={50}
                  height={50}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
                />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold mb-1">Our Approach</h2>
                <p className="text-xs sm:text-sm leading-relaxed">
                  A great company can be flourished by its performance
                  (generating enough cash flow through highly profitable
                  operations that combat against competition), management (where
                  competent leadership and planning is always the starting point
                  of all great endeavors.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-10 sm:mb-16">
          <Link href="/achievement">
            <div className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 sm:px-8 rounded-md transition duration-300 text-center text-sm sm:text-base">
              ACHIEVEMENT
            </div>
          </Link>
          <Link href="/management">
            <div className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 sm:px-8 rounded-md transition duration-300 text-center text-sm sm:text-base">
              MANAGEMENT
            </div>
          </Link>
          <Link href="/management">
            <div className="bg-[#C12129] hover:bg-red-800 text-white font-medium py-2 px-6 sm:px-8 rounded-md transition duration-300 text-center text-sm sm:text-base">
            BUSINESS MODEL
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;