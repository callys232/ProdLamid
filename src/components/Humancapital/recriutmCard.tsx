"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInUp } from "@/utils/motionVaraints";

export default function RecruitmentCard() {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="relative flex flex-col sm:flex-row bg-gradient-to-br from-gray-900 via-black to-gray-800 
                 rounded-xl p-6 shadow-lg border border-gray-700 
                 hover:border-orange-400/50 hover:scale-[1.02] transition-all duration-500 ease-in-out"
    >
      {/* Content */}
      <div className="flex flex-col items-center sm:mr-6 mb-4 sm:mb-0 w-full sm:w-40">
        <h2 className="text-orange-400 text-lg font-semibold mb-3 hover:text-white hover:drop-shadow-[0_0_8px_orange] transition-all duration-500">
          Recruitment
        </h2>
        <div className="w-full h-28 md:h-36 relative rounded overflow-hidden shadow-md hover:scale-105 transition-transform duration-500">
          <Image
            src="/recruitment.png"
            alt="Recruitment visual"
            fill
            className="object-cover rounded"
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <p className="text-sm md:text-base text-gray-200 mb-4 leading-relaxed">
          We recognize and deal with the growing challenges posed by attracting
          and retaining skilled, qualified, fit-for-role talent.
        </p>
        <div className="flex gap-3">
          <button
            className="px-4 py-2 text-sm rounded-md border border-orange-500 text-orange-400 
                             hover:bg-orange-500 hover:text-black transition-all duration-500 hover:scale-[0.97] hover:shadow-sm"
          >
            Read More
          </button>
          <button
            className="px-4 py-2 text-sm rounded-md border border-orange-500 text-orange-400 
                             hover:bg-orange-500 hover:text-black transition-all duration-500 hover:scale-[0.97] hover:shadow-sm"
          >
            Learn How
          </button>
        </div>
      </div>
    </motion.div>
  );
}
