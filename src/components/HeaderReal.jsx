"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <header className="relative min-h-screen w-full overflow-hidden bg-black">
      <div className="flex flex-col md:flex-row items-center min-h-screen">

        {/* Text Section */}
        <div className="w-full md:w-1/2 px-6 md:px-12 pt-20 md:pt-0 flex flex-col items-center md:items-start">

          {/* Heading */}
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center md:text-left max-w-xl bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            We build and grow world-class organizations
          </motion.h1>

          {/* Standalone Gradient Paragraph */}
          <motion.p
            className="mt-6 text-sm sm:text-base md:text-lg max-w-lg text-center md:text-left leading-relaxed bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Our AI-driven consulting system unifies project matching and end-to-end delivery
            into a single intelligent marketplace—combining CRM and project management in one platform.
          </motion.p>

        </div>

        {/* Image Section */}
        <motion.div
          className="w-full md:w-1/2 h-[40vh] md:h-full relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Image
            src="/Home1.png"
            alt="Header visual"
            fill
            priority
            className="object-cover"
          />
        </motion.div>

      </div>
    </header>
  );
};

export default Header;