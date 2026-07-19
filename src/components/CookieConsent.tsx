"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "lamid_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0,  opacity: 1 }}
          exit={{   y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl rounded-2xl border border-white/10 bg-[#0B0F19] p-5 shadow-2xl backdrop-blur-sm md:left-auto md:right-6 md:max-w-sm"
        >
          <div className="mb-3 flex items-center gap-2">
            <Cookie className="h-4 w-4 flex-shrink-0 text-[#2563EB]" />
            <p className="text-sm font-semibold text-white">Cookie Notice</p>
          </div>
          <p className="mb-4 text-xs leading-relaxed text-gray-400">
            We use strictly necessary cookies for authentication and functional cookies to improve your experience.
            No advertising or tracking cookies.{" "}
            <Link href="/privacy" className="text-[#2563EB] hover:underline">Learn more</Link>
          </p>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={accept}
              className="flex-1 rounded-lg bg-[#2563EB] py-2 text-xs font-bold text-white transition hover:bg-blue-700"
            >
              Accept
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={decline}
              className="flex-1 rounded-lg border border-white/10 py-2 text-xs font-medium text-gray-400 transition hover:border-white/20 hover:text-white"
            >
              Decline
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
