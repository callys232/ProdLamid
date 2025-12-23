"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeaderSection() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          className="border-2 border-orange-500 rounded-lg p-4 w-28 h-28 md:w-36 md:h-36 flex items-center justify-center hover:brightness-90 transition-all duration-500"
        >
          <Image
            src="/human-capital-icon.png"
            alt="Human Capital Logo"
            width={128}
            height={128}
            priority
            className="object-contain w-24 h-24 md:w-32 md:h-32"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center md:text-left"
        >
          <motion.h1
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-extrabold tracking-wide bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-gradientMove drop-shadow-lg"
          >
            Human Capital Development
          </motion.h1>
          <p className="mt-3 text-sm md:text-base text-gray-300 leading-relaxed">
            Attracting and Growing World-class Talent
          </p>
        </motion.div>
      </div>
    </div>
  );
}
