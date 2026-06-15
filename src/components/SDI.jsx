"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const SpinningGlobe = ({ size = 160 }) => {
  const cx = 100, cy = 72, r = 54;
  const globeBottom = cy + r; // 126

  // 5 hand configs: rotation angle around pivot below globe, skin tone
  const hands = [
    { color: "#3B1A08", rot: -36 },
    { color: "#7B4A2D", rot: -18 },
    { color: "#B07040", rot:   0 },
    { color: "#D4956A", rot:  18 },
    { color: "#FDDBB4", rot:  36 },
  ];

  // pivot point where all hands rotate from (centre-bottom of globe)
  const pivotY = globeBottom + 30;

  return (
    <svg width={size} height={size} viewBox="0 0 200 195" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="gc2">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        <radialGradient id="ocean2" cx="38%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#1e78c8" />
          <stop offset="100%" stopColor="#08234e" />
        </radialGradient>
        <radialGradient id="shine2" cx="32%" cy="26%" r="52%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── Hands beneath globe (drawn first so globe overlaps them) ── */}
      {hands.map(({ color, rot }, i) => (
        <g key={i} transform={`rotate(${rot} ${cx} ${pivotY})`}>
          {/* Wrist / arm stub */}
          <rect x={cx - 7} y={pivotY - 4} width="14" height="20" rx="4" fill={color} />
          {/* Palm (cupped upward, wider) */}
          <rect x={cx - 10} y={globeBottom + 6} width="20" height="14" rx="5" fill={color} />
          {/* 4 fingers pointing UP toward globe */}
          <rect x={cx - 9}  y={globeBottom - 8}  width="4.5" height="16" rx="2.2" fill={color} />
          <rect x={cx - 3.5} y={globeBottom - 11} width="4.5" height="19" rx="2.2" fill={color} />
          <rect x={cx + 2}  y={globeBottom - 11} width="4.5" height="19" rx="2.2" fill={color} />
          <rect x={cx + 7.5} y={globeBottom - 8}  width="4.5" height="16" rx="2.2" fill={color} />
          {/* Thumb angled outward */}
          <rect
            x={cx - 16} y={globeBottom + 8}
            width="4" height="10" rx="2"
            fill={color}
            transform={`rotate(-35 ${cx - 14} ${globeBottom + 13})`}
          />
        </g>
      ))}

      {/* ── Glow rings ── */}
      <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke="#10b981" strokeWidth="1.2" opacity="0.22" />
      <circle cx={cx} cy={cy} r={r + 11} fill="none" stroke="#10b981" strokeWidth="0.7" opacity="0.1" />

      {/* ── Globe ── */}
      <circle cx={cx} cy={cy} r={r} fill="url(#ocean2)" />
      <g clipPath="url(#gc2)">
        {/* Continents */}
        <path d="M98 38 Q114 35 119 54 Q124 74 116 93 Q108 108 98 105 Q86 100 82 83 Q76 62 98 38z" fill="#2e7d32" opacity="0.9" />
        <path d="M76 29 Q89 25 92 38 Q87 47 77 44 Q68 41 76 29z" fill="#388e3c" opacity="0.85" />
        <path d="M116 30 Q142 27 146 46 Q144 61 131 63 Q116 62 113 49z" fill="#2e7d32" opacity="0.85" />
        <path d="M50 52 Q63 46 68 62 Q70 80 63 98 Q53 107 45 92 Q38 73 50 52z" fill="#388e3c" opacity="0.8" />
        <path d="M34 30 Q54 26 58 41 Q56 52 45 54 Q32 51 34 30z" fill="#2e7d32" opacity="0.75" />
        <path d="M138 90 Q152 86 154 97 Q153 107 143 109 Q134 108 133 97z" fill="#388e3c" opacity="0.8" />

        {/* Latitude lines */}
        <line x1={cx-r} y1={cy-26} x2={cx+r} y2={cy-26} stroke="rgba(255,255,255,0.07)" strokeWidth="0.7" />
        <line x1={cx-r} y1={cy}    x2={cx+r} y2={cy}    stroke="rgba(255,255,255,0.09)" strokeWidth="0.9" />
        <line x1={cx-r} y1={cy+26} x2={cx+r} y2={cy+26} stroke="rgba(255,255,255,0.07)" strokeWidth="0.7" />

        {/* Spinning longitudes */}
        <g>
          <animateTransform attributeName="transform" type="rotate"
            from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="9s" repeatCount="indefinite" />
          <ellipse cx={cx} cy={cy} rx="18" ry={r} stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
          <ellipse cx={cx} cy={cy} rx="36" ry={r} stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" />
          <ellipse cx={cx} cy={cy} rx="50" ry={r} stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" />
        </g>
      </g>

      {/* Shine + border */}
      <circle cx={cx} cy={cy} r={r} fill="url(#shine2)" />
      <circle cx={cx} cy={cy} r={r} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

      {/* Ground glow */}
      <ellipse cx={cx} cy={pivotY + 12} rx="38" ry="4" fill="#10b981" opacity="0.15" />
    </svg>
  );
};

