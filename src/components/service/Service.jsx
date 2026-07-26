"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

const ServiceCard = ({ title, icon, coloredLetters, href }) => {
  const colorizedTitle = () =>
    title.split("").map((letter, index) =>
      coloredLetters.includes(index) ? (
        <span key={index} className="text-blue-500">
          {letter}
        </span>
      ) : (
        <span key={index}>{letter}</span>
      ),
    );

  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.96, y: 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 22 }}
        className="group flex flex-col items-center mb-8 px-4 py-6 cursor-pointer"
      >
        <motion.div
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1, rotate: 3 }}
          transition={{ type: "spring", stiffness: 380, damping: 18 }}
          className="mb-4"
        >
          <Image
            src={icon}
            alt={title}
            width={80}
            height={80}
            className="w-28 h-24 object-contain drop-shadow-[0_0_12px_rgba(37,99,235,0.3)] group-hover:drop-shadow-[0_0_20px_rgba(37,99,235,0.55)] transition-all duration-300"
          />
        </motion.div>

        <h3 className="text-xl font-semibold text-center leading-snug group-hover:text-white transition-colors duration-200">
          {colorizedTitle()}
        </h3>

        {/* Animated underline */}
        <motion.div
          initial={{ width: 0 }}
          whileHover={{ width: "50%" }}
          transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
          className="mt-3 h-0.5 rounded-full bg-gradient-to-r from-[#2563EB] to-rose-400"
        />
      </motion.div>
    </Link>
  );
};

const ServicesSection = () => {
  return (
    <div className="relative bg-black text-white w-full px-4 md:px-8 lg:px-16 pt-6 pb-8 overflow-hidden">
      {/* ── Full-section vector background ── */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full z-0"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <line
          x1="0"
          y1="0"
          x2="100%"
          y2="100%"
          stroke="#2563EB"
          strokeWidth="1"
          opacity="0.18"
        />
        <line
          x1="100%"
          y1="0"
          x2="0"
          y2="100%"
          stroke="#ffffff"
          strokeWidth="0.8"
          opacity="0.08"
        />
        <line
          x1="30%"
          y1="0"
          x2="70%"
          y2="100%"
          stroke="#2563EB"
          strokeWidth="0.8"
          opacity="0.12"
        />
        <line
          x1="0"
          y1="33%"
          x2="100%"
          y2="33%"
          stroke="#ffffff"
          strokeWidth="0.7"
          opacity="0.07"
        />
        <line
          x1="0"
          y1="66%"
          x2="100%"
          y2="66%"
          stroke="#ffffff"
          strokeWidth="0.6"
          opacity="0.06"
        />
        <line
          x1="25%"
          y1="0"
          x2="25%"
          y2="100%"
          stroke="#2563EB"
          strokeWidth="0.7"
          opacity="0.1"
        />
        <line
          x1="75%"
          y1="0"
          x2="75%"
          y2="100%"
          stroke="#2563EB"
          strokeWidth="0.6"
          opacity="0.08"
        />
        <circle
          cx="10%"
          cy="20%"
          r="80"
          fill="none"
          stroke="#2563EB"
          strokeWidth="1.2"
          opacity="0.15"
        />
        <circle
          cx="90%"
          cy="75%"
          r="110"
          fill="none"
          stroke="#2563EB"
          strokeWidth="1"
          opacity="0.14"
        />
        <circle
          cx="55%"
          cy="50%"
          r="160"
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.7"
          opacity="0.07"
        />
        <circle
          cx="10%"
          cy="20%"
          r="40"
          fill="none"
          stroke="#2563EB"
          strokeWidth="1"
          opacity="0.18"
        />
        <circle
          cx="90%"
          cy="75%"
          r="55"
          fill="none"
          stroke="#2563EB"
          strokeWidth="1"
          opacity="0.18"
        />
        <circle cx="18%" cy="58%" r="3" fill="#2563EB" opacity="0.25" />
        <circle cx="38%" cy="12%" r="2.5" fill="#ffffff" opacity="0.15" />
        <circle cx="62%" cy="88%" r="3" fill="#2563EB" opacity="0.22" />
        <circle cx="83%" cy="30%" r="4" fill="#2563EB" opacity="0.2" />
        <circle cx="47%" cy="70%" r="2" fill="#ffffff" opacity="0.12" />
        <circle cx="72%" cy="18%" r="3" fill="#2563EB" opacity="0.18" />
        <circle cx="6%" cy="82%" r="2.5" fill="#ffffff" opacity="0.12" />
        <path
          d="M 0 0 Q 140 0 140 140"
          fill="none"
          stroke="#2563EB"
          strokeWidth="1"
          opacity="0.15"
        />
        <line
          x1="78%"
          y1="0"
          x2="100%"
          y2="22%"
          stroke="#ffffff"
          strokeWidth="0.7"
          opacity="0.08"
        />
        <line
          x1="86%"
          y1="0"
          x2="100%"
          y2="14%"
          stroke="#ffffff"
          strokeWidth="0.7"
          opacity="0.07"
        />
        <line
          x1="93%"
          y1="0"
          x2="100%"
          y2="7%"
          stroke="#2563EB"
          strokeWidth="0.8"
          opacity="0.12"
        />
      </svg>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="border border-white inline-block px-6 py-2 mb-4">
          <h2 className="text-xl">SERVICES</h2>
        </div>

        <div className="w-full h-px bg-gray-700 mb-4" />

        <div className="mb-6">
          <p className="mb-2 md:text-lg">
            Scale with intelligence, agility, and measurable impact.
            — across every layer.
          </p>
          <p className="md:text-lg ">
            We unify strategy, performance, systems, and day-to-day work into one
            Human-AI assisted,
          </p>
          <p className="md:text-lg font-extrabold bg-gradient-to-r from-blue-600 to-white bg-clip-text text-transparent">
            <Typewriter
              words={[
                "Enterprise-grade Ecosystem: Talent, Marketplace, CRM, Document and Project Manager.",
              ]}
              loop={0}
              typeSpeed={55}
              deleteSpeed={0}
              delaySpeed={3000}
              cursor
              cursorStyle="|"
            />
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
          <ServiceCard
            title="Business Innovation Zone"
            icon="/biz-icon.png"
            coloredLetters={[0, 9, 20]}
            href="/biz"
          />
          <ServiceCard
            title="Human Capital Development"
            icon="/human-capital-icon.png"
            coloredLetters={[0, 6, 14]}
            href="/hcd"
          />
          <ServiceCard
            title="Sustainable Development"
            icon="/sustainable-icon.png"
            coloredLetters={[0, 12]}
            href="/sustainableDev"
          />
          <ServiceCard
            title="Portal"
            icon="/portalLogo.png"
            coloredLetters={[0]}
            href="/portal"
          />
        </div>

      </div>
    </div>
  );
};

export default ServicesSection;
