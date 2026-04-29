"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-white">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#c12129]">404</p>
        <h1 className="mb-4 text-5xl font-black text-white">Page not found</h1>
        <p className="mb-10 max-w-md text-base text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-lg bg-[#c12129] px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Go home
          </Link>
          <Link
            href="/jobs"
            className="rounded-lg border border-white/10 px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-white/20 hover:text-white"
          >
            Browse projects
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
