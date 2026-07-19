"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-white">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#2563EB]">Error</p>
        <h1 className="mb-4 text-4xl font-black text-white">Something went wrong</h1>
        <p className="mb-2 max-w-md text-sm text-gray-400">
          {error.message || "An unexpected error occurred."}
        </p>
        {error.digest && (
          <p className="mb-8 font-mono text-[11px] text-gray-600">ref: {error.digest}</p>
        )}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-lg border border-white/10 px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-white/20 hover:text-white"
          >
            Go home
          </a>
        </div>
      </motion.div>
    </main>
  );
}
