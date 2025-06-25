"use client";

import { motion } from "framer-motion";
import Serv from "./Serv";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback } from "react";

const Header = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <header className="relative min-h-screen w-full bg-black text-white overflow-hidden px-6 md:px-12 flex flex-col md:flex-row items-center">
      {/* Particles Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: false,
          particles: {
            number: { value: 40 },
            size: { value: 2 },
            color: { value: "#ffffff" },
            move: { enable: true, speed: 0.5 },
            opacity: { value: 0.5 },
          },
          background: { color: "transparent" },
        }}
        className="absolute inset-0 z-0"
      />
      <Particles
        id="tsparticles-container"
        init={particlesInit}
        options={{
          fullScreen: false,
          particles: {
            number: { value: 25 },
            size: { value: 2 },
            color: { value: "#ffffff" },
            move: { enable: true, speed: 0.6 },
            opacity: { value: 0.5 },
          },
          background: { color: "transparent" },
        }}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* Left Side - Typing Text with Glow */}
      <motion.div
        className="w-full md:w-2/3 flex flex-col justify-center relative z-10 p-6 border-2 border-transparent rounded-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-white border-r-2 border-white max-w-full whitespace-nowrap overflow-hidden w-0 animate-typing"
          whileHover={{ scale: 1.05 }}
        >
          We build and grow world-class organizations
        </motion.h1>
      </motion.div>

      {/* Right Side - Serv Component */}
      <motion.div
        className="w-full md:w-1/3 flex justify-end items-center mt-6 md:mt-0 z-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <Serv />
      </motion.div>
    </header>
  );
};

export default Header;