const SDI = () => {
  const [showImpact, setShowImpact] = useState(false);

  const toggleImpact = () => setShowImpact((prev) => !prev);

  return (
    <div>
        <div className="relative w-full bg-black text-white overflow-hidden">
          {/* Background Tree Image */}
          <div className="absolute inset-0 opacity-70">
            <Image
              src="/LD4.jpg"
              alt="Tree background"
              layout="fill"
              objectFit="cover"
              quality={100}
              priority
            />
          </div>

          {/* Main content container */}
          <div className="relative z-10 flex flex-col px-4">
            {/* Header section — clicking navigates to the full SD page */}
            <Link href="/sustainableDev" className="block group cursor-pointer">
              <div className="flex items-center justify-between w-full pt-8 pb-6 group-hover:opacity-90 transition-opacity duration-200">
                <div className="flex items-center">
                  {/* Left globe */}
                  <div className="w-1/4 max-w-[140px] flex items-center justify-center">
                    <SpinningGlobe size={120} />
                  </div>

                  {/* Center text content */}
                  <div className="text-center mx-4">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                      <span className="text-emerald-400">S</span>ustainable
                      <span className="text-emerald-400"> D</span>evelopment
                    </h1>

                    <div className="inline-block border border-emerald-400 rounded-xl px-6 py-2 bg-black/60 backdrop-blur-sm">
                      <p className="text-xs md:text-sm">
                        Growing groups to world-class communities with sustainable
                        development
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right globe image - larger size */}
                <div className="w-1/3 max-w-[340px]">
                  <Image
                    src="/sustainable-icon.png"
                    alt="Multiple hands holding globe"
                    width={340}
                    height={340}
                    className="rounded-md"
                  />
                </div>
              </div>
            </Link>

            {/* Empty space for the middle area */}
            <div className="flex-grow"></div>

            {/* Bottom message section */}
            <div className="text-center mb-16 max-w-xl mx-auto">
              <p className="text-base md:text-lg mb-4 text-left">
                We achieved social inclusion, managed healthcare partnerships,
                gender equality...
              </p>

              <button
                onClick={toggleImpact}
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-emerald-400 hover:text-white transition-colors duration-200 group"
              >
                SEE HOW
                <motion.svg
                  animate={{ rotate: showImpact ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </button>
            </div>
          </div>
        </div>

        {/* Impact Section */}
        <AnimatePresence initial={false}>
        {showImpact && (
          <motion.div
            key="impact"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
          <div className="bg-black text-white">
            <main className="container mx-auto px-4 py-12">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-300 mb-16">
                Impact
              </h1>

              <div className="space-y-20">
                {/* Section 1: Job and Wealth Creation */}
                <section className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-1/4 flex-shrink-0">
                    <div className="relative h-48 w-full rounded-lg overflow-hidden">
                      <Image
                        src="/farmers.png"
                        alt="Farmers working together"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="w-full md:w-3/4">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-yellow-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                        </svg>
                      </div>
                      <div className="bg-transparent border border-green-500 text-green-400 px-4 py-2 rounded-md flex-grow">
                        <h2 className="text-xl font-medium">
                          Job and Wealth Creation for Social Cohesion & Economic
                          Recovery
                        </h2>
                      </div>
                    </div>

                    <p className="text-gray-400 mb-4 pl-12">
                      We re-positioned cooperatives to re-set globalization;
                      starting from few groups to communities and nations. By
                      experience, we see job and wealth creation with
                      cooperatives as ...
                    </p>

                    <p className="text-yellow-500 hover:underline cursor-pointer pl-12">
                      Learn how this unique opportunity transformed over 5000
                      cooperatives.
                    </p>
                  </div>
                </section>

                {/* Section 2: Healthcare Partnerships */}
                <section className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-1/4 flex-shrink-0">
                    <div className="relative h-48 w-full rounded-lg overflow-hidden">
                      <Image
                        src="/hospital.png"
                        alt="Hospital room"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="w-full md:w-3/4">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.168 1.168a4 4 0 01-8.094 0l1.168-1.168A3 3 0 009 8.172z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="bg-transparent border border-green-500 text-green-400 px-4 py-2 rounded-md flex-grow">
                        <h2 className="text-xl font-medium">
                          Building Communities on Managed Healthcare
                          Partnerships
                        </h2>
                      </div>
                    </div>

                    <p className="text-gray-400 pl-12">
                      We improved maternal care, child survival and primary
                      healthcare delivery and achieved organizational and
                      financial sustainability among five communities'
                      partnerships-for-health, after USAID's grant withdrawal by
                      Johns Hopkins' University, Centre for Educational
                      Development and Population Activities (CEDPA) and
                      BASICS/Initiatives Virginia.
                    </p>
                  </div>
                </section>

                {/* Section 3: Climate Change */}
                <section className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-1/5 flex-shrink-0">
                    <div className="flex justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13 7H7v6h6V7z" />
                        <path
                          fillRule="evenodd"
                          d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="w-full md:w-2/3">
                    <div className="mb-3">
                      <div className="bg-transparent border border-green-500 text-green-400 px-4 py-2 rounded-md">
                        <h2 className="text-xl font-medium">
                          Combating Climate Change with Renewable Energy
                        </h2>
                      </div>
                    </div>

                    <p className="text-gray-400 mb-4">
                      By building women and youth-led entrepreneurial services
                      clusters around oil-giant Shell’s clean energy assets, we
                      achieved equalization, mediation and peace making in the
                      volatile, conflict-prone Niger Delta communities with
                      environmental remediation and tactical stakeholder
                      engagements.
                    </p>

                    <p className="text-gray-400 hover:underline cursor-pointer">
                      Read more.
                    </p>
                  </div>

                  {/* <div className="w-full md:w-1/4 flex justify-end">
                        <div className="relative h-36 w-36 rounded-full overflow-hidden">
                          <Image 
                          src="/lightbulb.png" 
                            alt="Lightbulb with green plant inside" 
                            layout="fill" 
                            objectFit="cover"
                            className="rounded-full"
                          />
                        </div>
                      </div> */}
                  <div className="w-full md:w-1/4 order-3 md:order-3">
                    <div className="relative h-64 w-full rounded-lg overflow-hidden">
                      <Image
                        src="/lightbulb.png"
                        alt="Lightbulb with green plant inside"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  </div>
                </section>

                {/* Section 4: Digital Divide */}
                <section className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-1/5 flex-shrink-0">
                    <div className="flex justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2">
                    <div className="mb-3">
                      <div className="bg-transparent border border-green-500 text-green-400 px-4 py-2 rounded-md">
                        <h2 className="text-xl font-medium">
                          Bridging the Digital and Generational Divide for
                          Global Partnerships.
                        </h2>
                      </div>
                    </div>

                    <p className="text-gray-400 mb-6">
                      We addressed youth unemployment and bridged the wealth
                      creation gap by: supporting startups, addressing youth
                      unemployability, generating high-growth jobs, and retained
                      local talents through ...
                    </p>

                    <div className="flex items-center">
                      <span className="text-gray-400 text-sm">READ MORE</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="w-full md:w-1/4 flex justify-end">
                    <div className="relative h-64 w-full rounded-lg overflow-hidden">
                      <Image
                        src="/helping-hand.png"
                        alt="Person helping another climb up"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                </section>
              </div>
            </main>
          </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
  );
};

export default SDI;
