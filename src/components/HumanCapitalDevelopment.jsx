"use client";

import React from "react";
import Image from "next/image";
import Events from "./Event";
import { motion } from "framer-motion";

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
              width={80}
              height={80}
              className="object-contain"
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
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              className="text-xl md:text-2xl lg:text-3xl font-bold transition duration-300"
            >
              <span className="animate-colorCycle">
                Human Capital Development
              </span>
            </motion.h1>

            <div className="border border-orange-500 rounded-full mt-2 md:mt-4 p-2 hover:bg-orange-500 hover:text-black transition duration-300">
              <p className="text-center text-xs md:text-sm lg:text-base">
                Attracting and Growing World-class Talent
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Recruitment Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col sm:flex-row"
          >
            <div className="bg-gray-300 w-full sm:w-24 md:w-32 h-24 md:h-32 mb-4 sm:mb-0 sm:mr-4"></div>
            <div>
              <h2 className="text-orange-500 text-lg md:text-xl lg:text-2xl mb-2 md:mb-4 hover:text-orange-300 transition duration-300">
                Recruitment
              </h2>
              <p className="text-xs md:text-sm mb-3 md:mb-4">
                We recognize and deal with the growing challenges posed by
                attracting and retaining skilled, qualified, fit-for-role
                talent.
              </p>
              <div className="flex gap-2">
                <button className="bg-black text-white border border-white px-3 py-1 text-xs md:text-sm hover:bg-orange-500 hover:text-white transition duration-300">
                  Read More
                </button>
                <button className="bg-black text-white border border-white px-3 py-1 text-xs md:text-sm hover:bg-orange-500 hover:text-white transition duration-300">
                  Learn How
                </button>
              </div>
            </div>
          </motion.div>

          {/* Training Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-col items-start md:items-end"
          >
            <h2 className="text-orange-500 text-lg md:text-xl lg:text-2xl mb-2 md:mb-4 hover:text-orange-300 transition duration-300">
              Training
            </h2>
            <p className="text-xs md:text-sm mb-3 md:mb-4 text-left md:text-right">
              We light up your team and remodel their mindset and strategies to
              succeed beyond the 21st century.
            </p>
            <p className="text-xs md:text-sm mb-3 md:mb-4 text-left md:text-right opacity-80 hover:opacity-100 transition duration-300">
              Our training programs focus on{" "}
              <strong>leadership, efficiency, and innovation</strong>, equipping
              employees with the necessary skills to navigate today's evolving
              business landscape. Whether it's enhancing problem-solving
              capabilities or strengthening collaboration, our expertise ensures{" "}
              <strong>measurable success</strong>.
            </p>
            <button className="bg-gray-800 text-white px-3 py-1 text-xs md:text-sm hover:bg-gray-900 transition duration-300">
              See How
            </button>
          </motion.div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-wrap justify-center gap-2 mb-6 md:mb-8">
          {[
            { text: "STRATEGY", bg: "bg-gray-700 hover:bg-gray-600" },
            { text: "SOFT SKILLS", bg: "bg-orange-500 hover:bg-orange-600" },
            { text: "LEADERSHIP", bg: "bg-green-700 hover:bg-green-800" },
            { text: "MANAGEMENT", bg: "bg-purple-900 hover:bg-purple-950" },
            { text: "ENTREPRENEURSHIP", bg: "bg-amber-700 hover:bg-amber-800" },
            { text: "MARKETING", bg: "bg-blue-700 hover:bg-blue-800" },
            {
              text: "SALES",
              bg: "bg-transparent text-white border border-white hover:bg-white hover:text-black",
            },
          ].map((tag, idx) => (
            <motion.div
              key={tag.text}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`${tag.bg} px-2 py-1 text-xs md:text-sm rounded transform hover:scale-105 transition duration-300 cursor-pointer`}
            >
              {tag.text}
            </motion.div>
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
