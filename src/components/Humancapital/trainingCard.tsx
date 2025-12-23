"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function TrainingCard() {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col sm:flex-row-reverse bg-gradient-to-br from-gray-900 via-black to-gray-800 
                 rounded-xl p-6 shadow-lg border border-gray-700 
                 hover:border-orange-400/50 hover:shadow-xl transition-all duration-500 ease-in-out"
    >
      <div className="flex flex-col items-center sm:ml-6 mb-4 sm:mb-0 w-full sm:w-40">
        <h2 className="text-orange-400 text-lg font-semibold mb-3 hover:text-white hover:drop-shadow-[0_0_8px_orange] transition-all duration-500">
          Training
        </h2>
        <div className="w-full h-28 md:h-36 relative rounded overflow-hidden shadow-md hover:scale-105 transition-transform duration-500">
          <Image
            src="/trainingHall.png"
            alt="Training visual"
            fill
            className="object-cover rounded"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <p className="text-sm md:text-base text-gray-200 mb-4 leading-relaxed">
          Empowering organizations through strategic hiring, tailored
          development, and globally competitive team building.
        </p>
        <button
          className="px-4 py-2 text-sm rounded-md border border-orange-500 text-orange-400 
                           hover:bg-orange-500 hover:text-black transition-all duration-500 hover:scale-[0.97] hover:shadow-sm self-start sm:self-end"
        >
          See How
        </button>
      </div>
    </motion.div>
  );
}
