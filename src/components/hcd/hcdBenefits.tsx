"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInUp } from "@/utils/motionVaraints";

interface BenefitCardProps {
  label: string;
  icon: string;
  border: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ label, icon, border }) => {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ scale: 1.08, y: -4 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center cursor-pointer"
    >
      <div
        className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border-4 ${border} bg-black shadow-lg hover:shadow-orange-500/50 transition`}
      >
        <Image
          src={icon}
          alt={`${label} Icon`}
          width={45}
          height={45}
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
        />
      </div>
      <p className="text-white text-xs sm:text-sm text-center mt-2 font-medium tracking-tight">
        {label}
      </p>
    </motion.div>
  );
};

export default BenefitCard;
