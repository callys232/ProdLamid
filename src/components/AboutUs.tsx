"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

function ExpandableText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="text-sm leading-relaxed text-white">
      <p className={expanded ? "" : "line-clamp-3"}>{text}</p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-yellow-400 hover:underline mt-2 font-medium"
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
}

const AboutUs = () => {
  return (
    <div className="relative bg-gradient-to-b from-blue-950 to-blue-900 text-white overflow-hidden">
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

      {/* Vision 2030 Section */}
      <section id="vision-2030">
        <div className="relative container mx-auto px-4 sm:px-6 py-6 sm:py-8 z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center mb-6"
          >
            <div
              className="bg-gray-800 px-6 py-3 text-center rounded-md transition-all duration-300 
              hover:border hover:border-blue-500 hover:text-blue-300 hover:scale-105 hover:shadow-lg"
            >
              <h1 className="text-lg sm:text-xl font-semibold tracking-wide uppercase">
                Who We Are
              </h1>
            </div>
          </motion.div>

          {/* Main description */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-6 sm:mb-10 text-center p-5 rounded-lg transition-all duration-300 
            hover:border hover:border-blue-500 hover:text-blue-300 hover:scale-105 hover:shadow-lg"
          >
            <p className="text-sm sm:text-base leading-relaxed">
              Since 1988, LAMID Consulting has accelerated clients performance
              with transformational results by fostering partnerships that
              customize innovative and sustainable solutions. Our{" "}
              <strong>verifiable track record</strong> in working with the
              private sector, international organizations, and governments has
              earned us strong referrals and lasting leadership.
            </p>
          </motion.div>

          {/* Lamid Tech Section */}
          <section id="lamid-tech">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.2,
                  },
                },
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-10"
            >
              {/* Column 1 */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link href="/portfolio">
                  <div
                    className="flex flex-col bg-blue-950/40 p-6 rounded-lg shadow-lg transition-all duration-300 
                    hover:border hover:border-blue-500 hover:text-blue-300 hover:scale-105 hover:shadow-xl cursor-pointer space-y-3"
                  >
                    <div className="flex items-start">
                      <Image
                        src="/people-icon.png"
                        alt="Team collaboration icon"
                        width={50}
                        height={50}
                        className="w-12 h-12 md:w-14 md:h-14 mr-4"
                      />
                      <div>
                        <h2 className="text-lg font-semibold text-blue-400 mb-1">
                          Our Values & Approach
                        </h2>
                        <ExpandableText text="Our principles define how we solve challenges and innovate sustainable solutions. We stand for:" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Column 2 */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link href="/portfolio">
                  <div
                    className="flex flex-col bg-blue-950/40 p-6 rounded-lg shadow-lg transition-all duration-300 
                    hover:border hover:border-blue-500 hover:text-blue-300 hover:scale-105 hover:shadow-xl cursor-pointer space-y-3"
                  >
                    <div className="flex items-start">
                      <Image
                        src="/target-icon.png"
                        alt="Target icon for commitment"
                        width={50}
                        height={50}
                        className="w-12 h-12 md:w-14 md:h-14 mr-4"
                      />
                      <div>
                        <h2 className="text-lg font-semibold text-blue-400 mb-1">
                          Our Pledge
                        </h2>
                        <ExpandableText text="We go the extra mile to build long-term relationships, ensuring lasting value for our clients through exceptional customer service and continued referrals." />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Column 3 */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link href="/portfolio">
                  <div
                    className="flex flex-col bg-blue-950/40 p-6 rounded-lg shadow-lg transition-all duration-300 
                    hover:border hover:border-blue-500 hover:text-blue-300 hover:scale-105 hover:shadow-xl cursor-pointer space-y-3"
                  >
                    <div className="flex items-start">
                      <Image
                        src="/growth-icon.png"
                        alt="Growth strategy icon"
                        width={50}
                        height={50}
                        className="w-12 h-12 md:w-14 md:h-14 mr-4"
                      />
                      <div>
                        <h2 className="text-lg font-semibold text-blue-400 mb-1">
                          Our Approach
                        </h2>
                        <ExpandableText text="Sustainable success relies on performance and leadership. We prioritize highly profitable operations, strategic management, and visionary leadership to achieve lasting impact." />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
