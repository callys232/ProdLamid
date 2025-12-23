"use client";

import { FaLinkedin, FaGithub, FaTwitter, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import StatCard from "./statCard";
import ProgressBar from "./progressBar"; // ✅ import the reusable ProgressBar

export default function ProfileHeader() {
  const completion = 70; // profile completion in percentage

  const stats = [
    {
      value: 24,
      label: "Projects",
      details: ["Project A", "Project B", "Project C"],
    },
    {
      value: 18,
      label: "Completed",
      details: ["Completed A", "Completed B", "Completed C"],
    },
    {
      value: "4.9",
      label: "Avg. Rating",
      details: ["Review 1: ⭐⭐⭐⭐⭐", "Review 2: ⭐⭐⭐⭐"],
    },
    {
      value: "3 yrs",
      label: "Experience",
      details: ["React", "Node.js", "MongoDB"],
    },
  ];

  return (
    <motion.div
      className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 
                 border-b border-gray-700 p-8 rounded-lg shadow-lg overflow-hidden 
                 ring-1 ring-gray-700 hover:ring-red-500 transition"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Premium Ribbon */}
      <motion.div
        className="absolute top-4 left-0 bg-red-600 text-white text-xs font-semibold 
                   px-4 py-1 rounded-r-lg shadow-md animate-pulse"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Premium Member
      </motion.div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Avatar + Info */}
        <motion.div
          className="flex items-center gap-5"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full ring-2 ring-red-500 animate-pulse" />
            <img
              src="/avatar.png"
              alt="User Avatar"
              className="w-20 h-20 rounded-full border-4 border-red-500 shadow-md 
                         transform hover:scale-105 transition relative z-10"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">Caleb Johnson</h1>
              <FaCheckCircle
                className="text-blue-500"
                title="Verified Profile"
              />
            </div>
            <p className="text-gray-400 text-sm">Full Stack Developer</p>
            <p className="text-xs text-gray-500 mt-1">Lagos, Nigeria</p>
          </div>
        </motion.div>

        {/* Profile Completion */}
        <motion.div
          className="w-full md:w-1/3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ProgressBar label="Profile Completion" value={completion} />{" "}
          {/* ✅ Clean usage */}
        </motion.div>
      </div>

      {/* Stats Section */}
      <motion.div
        className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2, delayChildren: 1 } },
        }}
      >
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <button className="px-6 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium rounded-lg shadow-md transition transform hover:scale-105">
          Hire Me
        </button>
        <button className="px-6 py-2 bg-gray-700 hover:bg-gray-600 active:bg-gray-700 text-white font-medium rounded-lg shadow-md transition transform hover:scale-105">
          Message
        </button>
        <button className="px-6 py-2 border border-gray-600 hover:border-red-500 text-gray-300 hover:text-white font-medium rounded-lg shadow-md transition transform hover:scale-105">
          Download CV
        </button>
      </motion.div>

      {/* Social Media Links */}
      <motion.div
        className="mt-6 flex gap-6 justify-center md:justify-start text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <a
          href="https://linkedin.com/in/yourprofile"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn Profile"
          className="hover:text-red-500 transition transform hover:scale-110"
        >
          <FaLinkedin size={24} />
        </a>
        <a
          href="https://github.com/yourprofile"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Profile"
          className="hover:text-red-500 transition transform hover:scale-110"
        >
          <FaGithub size={24} />
        </a>
        <a
          href="https://twitter.com/yourprofile"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter Profile"
          className="hover:text-red-500 transition transform hover:scale-110"
        >
          <FaTwitter size={24} />
        </a>
      </motion.div>
    </motion.div>
  );
}
