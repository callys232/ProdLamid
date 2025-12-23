"use client";

import React from "react";
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInUp, fadeInDown, staggerContainer } from "@/utils/motionVaraints";
import CardGrid from "./cardGrid";
import BenefitCard from "./hcdBenefits";

const benefits = [
  {
    label: "Convenience",
    icon: "/EfficiencyIcon.png",
    border: "border-orange-500",
  },
  {
    label: "Cost Effectiveness",
    icon: "/CostEffectivenessIcon.png",
    border: "border-white",
  },
  {
    label: "Client Responsive Culture",
    icon: "/ClientResponsivenessIcon.png",
    border: "border-orange-400",
  },
  {
    label: "Higher Worker Morale",
    icon: "/StaffEngagementIcon.png",
    border: "border-orange-600",
  },
  {
    label: "Additional Sales",
    icon: "/EfficiencyIcon.png",
    border: "border-orange-500",
  },
  {
    label: "Flexibility",
    icon: "/CostEffectivenessIcon.png",
    border: "border-white",
  },
  {
    label: "Leading Edge Skills",
    icon: "/ClientResponsivenessIcon.png",
    border: "border-orange-400",
  },
  {
    label: "Increased Productivity",
    icon: "/StaffEngagementIcon.png",
    border: "border-orange-600",
  },
];

const HcdHeader: React.FC = () => {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Discover how our Human Capital Development strategy attracts and grows visionary leaders to drive innovation and client success."
        />
        <meta
          name="keywords"
          content="Human Capital, Talent Development, Leadership, Innovation, Recruitment, Workforce"
        />
        <meta name="lamid" content="Lamid Consulting" />
        <meta
          property="og:title"
          content="Human Capital Development | Attracting World-Class Talent"
        />
        <meta
          property="og:description"
          content="We build visionary leaders to drive innovation and disruption for client advantage."
        />
        <meta property="og:image" content="/LD3.jpg" />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="relative min-h-screen bg-black pt-12 md:pt-24">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/LD3.jpg"
            alt="Business professionals in discussion"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-orange-900/30" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 py-4 md:py-6">
          <main>
            {/* Header and Logo Section */}
            <motion.div
              className="flex flex-col lg:flex-row lg:justify-between gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div className="w-full lg:w-3/5" variants={fadeInDown}>
                <h1 className="animate-pulse text-orange-500 drop-shadow-md text-2xl sm:text-3xl md:text-4xl mb-2">
                  Human Capital Development
                </h1>

                <div className="bg-black border border-gray-800 py-2 px-4 inline-block mb-2 md:mb-4">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white animate-glitchPulse [animation-delay:0.6s]">
                    Attracting and Growing World-Class Talent
                  </h2>
                </div>

                <p className="text-white text-xs sm:text-sm md:text-base max-w-2xl mb-6 md:mb-10">
                  We recruit and build visionary leaders and talents with a
                  singular purpose — to create continuous innovation and
                  disruption for client advantage.
                </p>
              </motion.div>

              <motion.div
                className="w-full lg:w-2/5 flex flex-col items-center lg:items-end mb-8 md:mb-12"
                variants={fadeInUp}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  transition={{ duration: 0.3 }}
                  className="glow-circle border-2 border-orange-500 rounded-lg p-2 mb-3 w-40 sm:w-48 md:w-64 shadow-lg"
                >
                  <Image
                    src="/human-capital-icon.png"
                    alt="Human Capital Development Logo"
                    width={250}
                    height={250}
                  />
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold text-orange-500">
                  HCD
                </h2>
              </motion.div>
            </motion.div>

            {/* Benefits Section */}
            <div className="w-full mt-4 md:mt-8">
              <h3 className="glitch text-lg md:text-xl text-orange-500 font-bold mb-4 md:mb-6">
                BENEFITS
              </h3>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <CardGrid>
                  {benefits.map((item, index) => (
                    <BenefitCard
                      key={index}
                      label={item.label}
                      icon={item.icon}
                      border={item.border}
                    />
                  ))}
                </CardGrid>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default HcdHeader;
