"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface ApplySuccessProps {
  onClose: () => void;
  bidDetails?: {
    name?: string;
    email?: string;
    amount: string;
    timeline: string;
  };
}

export default function ApplySuccess({
  onClose,
  bidDetails,
}: ApplySuccessProps) {
  const router = useRouter();

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="
            bg-white/10 backdrop-blur-xl border border-white/20
            rounded-2xl shadow-2xl p-8 max-w-md w-full text-center text-gray-100 relative
          "
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex justify-center mb-6"
          >
            <FaCheckCircle className="text-6xl text-[#c21219] drop-shadow-lg" />
          </motion.div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-2 text-white">
            Application Submitted 🎉
          </h2>
          <p className="text-gray-300 mb-6">
            Your bid has been successfully submitted. We’ll notify you once the
            client reviews your application.
          </p>

          {/* Recap Section */}
          {bidDetails && (
            <div className="bg-white/5 rounded-lg p-4 mb-6 text-left space-y-1">
              <p className="text-sm text-gray-300">You proposed:</p>
              <p className="text-lg font-semibold text-white">
                ${bidDetails.amount}
              </p>
              <p className="text-sm text-gray-400">
                Timeline: {bidDetails.timeline}
              </p>

              {/* New fields */}
              {bidDetails.name && (
                <p className="text-sm text-gray-400">Name: {bidDetails.name}</p>
              )}
              {bidDetails.email && (
                <p className="text-sm text-gray-400">
                  Email: {bidDetails.email}
                </p>
              )}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-md font-semibold bg-[#c21219]/80 hover:bg-[#c21219] text-white shadow-lg transition"
            >
              Close
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-2 rounded-md font-semibold bg-white/20 hover:bg-white/30 text-white shadow-lg transition"
            >
              View Dashboard
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
