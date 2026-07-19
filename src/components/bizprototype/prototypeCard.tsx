"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface PrototypeCardProps {
  id: string;
  imagePath: string;
  altText: string;
  name: string;
  price: number;
  onBuy: () => void; // opens modal
  onAddToCart: () => void; // adds to cart
  isActive?: boolean; // highlight active card
}

const PrototypeCard: React.FC<PrototypeCardProps> = ({
  id,
  imagePath,
  altText,
  name,
  price,
  onBuy,
  onAddToCart,
  isActive = false,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.25 }}
      className={[
        "rounded-2xl overflow-hidden transition-all cursor-pointer",
        "bg-white/10 backdrop-blur-md border border-white/20 shadow-xl",
        "hover:bg-white/15 hover:border-white/30",
        isActive ? "ring-2 ring-[#2563EB] bg-[#2563EB]/10" : "",
      ].join(" ")}
      onClick={onBuy} // ✅ only click opens modal
    >
      {/* Image */}
      <div className="relative aspect-square w-full">
        <Image
          src={imagePath}
          alt={altText}
          fill
          className="object-contain p-4"
          priority
        />
      </div>

      {/* Content */}
      <div className="px-4 pb-4 space-y-3">
        <div className="text-center">
          <p className="text-xs text-white/70 tracking-wide">NAME</p>
          <div className="mt-1 font-semibold text-white">{name}</div>
          <div className="mt-1 text-sm font-bold text-[#2563EB]">
            ${price.toFixed(2)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={onBuy}
            className="flex-1 rounded-lg px-4 py-2 font-medium text-white bg-[#2563EB] hover:bg-[#a50f15] transition"
          >
            View Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // ✅ prevent modal opening when adding to cart
              onAddToCart();
            }}
            className="flex-1 rounded-lg px-4 py-2 font-medium text-white bg-white/10 hover:bg-white/20 transition border border-white/20"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PrototypeCard;
