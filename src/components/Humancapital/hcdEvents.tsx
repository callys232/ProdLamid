"use client";
import { motion } from "framer-motion";
import Events from "@/components/Event";

export default function EventsSection() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Animated Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full h-px bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 mb-10 origin-left"
      ></motion.div>

      {/* Events Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 
                   hover:border-orange-400/50 hover:scale-[1.02] transition-all duration-500 ease-in-out"
      >
        <h2 className="text-2xl font-bold text-orange-400 mb-6 text-center hover:text-white hover:drop-shadow-[0_0_8px_orange] transition-all duration-500">
          Upcoming Events
        </h2>

        {/* Events Component */}
        <Events />

        {/* Example Sink Effect Button */}
        <div className="flex justify-center mt-8">
          <button
            className="px-6 py-2 rounded-md border border-orange-500 text-orange-400 
                       hover:bg-orange-500 hover:text-black 
                       hover:scale-[0.97] hover:shadow-sm hover:brightness-95 
                       transition-all duration-500 ease-in-out"
          >
            View All Events
          </button>
        </div>
      </motion.div>
    </div>
  );
}
