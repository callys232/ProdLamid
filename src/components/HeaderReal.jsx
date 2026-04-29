"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Users, DollarSign } from "lucide-react";

const stats = [
  { icon: Users,      value: "2,400+", label: "Active Consultants" },
  { icon: DollarSign, value: "$120M+", label: "Projects Delivered"  },
  { icon: TrendingUp, value: "98%",    label: "Client Satisfaction" },
];

const GRADIENT = "bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent";

const Header = () => {
  return (
    <header className="relative min-h-screen w-full overflow-hidden bg-black">

      {/* Radial red glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(193,33,41,0.18),transparent)]" />

      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative flex flex-col md:flex-row items-center min-h-screen">

        {/* ── Text Column ─────────────────────────────────────────── */}
        <div className="z-10 flex w-full flex-col items-center px-6 pt-20 md:w-1/2 md:items-start md:px-16 md:pt-0">

          {/* Badge */}
          <motion.div
            className="mb-7 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#c12129]" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-300">
              AI-Powered Consulting Platform
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className={`max-w-xl text-center text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-left md:text-5xl lg:text-6xl xl:text-7xl ${GRADIENT}`}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            We build and grow world-class organizations
          </motion.h1>

          {/* Paragraph — same gradient */}
          <motion.p
            className={`mt-6 max-w-lg text-center text-sm leading-relaxed sm:text-base md:text-left md:text-[1.05rem] ${GRADIENT}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
          >
            Our AI-driven consulting system unifies project matching and end-to-end
            delivery into a single intelligent marketplace — combining CRM and project
            management in one platform.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="mt-10 flex w-full flex-col items-center gap-3 sm:flex-row md:items-start"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
          >
            <a
              href="/register"
              className="group flex items-center gap-2 rounded-lg bg-[#c12129] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-red-700 hover:shadow-[0_0_28px_rgba(193,33,41,0.45)] active:scale-95"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="/about"
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-gray-300 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 active:scale-95"
            >
              See How It Works
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="mt-12 flex items-center gap-7 md:gap-9"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.85 }}
          >
            {stats.map(({ icon: Icon, value, label }, i) => (
              <div key={i} className="flex flex-col items-center md:items-start">
                <div className="flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 text-[#c12129]" />
                  <span className="text-[15px] font-bold text-white">{value}</span>
                </div>
                <span className="mt-0.5 text-[11px] text-gray-500">{label}</span>
              </div>
            ))}
          </motion.div>

        </div>

        {/* ── Image Column ─────────────────────────────────────────── */}
        <motion.div
          className="relative h-[45vh] w-full md:h-full md:w-1/2"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.35 }}
        >
          {/* Left-edge blend into black */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-28 bg-gradient-to-r from-black to-transparent md:block" />

          <Image
            src="/Home1.png"
            alt="Platform visual"
            fill
            priority
            className="object-cover"
          />

          {/* Subtle red tint over image */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_65%_50%,rgba(193,33,41,0.07),transparent)]" />
        </motion.div>

      </div>
    </header>
  );
};

export default Header;
