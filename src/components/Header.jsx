"use client";

import { motion } from "framer-motion";
import Serv from "./Serv";

const Header = () => {
  return (
    <header className="relative min-h-screen w-full bg-black text-white flex flex-col md:flex-row items-center px-6 md:px-12">
      {/* Left Side - Text Section */}
      <motion.div
        className="w-full md:w-2/3 flex flex-col justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-center md:text-left max-w-[90%] mx-auto md:mx-0 cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          whileHover={{ scale: 1.1, color: "#C12129" }} // Hover Effect
        >
          We build and grow world-class organizations
        </motion.h1>
      </motion.div>

      {/* Right Side - Serv Component */}
      <motion.div
        className="w-full md:w-1/3 flex justify-end items-center bg-red-800 mt-4 md:mt-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <Serv />
      </motion.div>
    </header>
  );
};

export default Header;
