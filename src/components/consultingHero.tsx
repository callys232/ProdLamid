"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HybridConsultingHero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [activeTab, setActiveTab] = useState<"consultants" | "jobs">(
    "consultants"
  );

  // Typing animation state
  const words = ["Consultants", "Experts", "Advisors", "Opportunities"];
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => { });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // Typing effect logic
  useEffect(() => {
    const currentWord = words[index % words.length];
    const typingSpeed = isDeleting ? 50 : 120;

    const timeout = setTimeout(() => {
      setDisplayText((prev) =>
        isDeleting
          ? currentWord.substring(0, prev.length - 1)
          : currentWord.substring(0, prev.length + 1)
      );

      if (!isDeleting && displayText === currentWord) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setIndex((prev) => prev + 1);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, index]);

  const placeholder =
    activeTab === "consultants"
      ? "Search for consultants, experts, or advisors..."
      : "Search for available jobs or opportunities...";

  return (
    <section className="relative w-full min-h-[55vh] flex flex-col items-center justify-center text-white overflow-hidden bg-black">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/hybrid.png')" }}
      />

      {/* Background Video layered above image (Optional - removed if missing) */}
      {/* <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-70"
        src="/hero-bg.mp4"
        muted
        loop
        playsInline
        preload="auto"
      /> */}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />

      {/* Foreground Content */}
      <div className="relative z-20 text-center max-w-3xl px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6"
        >
          HybridConsulting connects{" "}
          <span className="text-[#c12129]">{displayText}</span>
        </motion.h1>

        {/* Tabs + Search */}
        <div className="mt-6 mx-auto max-w-xl w-full" role="search">
          <div className="flex justify-center items-center bg-black/30 rounded-xl border border-gray-700 backdrop-blur-sm overflow-hidden">
            <button
              onClick={() => setActiveTab("consultants")}
              className={`flex-1 py-3 text-base font-semibold transition-all ${activeTab === "consultants"
                ? "bg-[#c12129] text-white"
                : "text-[#c12129] hover:text-red-400"
                }`}
            >
              CONSULTANTS
            </button>
            <button
              onClick={() => setActiveTab("jobs")}
              className={`flex-1 py-3 text-base font-semibold transition-all ${activeTab === "jobs"
                ? "bg-[#c12129] text-white"
                : "text-[#c12129] hover:text-red-400"
                }`}
            >
              JOBS
            </button>
          </div>

          <div className="mt-3 border border-gray-400 rounded-xl overflow-hidden flex transition-all duration-300">
            <input
              type="text"
              placeholder={placeholder}
              className="w-full px-5 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="mt-8 flex justify-center gap-6 flex-wrap"
        >
          <Link
            href="/jobs"
            className="text-white text-lg hover:text-[#c12129] transition"
          >
            Find Jobs
          </Link>
          <Link
            href="/postjobs"
            className="text-white text-lg hover:text-[#c12129] transition"
          >
            Post Jobs
          </Link>
          <Link
            href="/talent"
            className="bg-[#c12129] px-6 py-3 rounded-xl text-white text-lg hover:bg-[#a11e25] transition"
          >
            Seek a Consultant
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
