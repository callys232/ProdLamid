"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string; // e.g. "max-w-lg", "max-w-2xl"
  showClose?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  width = "max-w-xl",
  showClose = true,
}: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.35 }}
            className={`bg-white text-black rounded-2xl shadow-2xl p-6 relative ${width} w-full`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            {showClose && (
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-black hover:text-orange-500 transition"
              >
                ✕
              </button>
            )}

            {/* Title */}
            {title && (
              <h2 className="text-2xl font-semibold mb-4 text-black border-b pb-2 border-orange-400">
                {title}
              </h2>
            )}

            {/* Content */}
            <div className="text-gray-700">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
