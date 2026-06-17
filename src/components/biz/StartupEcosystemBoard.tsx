"use client";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

/* ─── Icon SVGs ──────────────────────────────────────────────────────────── */

function HierarchyIcon() {
  return (
    <svg viewBox="0 0 36 36" fill="none" width="28" height="28">
      <circle cx="18" cy="6" r="5" fill="white" />
      <rect x="16.5" y="11" width="3" height="6" rx="1.5" fill="white" />
      <rect x="5" y="17" width="26" height="2.5" rx="1.25" fill="white" />
      <rect x="5.5" y="19.5" width="3" height="5.5" rx="1.5" fill="white" />
      <rect x="27.5" y="19.5" width="3" height="5.5" rx="1.5" fill="white" />
      <circle cx="7" cy="29" r="4.5" fill="white" />
      <circle cx="29" cy="29" r="4.5" fill="white" />
    </svg>
  );
}

function PeopleGroupIcon() {
  return (
    <svg viewBox="0 0 44 32" fill="none" width="34" height="26">
      <circle cx="22" cy="7" r="6.5" fill="white" />
      <path d="M11 32c0-6 5-11 11-11s11 5 11 11z" fill="white" />
      <circle cx="7" cy="11" r="5" fill="white" opacity="0.85" />
      <path d="M0 32c0-4.4 3.1-8 7-9" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.85" />
      <circle cx="37" cy="11" r="5" fill="white" opacity="0.85" />
      <path d="M44 32c0-4.4-3.1-8-7-9" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.85" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg viewBox="0 0 32 40" fill="none" width="26" height="32">
      <path d="M16 2C9.4 2 4 7.4 4 14c0 4.8 2.7 9 6.7 11.1l.8.9V28h9v-2l.8-.9C25.3 23 28 18.8 28 14 28 7.4 22.6 2 16 2z" fill="white" />
      <rect x="10.5" y="29.5" width="11" height="2.5" rx="1.25" fill="white" />
      <rect x="11.5" y="33" width="9" height="2.5" rx="1.25" fill="white" />
      <rect x="13" y="36.5" width="6" height="2" rx="1" fill="white" />
    </svg>
  );
}

function MegaphoneIcon() {
  return (
    <svg viewBox="0 0 42 34" fill="none" width="34" height="28">
      <path d="M4 12v10h6l14 8V4L10 12H4z" fill="white" />
      <path d="M30 14s3.5 2.5 3.5 5.5-3.5 5.5-3.5 5.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M34 10s6 4 6 9-6 9-6 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.65" />
    </svg>
  );
}

/* ─── Arrow Components ───────────────────────────────────────────────────── */

