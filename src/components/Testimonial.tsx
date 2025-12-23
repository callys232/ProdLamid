"use client";

import React, { useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { fadeInUp, fadeInDown, staggerContainer } from "@/utils/motionVaraints";

const Testimonial: React.FC = () => {
  const [videoPlaying, setVideoPlaying] = useState<boolean>(false);

  return (
    <div className="bg-black text-white">
      <Head>
        <title>Testimonials</title>
        <meta name="description" content="Client testimonials and partners" />
      </Head>

      {/* Testimonials section */}
      <div className="bg-black py-12">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex flex-col md:flex-row gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {/* Video Section */}
            <motion.div className="w-full md:w-2/5" variants={fadeInDown}>
              <div
                className="border-2 border-blue-600 aspect-video relative cursor-pointer hover:opacity-80 transition duration-300"
                onClick={() => setVideoPlaying(!videoPlaying)}
              >
                {!videoPlaying ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition duration-300">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-16 border-l-white border-b-8 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                ) : (
                  <video
                    className="w-full h-full"
                    controls
                    autoPlay
                    src="/videos/demo-video.mp4"
                  />
                )}
              </div>
            </motion.div>

            {/* Testimonials Text */}
            <motion.div className="w-full md:w-3/5" variants={fadeInUp}>
              <h2 className="text-blue-600 text-2xl mb-6 hover:text-blue-400 transition duration-300">
                Testimonials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900 p-4 rounded hover:bg-gray-800 transition duration-300">
                  <p className="text-sm">
                    “The programs helped in the effective management and
                    motivation of staff to enable them leverage their
                    intellectual capability, to transform business challenges
                    into opportunities.”
                  </p>
                </div>
                <div className="bg-gray-900 p-4 rounded hover:bg-gray-800 transition duration-300">
                  <p className="text-sm">
                    “LAMID’s training program enhanced the quality of the
                    negotiation processes with respective Trade Unions, and led
                    to significant improvements in industrial relations, between
                    their officials and management of the organization.”
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
