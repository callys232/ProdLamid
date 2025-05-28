import React from "react";
import Link from "next/link";

const VMO = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div>
        <title>LAMID - Values and Mission</title>
        <meta name="description" content="LAMID company values and mission" />
        <link rel="icon" href="/favicon.ico" />
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Values Section */}
          <Link href="/values">
            <div
              className="bg-black border border-gray-800 rounded-lg p-6 hover:border-green-500 transition duration-300 
            hover:scale-105 cursor-pointer"
            >
              <div className="text-center mb-4">
                <div className="bg-green-600 text-white font-bold py-2 px-4 rounded-md inline-block hover:bg-green-500 transition duration-300">
                  VALUES
                </div>
              </div>
              <div className="text-sm">
                <p className="hover:text-green-300 transition duration-300">
                  LAMID has identified its core values, shaping our approach to
                  proffering solutions. Our ideals, culture, products, and
                  services are embedded in these values.
                </p>
              </div>
            </div>
          </Link>

          {/* Mission Section */}
          <Link href="/mission">
            <div
              className="bg-black border border-gray-800 rounded-lg p-6 hover:border-blue-500 transition duration-300 
            hover:scale-105 cursor-pointer"
            >
              <div className="text-center mb-4">
                <div className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md inline-block hover:bg-blue-500 transition duration-300">
                  MISSION
                </div>
              </div>
              <div className="text-sm">
                <p className="hover:text-blue-300 transition duration-300">
                  We improve your performance and achieve massive results by
                  providing a million-dollar value with an A+ effort, so you pay
                  less for more!
                </p>
              </div>
            </div>
          </Link>

          {/* Our Approach Section */}
          <Link href="/approach">
            <div
              className="bg-black border border-gray-800 rounded-lg p-6 hover:border-orange-500 transition duration-300 
            hover:scale-105 cursor-pointer"
            >
              <div className="text-center mb-4">
                <div className="bg-orange-500 text-white font-bold py-2 px-4 rounded-md inline-block hover:bg-orange-400 transition duration-300">
                  OUR APPROACH
                </div>
              </div>
              <div className="text-sm">
                <p className="hover:text-orange-300 transition duration-300">
                  A great company is measured by its profitable operations and
                  strong leadership. Strategic planning is the foundation of all
                  successful endeavors.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default VMO;
