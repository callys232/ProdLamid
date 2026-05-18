"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PledgeStrategySection = () => {
  const [economyExpanded, setEconomyExpanded] = useState(false);

  return (
    <section className="relative bg-black text-white overflow-hidden">
      {/* Diagonal background element - improved responsiveness */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 right-0 w-full md:w-3/4 lg:w-2/3 h-full bg-red-900/30 transform -skew-x-12 origin-bottom-right"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Left column - Image and Pledge */}
          <div className="space-y-4 sm:space-y-6">



            {/* Pledge and Strategy section */}
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 sm:p-5">
              <div className="mb-3 sm:mb-4">
                <div className="bg-blue-700 rounded-md px-2 sm:px-3 py-1 sm:py-1.5 inline-block">
                  <h2 className="text-xs sm:text-sm font-medium text-white uppercase tracking-wider">Our Pledge</h2>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs sm:text-sm md:text-base leading-relaxed text-gray-300">
                  We don't just build tools.
                </p>
                <p className="text-xs sm:text-sm md:text-base leading-relaxed text-gray-300">
                  We build systems that build people.
                </p>
                <p className="text-xs sm:text-sm md:text-base leading-relaxed text-gray-300">
                  We build ecosystems that build nations.
                </p>
              </div>
            </div>
          </div>

          {/* Right column - Building Great Economy */}
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-green-700 rounded-md px-2 sm:px-3 py-1 sm:py-1.5 min-w-0">
                <h2 className="text-xs sm:text-sm font-medium text-white uppercase tracking-wider truncate">Building and Enduring Great Economy</h2>
              </div>
              <button
                onClick={() => setEconomyExpanded(!economyExpanded)}
                className="border border-white/20 bg-white/5 hover:bg-white/10 rounded-md p-1.5 transition-colors ml-2 flex-shrink-0"
                aria-label={economyExpanded ? "Collapse" : "Expand"}
              >
                <motion.svg
                  animate={{ rotate: economyExpanded ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                >
                  <path d="M5 9l7 7 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              </button>
            </div>

            <p className="text-xs sm:text-sm md:text-base leading-relaxed text-gray-300">
              A great company can be measured by its performance — generating enough cash flow through highly
              profitable operations to invest in the future and create value for its customers through innovation.
            </p>

            <AnimatePresence initial={false}>
              {economyExpanded && (
                <motion.div
                  key="economy-extra"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <p className="mt-3 text-xs sm:text-sm md:text-base leading-relaxed text-gray-300">
                    Its greatness is also defined by its impact on the industry, the reputation it builds with stakeholders,
                    and a business model that keeps it healthy for decades. Such companies are run by people who are
                    experienced, educated, business-savvy, and profitability-centred — always taking advantage of
                    opportunities available in the environment.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PledgeStrategySection;