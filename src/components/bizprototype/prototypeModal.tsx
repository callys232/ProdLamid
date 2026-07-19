"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/components/Cartcontext";

interface PrototypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  imagePath: string;
  altText: string;
  price: number;
}

const PrototypeModal: React.FC<PrototypeModalProps> = ({
  isOpen,
  onClose,
  name,
  imagePath,
  altText,
  price,
}) => {
  const { addToCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 220 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl p-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-4 text-white/90 hover:text-[#2563EB] text-xl"
            >
              ✕
            </button>

            {/* Image */}
            <div className="relative w-full h-56 mb-4 rounded-xl overflow-hidden border border-white/20 bg-black/40">
              <Image
                src={imagePath}
                alt={altText}
                fill
                className="object-contain p-4"
              />
            </div>

            {/* Name + Price */}
            <h3 className="text-2xl font-bold text-center text-white">
              {name}
            </h3>
            <p className="mt-2 text-lg font-bold text-center text-[#2563EB]">
              ${price.toFixed(2)}
            </p>

            {/* Description */}
            <p className="mt-3 text-white/80 text-center">{altText}</p>

            {/* Actions */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  addToCart({
                    id: Date.now().toString(),
                    name,
                    imageUrl: imagePath,
                    price,
                    quantity: 1,
                    description: altText,
                    category: "Prototype",
                  });
                  onClose();
                }}
                className="rounded-lg px-4 py-2 font-medium text-white bg-[#2563EB] hover:bg-[#a50f15] transition"
              >
                Confirm purchase
              </button>
              <button
                onClick={() => {
                  addToCart({
                    id: Date.now().toString(),
                    name,
                    imageUrl: imagePath,
                    price,
                    quantity: 1,
                    description: altText,
                    category: "Prototype",
                  });
                  onClose();
                }}
                className="rounded-lg px-4 py-2 font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 transition"
              >
                Add to cart
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PrototypeModal;