function ArrowSingle({ color, h = 52 }: { color: string; h?: number }) {
  return (
    <svg width="16" height={h} viewBox={`0 0 16 ${h}`} fill="none">
      <line x1="8" y1="2" x2="8" y2={h - 8} stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <path d={`M3 ${h - 14} L8 ${h - 2} L13 ${h - 14}`}
        stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function ArrowBi({ color, h = 64 }: { color: string; h?: number }) {
  const mid = Math.floor(h / 2);
  return (
    <svg width="16" height={h} viewBox={`0 0 16 ${h}`} fill="none">
      <path d={`M3 13 L8 2 L13 13`}
        stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="8" y1="2" x2="8" y2={mid} stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="8" y1={mid} x2="8" y2={h - 10} stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <path d={`M3 ${h - 21} L8 ${h - 9} L13 ${h - 21}`}
        stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* ─── Colored Icon Circle ────────────────────────────────────────────────── */

type IconKey = "hierarchy" | "people" | "lightbulb" | "megaphone";

function IconCircle({ bg, glow, icon }: { bg: string; glow: string; icon: IconKey }) {
  return (
    <div
      className="w-[56px] h-[56px] rounded-full flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: bg, boxShadow: `0 0 16px ${glow}55, 0 0 6px ${glow}80` }}
    >
      {icon === "hierarchy" && <HierarchyIcon />}
      {icon === "people"    && <PeopleGroupIcon />}
      {icon === "lightbulb" && <LightbulbIcon />}
      {icon === "megaphone" && <MegaphoneIcon />}
    </div>
  );
}

/* ─── Oval / Circle Placeholder ─────────────────────────────────────────── */

function GrayOval({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-full bg-gray-500/30 border border-gray-400/18 flex-shrink-0 ${className}`} />
  );
}

function GrayCircle({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-full bg-gray-500/30 border border-gray-400/18 flex-shrink-0 ${className}`} />
  );
}

/* ─── PCB Circuit Board Background ──────────────────────────────────────── */

function PCBBackground() {
  const tc = "#16395c";   /* trace color */
  const nc = "#1e4a72";   /* node/pad color */
  const ns = "#244f7a";   /* node stroke */

  const nodes: [number, number][] = [
    [100, 60], [220, 60], [380, 60], [540, 30], [680, 60], [860, 45], [980, 60], [1140, 60], [1300, 60],
    [180, 90], [360, 120], [500, 100], [720, 120], [900, 95], [1080, 120], [1260, 105],
    [90, 210], [200, 240], [400, 220], [600, 240], [760, 215], [980, 240], [1100, 220], [1340, 240],
    [150, 360], [320, 380], [520, 350], [700, 380], [900, 355], [1100, 380], [1280, 365],
    [200, 420], [440, 440], [650, 415], [850, 440], [1050, 430], [1280, 440],
    [540, 0], [860, 0], [220, 0],
    [320, 240], [700, 240], [1100, 240],
    [440, 380], [850, 380],
  ];

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1440 480"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="pcb-glow-a" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.9" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <filter id="pcb-blur">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <linearGradient id="pcb-shine" x1="0%" y1="0%" x2="75%" y2="100%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="45%" stopColor="white" stopOpacity="0.03" />
          <stop offset="55%" stopColor="white" stopOpacity="0.07" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>

      {/* Base */}
      <rect width="1440" height="480" fill="#071c2e" />
      {/* Diagonal shine */}
      <rect width="1440" height="480" fill="url(#pcb-shine)" />

      {/* ── Top tier traces ── */}
      <path d="M0 60 H100 V40 H220 V60 H380 V30 H540 V60 H680 V45 H860 V60 H980 V35 H1140 V60 H1300 V50 H1440"
        stroke={tc} strokeWidth="1.5" fill="none" opacity="0.85" />
      <path d="M0 120 H180 V90 H360 V120 H500 V100 H720 V120 H900 V95 H1080 V120 H1260 V105 H1440"
        stroke={tc} strokeWidth="1.5" fill="none" opacity="0.85" />

      {/* ── Mid traces ── */}
      <path d="M0 240 H90 V210 H200 V240 H400 V220 H600 V240 H760 V215 H980 V240 H1100 V220 H1340 V240 H1440"
        stroke={tc} strokeWidth="1.5" fill="none" opacity="0.85" />

      {/* ── Bottom tier traces ── */}
      <path d="M0 380 H150 V360 H320 V380 H520 V350 H700 V380 H900 V355 H1100 V380 H1280 V365 H1440"
        stroke={tc} strokeWidth="1.5" fill="none" opacity="0.85" />
      <path d="M0 440 H200 V420 H440 V440 H650 V415 H850 V440 H1050 V430 H1280 V440 H1440"
        stroke={tc} strokeWidth="1.5" fill="none" opacity="0.85" />

      {/* ── Vertical connectors ── */}
      <line x1="220" y1="40" x2="220" y2="0" stroke={tc} strokeWidth="1.5" opacity="0.6" />
      <line x1="540" y1="30" x2="540" y2="0" stroke={tc} strokeWidth="1.5" opacity="0.6" />
      <line x1="860" y1="45" x2="860" y2="0" stroke={tc} strokeWidth="1.5" opacity="0.6" />
      <line x1="180" y1="90" x2="180" y2="60" stroke={tc} strokeWidth="1.5" opacity="0.75" />
      <line x1="500" y1="100" x2="500" y2="60" stroke={tc} strokeWidth="1.5" opacity="0.75" />
      <line x1="1080" y1="95" x2="1080" y2="60" stroke={tc} strokeWidth="1.5" opacity="0.75" />
      <line x1="200" y1="210" x2="200" y2="120" stroke={tc} strokeWidth="1.5" opacity="0.75" />
      <line x1="600" y1="220" x2="600" y2="120" stroke={tc} strokeWidth="1.5" opacity="0.75" />
      <line x1="1340" y1="220" x2="1340" y2="120" stroke={tc} strokeWidth="1.5" opacity="0.75" />
      <line x1="320" y1="360" x2="320" y2="240" stroke={tc} strokeWidth="1.5" opacity="0.75" />
      <line x1="700" y1="350" x2="700" y2="240" stroke={tc} strokeWidth="1.5" opacity="0.75" />
      <line x1="1100" y1="355" x2="1100" y2="240" stroke={tc} strokeWidth="1.5" opacity="0.75" />
      <line x1="440" y1="420" x2="440" y2="380" stroke={tc} strokeWidth="1.5" opacity="0.75" />
      <line x1="850" y1="415" x2="850" y2="380" stroke={tc} strokeWidth="1.5" opacity="0.75" />
      <line x1="1280" y1="430" x2="1280" y2="380" stroke={tc} strokeWidth="1.5" opacity="0.75" />
      <line x1="320" y1="480" x2="320" y2="380" stroke={tc} strokeWidth="1.5" opacity="0.55" />
      <line x1="800" y1="480" x2="800" y2="380" stroke={tc} strokeWidth="1.5" opacity="0.55" />

      {/* ── Diagonal accents ── */}
      <line x1="680" y1="120" x2="760" y2="180" stroke={tc} strokeWidth="1.5" opacity="0.5" />
      <line x1="380" y1="300" x2="440" y2="360" stroke={tc} strokeWidth="1.5" opacity="0.5" />
      <line x1="1050" y1="160" x2="1100" y2="220" stroke={tc} strokeWidth="1.5" opacity="0.5" />

      {/* ── Junction pads ── */}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill={nc} stroke={ns} strokeWidth="0.8" />
      ))}

      {/* ── Bright glow nodes ── */}
      <circle cx="380" cy="210" r="22" fill="white" opacity="0.1" filter="url(#pcb-blur)" />
      <circle cx="380" cy="210" r="5"  fill="white" opacity="0.7" />
      <circle cx="380" cy="210" r="2.5" fill="white" />

      <circle cx="1000" cy="155" r="22" fill="white" opacity="0.1" filter="url(#pcb-blur)" />
      <circle cx="1000" cy="155" r="5"  fill="white" opacity="0.65" />
      <circle cx="1000" cy="155" r="2.5" fill="white" />

      <circle cx="640" cy="355" r="16" fill="white" opacity="0.08" filter="url(#pcb-blur)" />
      <circle cx="640" cy="355" r="4"  fill="white" opacity="0.45" />
    </svg>
  );
}

