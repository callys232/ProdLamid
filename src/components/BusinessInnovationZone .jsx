"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import GetDignostics from "../forms/diagnostics/GetDiagnostic";
import AOS from "aos";
import "aos/dist/aos.css";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.33, 1, 0.68, 1] },
});

const BusinessInnovationZone = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <div className="bg-black text-white pt-14 md:pt-20 pb-6 sm:pb-8 md:pb-10 px-3 sm:px-4 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Section label */}
        <motion.div {...fadeUp(0)} className="mb-6">
          <span className="text-xs font-semibold tracking-widest text-blue-400 uppercase border border-blue-500/40 bg-blue-500/10 px-3 py-1 rounded-full">
            Business Innovation Zone
          </span>
        </motion.div>

        {/* BIZ Header */}
        <motion.div
          {...fadeUp(0.1)}
          className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
        >
          {/* BIZ Logo */}
          <div className="border border-blue-500/60 rounded-xl p-4 flex-shrink-0 hover:border-blue-400 hover:bg-blue-500/10 transition duration-300">
            <Image
              src="/biz-icon.png"
              alt="BIZ Logo"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>

          {/* BIZ Text */}
          <div className="flex flex-col justify-center w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-left animate-rainbowPulse drop-shadow-md mb-3">
              Business Innovation Zone
            </h2>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed text-left">
              The one-stop place that rapidly nurtures and expands startups to
              deliver exceptional value — through digitalized, client-centered
              systems and processes.
            </p>
          </div>
        </motion.div>

        {/* BEST Section */}
        <motion.div {...fadeUp(0.2)} className="mb-6">
          <div className="rounded-2xl border border-amber-500/50 bg-amber-900/10 p-5 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-amber-900/20 transition duration-300">
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-semibold text-left leading-snug">
                <span className="animate-rainbowPulse drop-shadow-[0_0_2px_cyan]">B</span>usiness{" "}
                <span className="animate-rainbowPulse drop-shadow-[0_0_2px_cyan]">E</span>xpansion{" "}
                <span className="animate-rainbowPulse drop-shadow-[0_0_2px_cyan]">S</span>trategy &{" "}
                <span className="animate-rainbowPulse drop-shadow-[0_0_2px_cyan]">T</span>echnology
                {" — "}
                <span className="animate-glitchPulse [animation-delay:0.6s] text-amber-400 font-bold">BEST</span>
                {" "}— our all-in-one growth toolbox
              </h3>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed text-left mt-3">
                Our portfolio of simple, easy-to-use entrepreneurial management
                know-how delivers sustainable growth by executing a lean plan on
                digitalized, client-centered systems and processes.
              </p>
            </div>
            <div className="flex-shrink-0 hover:scale-110 transition duration-300">
              <Image
                src="/best-icon.png"
                alt="BEST Icon"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div {...fadeUp(0.3)} className="rounded-2xl overflow-hidden border border-white/10 mb-6">
          <Image
            src="/BIT-picture.png"
            alt="Innovation Zone"
            width={1920}
            height={1080}
            priority
            className="w-full h-auto object-contain"
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          {...fadeUp(0.4)}
          className="flex flex-col sm:flex-row gap-3 px-1"
        >
          <button className="flex-1 border border-white/20 bg-white/5 hover:bg-[#c21219] hover:border-[#c21219] text-white font-medium text-sm md:text-base px-5 py-3 rounded-xl transition duration-300">
            Build Right — Avoid costly trial and error
          </button>
          <button
            onClick={() => setShowPopup(true)}
            className="flex-1 border border-white/20 bg-white/5 hover:bg-[#c21219] hover:border-[#c21219] text-white font-semibold text-sm md:text-base px-5 py-3 rounded-xl transition duration-300"
          >
            Get Started — FREE Diagnostics
          </button>
        </motion.div>
      </div>

      {/* Diagnostics Modal */}
      {showPopup && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black/70 backdrop-blur-md z-[999999]"
          onClick={() => setShowPopup(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="bg-[#0d0d0d] rounded-2xl shadow-2xl border border-white/10 w-[90%] sm:w-[70%] md:w-[50%] max-h-[70vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition text-xl"
            >
              ✕
            </button>
            <GetDignostics closeModal={() => setShowPopup(false)} />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BusinessInnovationZone;
