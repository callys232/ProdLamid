"use client";

import { motion } from "framer-motion";

export default function EcosystemTag({ className = "" }: { className?: string }) {
  return (
    <>
      <style>{`
        @keyframes eco-shift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes eco-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.55; }
        }
        @keyframes eco-dot-pulse {
          0%, 100% { box-shadow: 0 0 4px rgba(194,18,25,0.9); }
          50%       { box-shadow: 0 0 12px rgba(251,113,133,1); }
        }
        .eco-text {
          background: linear-gradient(
            270deg,
            #c21219, #f43f5e, #fb923c, #a78bfa, #34d399, #60a5fa, #f43f5e, #c21219
          );
          background-size: 400% 400%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: eco-shift 6s ease-in-out infinite, eco-blink 3.5s ease-in-out infinite;
        }
        .eco-dot {
          animation: eco-dot-pulse 2s ease-in-out infinite;
        }
      `}</style>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.25 }}
        className={`flex justify-center mt-8 ${className}`}
      >
        <span
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full cursor-default select-none"
          style={{
            border: "1px solid rgba(194,18,25,0.25)",
            background: "rgba(194,18,25,0.05)",
          }}
        >
          <span
            className="eco-dot w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: "#c21219" }}
          />
          <span className="eco-text text-xs sm:text-sm font-semibold tracking-wide">
            One Ecosystem. Every Layer of Impact
          </span>
        </span>
      </motion.div>
    </>
  );
}
