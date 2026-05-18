"use client";

import React, { useState } from "react";
import Link from "next/link";
import Head from "next/head";

function ExpandableText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="text-sm leading-relaxed text-white">
      <p
        className={`${expanded ? "" : "line-clamp-3"
          } transition-all duration-300 ease-in-out`}
      >
        {text}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-yellow-400 hover:underline mt-2 font-medium"
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
}

const VMO = () => {
  return (
    <div className="bg-black text-white">
      <Head>
        <title>LAMID - Values and Mission</title>
        <meta name="description" content="LAMID company values and mission" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Values Section */}
          <Link href="/portfolio">
            <div className="flex flex-col bg-black border border-gray-800 rounded-lg p-6 transition-all duration-300 hover:border-green-500 hover:scale-105 hover:shadow-lg cursor-pointer space-y-4">
              <div className="text-center">
                <div className="bg-green-600 text-white font-bold py-2 px-4 rounded-md inline-block hover:bg-green-500 transition duration-300">
                  VISION
                </div>
              </div>
              <ExpandableText text="To build Africa’s most trusted digital ecosystem for enterprise performance, talent acceleration, and seamless work." />
            </div>
          </Link>

          {/* Mission Section */}
          <Link href="/portfolio">
            <div className="flex flex-col bg-black border border-gray-800 rounded-lg p-6 transition-all duration-300 hover:border-blue-500 hover:scale-105 hover:shadow-lg cursor-pointer space-y-4">
              <div className="text-center">
                <div className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md inline-block hover:bg-blue-500 transition duration-300">
                  MISSION
                </div>
              </div>
              <ExpandableText text="To empower businesses and experts with the systems, tools, and intelligence they need to grow sustainably and transform meaningfully." />
            </div>
          </Link>

          {/* Our Approach Section */}
          <Link href="/portfolio">
            <div className="flex flex-col bg-black border border-gray-800 rounded-lg p-6 transition-all duration-300 hover:border-orange-500 hover:scale-105 hover:shadow-lg cursor-pointer space-y-4">
              <div className="text-center">
                <div className="bg-orange-500 text-white font-bold py-2 px-4 rounded-md inline-block hover:bg-orange-400 transition duration-300">
                  OUR APPROACH
                </div>
              </div>
              <ExpandableText text="A great company is measured by its profitable operations and strong leadership. Strategic planning is the foundation of all successful endeavors." />
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default VMO;