/* ─── Card wrapper helper ────────────────────────────────────────────────── */

function Card({
  children, borderCls, glowColor, index,
}: {
  children: ReactNode;
  borderCls: string;
  glowColor?: string;
  index: number;
}) {
  return (
    <motion.div
      custom={index}
      variants={{
        hidden: { opacity: 0, y: 22 },
        show: (i: number) => ({
          opacity: 1, y: 0,
          transition: { delay: i * 0.09, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        }),
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className={`relative w-full h-[240px] sm:h-[260px] md:h-[285px] rounded-2xl ${borderCls} bg-[#0b1e30]/60 backdrop-blur-sm flex flex-col overflow-hidden`}
      style={glowColor ? { boxShadow: `0 0 18px ${glowColor}28` } : undefined}
    >
      {children}
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

export default function StartupEcosystemBoard() {
  return (
    <section className="relative overflow-hidden py-5 px-2 md:px-4">
      <PCBBackground />

      <div className="relative z-10 w-full">
        {/* 4-per-row mobile → 8-per-row desktop, no scroll */}
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-2">

          {/* ── Card 1 · Viable Opportunities (Purple) ── */}
          <Card index={0} borderCls="border border-violet-600/70" glowColor="#7c3aed">
            <div className="flex flex-col h-full p-2">
              {/* Icon */}
              <div className="flex justify-center mt-1">
                <IconCircle bg="#7c3aed" glow="#7c3aed" icon="hierarchy" />
              </div>

              {/* Arrow + oval row */}
              <div className="flex items-center gap-1.5 flex-1 py-1.5 px-0.5">
                <ArrowBi color="#a78bfa" h={48} />
                <GrayOval className="w-full h-[46px]" />
              </div>

              {/* Text */}
              <p className="text-white text-[11px] font-bold text-center leading-tight pb-1">
                Viable opportunities
              </p>
            </div>
          </Card>

          {/* ── Card 2 · State-of-the-art structures (Gray) ── */}
          <Card index={1} borderCls="border border-gray-500/35">
            <div className="flex flex-col h-full p-2">
              {/* Text top */}
              <p className="text-white text-[11px] font-bold text-center leading-snug pt-1">
                State-of -the art<br />structures &amp; systems
              </p>

              {/* Large oval */}
              <div className="flex-1 flex items-center justify-center py-2">
                <GrayOval className="w-[82%] h-[66px]" />
              </div>

              {/* Arrow right — absolutely positioned */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <ArrowSingle color="#9ca3af" h={44} />
              </div>
            </div>
          </Card>

          {/* ── Card 3 · Mentoring Strategy (Cyan) ── */}
          <Card index={2} borderCls="border border-cyan-400/70" glowColor="#06b6d4">
            <div className="flex flex-col h-full p-2">
              {/* Icon */}
              <div className="flex justify-center mt-1">
                <IconCircle bg="#0891b2" glow="#06b6d4" icon="people" />
              </div>

              {/* Arrow right */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <ArrowSingle color="#22d3ee" h={44} />
              </div>

              {/* Text bottom */}
              <p className="text-white text-[11px] font-bold text-center leading-tight mt-auto pb-1">
                Mentoring Strategy
              </p>
            </div>
          </Card>

          {/* ── Card 4 · Minimum Viable Prototype (Red) ── */}
          <Card index={3} borderCls="border border-red-500/70" glowColor="#dc2626">
            <div className="flex flex-col h-full p-2">
              {/* Text top */}
              <p className="text-white text-[11px] font-bold text-center leading-snug pt-1">
                Minimum viable<br />Prototype &amp; Model
              </p>

              {/* Arrow right */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <ArrowBi color="#f87171" h={52} />
              </div>

              {/* Icon bottom */}
              <div className="flex justify-center mt-auto mb-2">
                <IconCircle bg="#dc2626" glow="#ef4444" icon="lightbulb" />
              </div>
            </div>
          </Card>

          {/* ── Card 5 · Top-of-market talent (Orange) ── */}
          <Card index={4} borderCls="border border-orange-500/70" glowColor="#f97316">
            <div className="flex flex-col h-full p-2">
              {/* Icon */}
              <div className="flex justify-center mt-1">
                <IconCircle bg="#ea580c" glow="#f97316" icon="people" />
              </div>

              {/* Arrow right */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <ArrowSingle color="#fb923c" h={44} />
              </div>

              {/* Text bottom */}
              <p className="text-white text-[11px] font-bold text-center leading-tight mt-auto pb-1">
                Top-of-market talent<br />services
              </p>
            </div>
          </Card>

          {/* ── Card 6 · Joint Ventures (Dark border, Teal icon) ── */}
          <Card index={5} borderCls="border border-gray-500/35">
            <div className="flex flex-col h-full p-2">
              {/* Text top */}
              <p className="text-white text-[11px] font-bold text-center leading-snug pt-1">
                Joint Ventures
              </p>

              {/* Arrow right */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <ArrowBi color="#2dd4bf" h={52} />
              </div>

              {/* Teal megaphone icon bottom */}
              <div className="flex justify-center mt-auto mb-2">
                <IconCircle bg="#0d9488" glow="#14b8a6" icon="megaphone" />
              </div>
            </div>
          </Card>

          {/* ── Card 7 · State-of-the-art (Gray circle top) ── */}
          <Card index={6} borderCls="border border-gray-500/35">
            <div className="flex flex-col h-full p-2">
              {/* Gray circle placeholder */}
              <div className="flex justify-center mt-1">
                <GrayCircle className="w-[54px] h-[54px]" />
              </div>

              {/* Arrow right */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <ArrowBi color="#9ca3af" h={52} />
              </div>

              {/* Text bottom */}
              <p className="text-white text-[11px] font-bold text-center leading-snug mt-auto pb-1">
                State-of -the art<br />structures &amp; systems
              </p>
            </div>
          </Card>

          {/* ── Card 8 · Global Access (Dark border) ── */}
          <Card index={7} borderCls="border border-gray-600/45">
            <div className="flex flex-col h-full p-2">
              {/* Text top */}
              <p className="text-white text-[11px] font-bold text-center leading-snug pt-1">
                Global Access
              </p>

              {/* Teal arrow — bottom right */}
              <div className="mt-auto mb-3 flex justify-end pr-1">
                <ArrowSingle color="#2dd4bf" h={44} />
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom tagline — EcosystemTag design language */}
        <>
          <style>{`
            @keyframes esb-shift {
              0%   { background-position: 0% 50%; }
              50%  { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            @keyframes esb-blink {
              0%, 100% { opacity: 1; }
              50%       { opacity: 0.55; }
            }
            @keyframes esb-dot {
              0%, 100% { box-shadow: 0 0 4px rgba(194,18,25,0.9); }
              50%       { box-shadow: 0 0 14px rgba(251,113,133,1); }
            }
            .esb-caption {
              background: linear-gradient(
                270deg,
                #c21219, #f43f5e, #fb923c, #a78bfa, #34d399, #60a5fa, #f43f5e, #c21219
              );
              background-size: 400% 400%;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              animation: esb-shift 6s ease-in-out infinite, esb-blink 3.5s ease-in-out infinite;
            }
            .esb-dot { animation: esb-dot 2s ease-in-out infinite; }
          `}</style>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.85 }}
            className="flex justify-center mt-6"
          >
            <span
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full cursor-default select-none border border-[#c21219]/25 bg-[#c21219]/5"
            >
              <span className="esb-dot w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#c21219]" />
              <span className="esb-caption text-xs sm:text-sm font-semibold tracking-wide">
                Over 3000 start-ups created and accelerated. Be the next raving success!
              </span>
            </span>
          </motion.div>
        </>
      </div>
    </section>
  );
}
