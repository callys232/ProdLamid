"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Eye, Target, Layers, Handshake } from "lucide-react";
import EcosystemTag from "./EcosystemTag";

const VALUE_BULLETS = [
  { text: "Authenticity & simplicity, guided by integrity", colorCls: "text-cyan-400" },
  { text: "Making decisions based on evidence and objective feedback", colorCls: "text-violet-400" },
  { text: "Consistently solving difficult issues to unravel variable solutions", colorCls: "text-emerald-400" },
];

const AboutUs = ({ showArrow = true }: { showArrow?: boolean }) => {
  const [valuesOpen, setValuesOpen] = useState(false);

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
                          Vision 2030
                        </h2>
                        <p className="text-sm leading-relaxed text-white">
                          To produce 5000+ startups to deliver exceptional value
                          and dominate the global market.
                        </p>
                        {showArrow && (
                          <motion.div
                            whileHover={{ x: 6 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 18,
                            }}
                            className="mt-3 inline-flex"
                          >
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
                        <p className="text-sm leading-relaxed text-white">
                          Give businesses and experts the systems, tools, and
                          intelligence to grow without breaking what already
                          works.
                        </p>
                        {showArrow && (
                          <motion.div
                            whileHover={{ x: 6 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 18,
                            }}
                            className="mt-3 inline-flex"
                          >
                            <ArrowRight className="h-5 w-5 text-rose-400" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Column 3 — Values (Flip Card) */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                {/* Perspective wrapper */}
                <div className="[perspective:1000px]">
                  <motion.div
                    animate={{ rotateY: valuesOpen ? 180 : 0 }}
                    transition={{ duration: 0.55, ease: [0.33, 1, 0.68, 1] }}
                    className="relative w-full [transform-style:preserve-3d]"
                  >
                    {/* ── FRONT FACE ── */}
                    <div className="[backface-visibility:hidden]">
                      <Link href="/portfolio">
                        <div className="flex flex-col bg-blue-950/40 p-8 rounded-lg shadow-lg transition-all duration-300 hover:border hover:border-emerald-500 hover:text-emerald-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/20 cursor-pointer space-y-4">
                          <div className="flex items-start">
                            <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center mr-4 bg-emerald-500/15 border border-emerald-500/25">
                              <Layers className="h-6 w-6 text-emerald-400" />
                            </div>
                            <div className="flex-1">
                              <h2 className="text-xl font-semibold text-emerald-400 mb-2">
                                Our Values and Approach
                              </h2>
                              <p className="text-sm leading-relaxed text-white">
                                What we stand for, have defined and shaped our
                                approach to proffering solutions, and what sums
                                up our business ideas, culture, products and
                                services are embedded in our values. They are
                                represented in
                              </p>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setValuesOpen(true);
                                }}
                                className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                              >
                                <motion.span
                                  animate={{ rotate: valuesOpen ? 90 : 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="text-xs leading-none"
                                >
                                  ▶
                                </motion.span>
                                Read more
                              </button>
                              {showArrow && (
                                <motion.div
                                  whileHover={{ x: 6 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                                  className="mt-3 inline-flex"
                                >
                                  <ArrowRight className="h-5 w-5 text-emerald-400" />
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* ── BACK FACE ── */}
                    <div className="[backface-visibility:hidden] [transform:rotateY(180deg)] absolute inset-0">
                      <div className="flex flex-col h-full bg-blue-950/60 border border-emerald-500/30 p-8 rounded-lg shadow-lg space-y-4">
                        <h2 className="text-xl font-semibold text-emerald-400">
                          Our Values
                        </h2>

                        <div className="flex-1 flex flex-col justify-center gap-4">
                          {VALUE_BULLETS.map((b, i) => (
                            <motion.div
                              key={b.text}
                              initial={{ opacity: 0, x: -18 }}
                              animate={
                                valuesOpen
                                  ? { opacity: 1, x: 0 }
                                  : { opacity: 0, x: -18 }
                              }
                              transition={{
                                delay: valuesOpen ? 0.4 + i * 0.13 : 0,
                                duration: 0.38,
                                ease: "easeOut",
                              }}
                              className="flex items-start gap-3"
                            >
                              <span
                                className={`text-lg leading-none mt-0.5 shrink-0 ${b.colorCls}`}
                              >
                                ◈
                              </span>
                              <p
                                className={`text-sm leading-relaxed font-medium ${b.colorCls}`}
                              >
                                {b.text}
                              </p>
                            </motion.div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => setValuesOpen(false)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors mt-2"
                        >
                          <span className="text-xs leading-none">◀</span>
                          Show less
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
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
                        <p className="text-sm leading-relaxed text-white">
                          We go the extra mile to build long-term relationships,
                          ensuring lasting value for our clients through
                          exceptional customer service and continued referrals.
                        </p>
                        {showArrow && (
                          <motion.div
                            whileHover={{ x: 6 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 18,
                            }}
                            className="mt-3 inline-flex"
                          >
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
