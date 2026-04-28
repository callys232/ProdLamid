"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <header className="relative min-h-[57dvh] w-full overflow-x-hidden bg-black text-white">
      <div className="flex flex-col md:flex-row items-center">
        {/* Text Content */}
        <motion.div
          className="w-full md:w-[60%] px-4 sm:px-6 md:px-8 lg:px-12 pt-20 md:pt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-3xl lg:text-4xl font-bold text-center md:text-left max-w-[90%] mx-auto md:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            We build and grow world-class organizations
          </motion.h1>
        </motion.div>

        {/* Image */}
        <motion.div
          className="w-full md:w-[60%] md:h-screen mt-8 md:mt-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="w-full h-[40vh] md:h-full">
            <Image
              src="/Home1.png"
              alt="Header Title"
              width={800}
              height={400}
              priority
              className=" object-cover"
            />
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
