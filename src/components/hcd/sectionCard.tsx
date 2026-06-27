"use client";

import React, { ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface SectionCardProps {
  title: string;
  description: string;
  subDescription?: string;
  imageSrc?: string;
  imageAlt?: string;
  tags?: string[];
  button?: {
    label: string;
    onClick: () => void;
    className?: string;
  };
  secondaryButton?: {
    label: string;
    onClick: () => void;
    className?: string;
  };
  reverse?: boolean;
  fadeInIndex?: number;
  hoverGlow?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  description,
  subDescription,
  imageSrc,
  imageAlt,
  tags = [],
  button,
  secondaryButton,
  reverse = false,
  fadeInIndex = 1,
  hoverGlow = "",
}) => {
  return (
    <motion.section
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            delay: fadeInIndex * 0.1,
            duration: 0.6,
            ease: "easeOut",
          },
        },
      }}
      initial="hidden"
      animate="visible"
      className={`flex flex-col md:flex-${
        reverse ? "row-reverse" : "row"
      } gap-10 p-10 rounded-2xl bg-gradient-to-br from-neutral-900 to-black border border-white/10 ${hoverGlow}`}
    >
      <div className="w-full md:w-1/3">
        <motion.div
          whileHover={{ scale: 1.04 }}
          className="overflow-hidden rounded-xl shadow-lg shadow-black/40"
        >
          <Image
            src={imageSrc || "/fallback.jpg"}
            alt={imageAlt || title}
            width={600}
            height={450}
            className="object-cover w-full h-auto"
          />
        </motion.div>
      </div>

      <div className="w-full md:w-2/3 flex flex-col justify-center space-y-5">
        <h2 className="text-4xl font-extrabold text-orange-400 drop-shadow-sm">
          {title}
        </h2>
        <p className="text-gray-200 leading-relaxed">{description}</p>
        {subDescription && (
          <p className="text-gray-400 text-sm leading-relaxed">
            {subDescription}
          </p>
        )}

        {button && (
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.96 }}
            onClick={button.onClick}
            className={`inline-flex items-center gap-2 ${button.className}`}
          >
            {button.label}
          </motion.button>
        )}

        {secondaryButton && (
          <motion.button
            whileHover={{ scale: 1.07 }}
            onClick={secondaryButton.onClick}
            className={secondaryButton.className}
          >
            {secondaryButton.label}
          </motion.button>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {tags.map((tag, i) => (
              <motion.span
                key={i}
                whileHover={{ scale: 1.1 }}
                className="px-4 py-1 rounded-full text-xs font-semibold bg-white/10 text-white tracking-wide shadow-sm"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default SectionCard;
