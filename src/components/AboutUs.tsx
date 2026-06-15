"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Eye, Target, Layers, Handshake } from "lucide-react";
import EcosystemTag from "./EcosystemTag";

const AboutUs = ({ showArrow = true }: { showArrow?: boolean }) => {
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
        <div className="relative container mx-auto px-4 sm:px-6 py-8 z-10">
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
            className="max-w-4xl mx-auto mb-8 sm:mb-12 text-center p-5 rounded-lg transition-all duration-300
            hover:border hover:border-blue-500 hover:text-blue-300 hover:scale-105 hover:shadow-lg"
          >
            <p className="text-base sm:text-lg leading-relaxed">
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-8 sm:mb-12"
            >
              {/* Column 1 — Vision */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link href="/portfolio">
                  <div
                    className="flex flex-col bg-blue-950/40 p-8 rounded-lg shadow-lg transition-all duration-300
                    hover:border hover:border-blue-500 hover:text-blue-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 cursor-pointer space-y-4"
                  >
                    <div className="flex items-start">
                      <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center mr-4 bg-blue-500/15 border border-blue-500/25">
                        <Eye className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-blue-400 mb-2">
                          Our Vision
                        </h2>
                        <p className="text-sm leading-relaxed text-white">Our principles define how we solve challenges and innovate sustainable solutions. We stand for:</p>
                        {showArrow && (
                          <motion.div whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 400, damping: 18 }} className="mt-3 inline-flex">
                            <ArrowRight className="h-5 w-5 text-blue-400" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Column 2 — Mission */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link href="/portfolio">
                  <div
                    className="flex flex-col bg-blue-950/40 p-8 rounded-lg shadow-lg transition-all duration-300
                    hover:border hover:border-rose-500 hover:text-rose-300 hover:scale-105 hover:shadow-xl hover:shadow-rose-500/20 cursor-pointer space-y-4"
                  >
                    <div className="flex items-start">
                      <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center mr-4 bg-rose-500/15 border border-rose-500/25">
                        <Target className="h-6 w-6 text-rose-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-rose-400 mb-2">
                          Our Mission
                        </h2>
                        <p className="text-sm leading-relaxed text-white">To empower businesses and experts with the systems, tools, and intelligence they need to grow sustainably and transform meaningfully.</p>
                        {showArrow && (
                          <motion.div whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 400, damping: 18 }} className="mt-3 inline-flex">
                            <ArrowRight className="h-5 w-5 text-rose-400" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Column 3 — Approach */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link href="/portfolio">
                  <div
                    className="flex flex-col bg-blue-950/40 p-8 rounded-lg shadow-lg transition-all duration-300
                    hover:border hover:border-emerald-500 hover:text-emerald-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/20 cursor-pointer space-y-4"
                  >
                    <div className="flex items-start">
                      <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center mr-4 bg-emerald-500/15 border border-emerald-500/25">
                        <Layers className="h-6 w-6 text-emerald-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-emerald-400 mb-2">
                          Our Approach
                        </h2>
                        <p className="text-sm leading-relaxed text-white">Sustainable success relies on performance and leadership. We prioritize highly profitable operations, strategic management, and visionary leadership to achieve lasting impact.</p>
                        {showArrow && (
                          <motion.div whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 400, damping: 18 }} className="mt-3 inline-flex">
                            <ArrowRight className="h-5 w-5 text-emerald-400" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Column 4 — Pledge */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link href="/portfolio">
                  <div
                    className="flex flex-col bg-blue-950/40 p-8 rounded-lg shadow-lg transition-all duration-300
                    hover:border hover:border-orange-500 hover:text-orange-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20 cursor-pointer space-y-4"
                  >
                    <div className="flex items-start">
                      <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center mr-4 bg-orange-500/15 border border-orange-500/25">
                        <Handshake className="h-6 w-6 text-orange-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-orange-400 mb-2">
                          Our Pledge
                        </h2>
                        <p className="text-sm leading-relaxed text-white">We go the extra mile to build long-term relationships, ensuring lasting value for our clients through exceptional customer service and continued referrals.</p>
                        {showArrow && (
                          <motion.div whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 400, damping: 18 }} className="mt-3 inline-flex">
                            <ArrowRight className="h-5 w-5 text-orange-400" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
            <EcosystemTag />
          </section>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
