"use client";

import { AnimatePresence, motion } from "framer-motion";

interface CategoryModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  title,
  isOpen,
  onClose,
  children,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-black border border-orange-500 rounded-t-2xl shadow-2xl p-8 max-w-5xl w-full text-white relative overflow-y-auto max-h-[90vh]"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-orange-500 hover:text-[#c21219] text-2xl font-bold transition-colors"
              aria-label="Close"
            >
              ×
            </button>

            {/* Title */}
            <h2 className="text-3xl font-bold mb-6 text-orange-500 text-center">
              {title} Events
            </h2>

            {/* Content */}
            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CategoryModal;
