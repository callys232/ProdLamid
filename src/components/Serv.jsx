"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link"; // Import Next.js Link component

const Serv = () => {
  const [expanded, setExpanded] = useState(null);

  const handleClick = (section) => {
    setExpanded(expanded === section ? null : section);
  };

  return (
    <motion.div
      className="bg-cover bg-center flex w-full h-[450px] items-end justify-end border-[2px] border-[#2563EB] rounded-bl-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ backgroundImage: `url('/servBg.png')` }}
    >
      <motion.div
        className="relative w-full mb-9 h-[250px] bg-cover bg-center bg-no-repeat max-w-[500px] sm:w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{ backgroundImage: `url('/assets/images/HeroServices.png')` }}
      >
        <div className="relative z-10 flex items-center justify-center h-full gap-2 px-4">
          {/* Biz Section */}
          <motion.div
            className="group cursor-pointer"
            animate={{
              scale: expanded === "biz" ? 1.2 : 1,
              rotate: expanded === "biz" ? 10 : 0,
            }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Link href="/biz">
              <div className="relative w-30 h-20 rounded-tr-3xl rounded-bl-3xl overflow-hidden border-2 hover:border-blue-400">
                <Image
                  src="/bizLogo.png"
                  alt="Business"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
            </Link>
          </motion.div>

          {/* Talent Development Section */}
          <motion.div
            className="group cursor-pointer"
            animate={{
              scale: expanded === "hcd" ? 1.2 : 1,
              rotate: expanded === "hcd" ? -10 : 0,
            }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Link href="/hcd">
              <div className="relative w-20 h-44 rounded-tl-3xl rounded-br-3xl overflow-hidden border-2 border-orange-500 hover:border-orange-400">
                <Image
                  src="/hcdLogo.png"
                  alt="Talent Development"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
            </Link>
          </motion.div>

          {/* Sustainability Consulting — Coming Soon */}
          <motion.div
            className="group cursor-not-allowed"
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative w-20 h-44 rounded-tl-3xl rounded-br-3xl overflow-hidden border-2 border-gray-700 opacity-60">
              <Image
                src="/sdLogo.png"
                alt="Sustainability Consulting"
                width={80}
                height={80}
                className="object-cover w-full h-full grayscale"
              />
              {/* Coming Soon overlay */}
              <div className="absolute inset-0 flex items-end justify-center pb-2 bg-black/50">
                <span className="text-[8px] font-bold text-white/70 tracking-widest uppercase text-center leading-tight">
                  Coming<br />Soon
                </span>
              </div>
            </div>
          </motion.div>


          {/* Portal Section */}
          <motion.div
            className="group cursor-pointer"
            animate={{
              scale: expanded === "portal" ? 1.2 : 1,
              rotate: expanded === "portal" ? 10 : 0,
            }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Link href="/portal">
              <div className="relative w-30 h-20 rounded-tr-3xl rounded-bl-3xl overflow-hidden border-2 border-black-500 hover:border-green-500">
                <Image
                  src="/portalLogo.png"
                  alt="Portal"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
            </Link>

          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Serv;
