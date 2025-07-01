"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Events from "./Event";

export default function HumanCapitalDevelopment() {
  return (
    <div className="bg-gradient-to-br from-black via-gray-900/90 to-black text-white min-h-screen w-full">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="w-full h-px bg-gray-700 mb-6"></div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-10 md:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border-2 border-orange-500 rounded-lg p-4 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center transform hover:scale-105 transition duration-300"
          >
            <Image
              src="/human-capital-icon.png"
              alt="Human Capital Logo"
              width={128}
              height={128}
              priority
              className="object-contain w-20 h-20 md:w-28 md:h-28"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center md:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.05, color: "#f97316" }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              className="text-xl md:text-2xl lg:text-3xl font-bold transition duration-300 hover:drop-shadow-[0_2px_8px_rgba(249,115,22,0.6)]"
            >
              <span className="animate-colorCycle">
                Human Capital Development
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{
                scale: 1.05,
                backgroundColor: "#f97316",
                color: "#000",
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative group border border-orange-500 rounded-full mt-2 md:mt-4 px-4 py-2 transition duration-300 text-center text-xs md:text-sm lg:text-base font-semibold text-white"
            >
              Attracting and Growing World-class Talent
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 w-max max-w-xs bg-black text-white text-[10px] md:text-xs px-3 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                Empowering organizations through strategic hiring, tailored
                development, and globally competitive team building.
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Recruitment + Training Section */}
      <div className="container mx-auto px-4 py-6 md:py-8 space-y-8">
        {/* Recruitment */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative flex flex-col sm:flex-row bg-white/5 backdrop-blur-md rounded-lg p-4 overflow-hidden"
        >
          {/* Glare Overlay */}
          <div className="pointer-events-none absolute inset-0 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-black/30 before:via-black/20 before:to-transparent before:opacity-70 before:blur-sm" />

          {/* Image + Title */}
          <div className="group flex flex-col items-center sm:mr-4 mb-4 sm:mb-0 w-full sm:w-32 relative z-10">
            <h2 className="text-orange-400 group-hover:text-white text-sm md:text-base lg:text-lg mb-2 text-center transition duration-300">
              Recruitment
            </h2>
            <div className="w-full h-24 md:h-32 relative rounded overflow-hidden transform transition duration-300 group-hover:scale-105 shadow-md hover:shadow-orange-400/40">
              <Image
                src="/recruitment.png"
                alt="Recruitment visual"
                fill
                className="object-cover rounded"
                priority
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center z-10">
            <p className="text-xs md:text-sm mb-3 md:mb-4">
              We recognize and deal with the growing challenges posed by
              attracting and retaining skilled, qualified, fit-for-role talent.
            </p>
            <div className="flex gap-2">
              <button className="bg-black text-orange-500 border border-orange-500 px-3 py-1 text-xs md:text-sm hover:bg-orange-500 hover:text-white hover:border-white transition duration-300">
                Read More
              </button>
              <button
                className="bg-black text-orange-500 border border-orange-500 px-3 py-1 text-xs md:text-sm hover:bg-orange-500 hover:text-white 
             hover:border-white transition duration-300"
              >
                Learn How
              </button>
            </div>
          </div>
        </motion.div>

        {/* Training */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative flex flex-col sm:flex-row-reverse bg-white/5 backdrop-blur-md rounded-lg p-4 overflow-hidden"
        >
          {/* Black Glare Overlay */}
          <div className="pointer-events-none absolute inset-0 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-tl before:from-black/30 before:via-black/20 before:to-transparent before:opacity-70 before:blur-sm" />

          {/* Image + Title */}
          <div className="group flex flex-col items-center sm:ml-4 mb-4 sm:mb-0 w-full sm:w-32 relative z-10">
            <h2 className="text-orange-400 group-hover:text-white text-sm md:text-base lg:text-lg mb-2 text-center transition duration-300">
              Training
            </h2>
            <div className="w-full h-24 md:h-32 relative rounded overflow-hidden transform transition duration-300 group-hover:scale-105 shadow-md hover:shadow-orange-400/40">
              <Image
                src="/trainingHall.png"
                alt="Training visual"
                fill
                className="object-cover rounded"
                priority
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center z-10">
            <p className="text-xs md:text-sm mb-3 md:mb-4 text-left sm:text-right">
              We light up your team and remodel their mindset and strategies to
              succeed beyond the 21st century.
            </p>
            <p className="text-xs md:text-sm mb-3 md:mb-4 text-left sm:text-right opacity-80 hover:opacity-100 transition duration-300">
              Our training programs focus on{" "}
              <strong>leadership, efficiency, and innovation</strong>, equipping
              employees with the necessary skills to navigate today's evolving
              business landscape. Whether it's enhancing problem-solving
              capabilities or strengthening collaboration, our expertise ensures{" "}
              <strong>measurable success</strong>.
            </p>
            <div className="flex justify-start sm:justify-end">
              <button className="bg-gray-800 text-white px-3 py-1 text-xs md:text-sm hover:bg-gray-900 transition duration-300">
                See How
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Skills Section */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-wrap justify-center gap-2 mb-6 md:mb-8">
          {[
            {
              text: "STRATEGY",
              bg: "bg-gray-700 hover:bg-gray-600",
              tooltipBg: "bg-gray-700 text-white",
              tip: "Planning long-term direction and execution",
            },
            {
              text: "SOFT SKILLS",
              bg: "bg-orange-500 hover:bg-orange-600",
              tooltipBg: "bg-orange-500 text-white",
              tip: "Communication, teamwork, adaptability",
            },
            {
              text: "LEADERSHIP",
              bg: "bg-green-700 hover:bg-green-800",
              tooltipBg: "bg-green-700 text-white",
              tip: "Inspiring and guiding teams effectively",
            },
            {
              text: "MANAGEMENT",
              bg: "bg-purple-900 hover:bg-purple-950",
              tooltipBg: "bg-purple-900 text-white",
              tip: "Supervising tasks, people, and outcomes",
            },
            {
              text: "ENTREPRENEURSHIP",
              bg: "bg-amber-700 hover:bg-amber-800",
              tooltipBg: "bg-amber-700 text-white",
              tip: "Building ventures through innovation and risk",
            },
            {
              text: "MARKETING",
              bg: "bg-blue-700 hover:bg-blue-800",
              tooltipBg: "bg-blue-700 text-white",
              tip: "Creating value and connecting with audiences",
            },
            {
              text: "SALES",
              bg: "bg-transparent text-white border border-white hover:bg-white hover:text-black",
              tooltipBg: "bg-white text-black",
              tip: "Converting prospects into revenue",
            },
          ].map((tag, idx) => (
            <div key={tag.text} className="relative group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`${tag.bg} px-2 py-1 text-xs md:text-sm rounded transform hover:scale-105 transition duration-300 cursor-pointer`}
              >
                {tag.text}
              </motion.div>
              <div
                className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-3 py-1 w-max max-w-xs text-[10px] md:text-xs rounded shadow-md opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 z-50 ${tag.tooltipBg}`}
              >
                {tag.tip}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Events Section */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="w-full h-px bg-gray-700 mb-6"></div>
        <Events />
      </div>
    </div>
  );
}
