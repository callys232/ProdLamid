"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

/* ─── Curly Animated Arrow ───────────────────────────────────────────────── */

function CurlyArrow({ color, delay = 0, rotate = 0 }: { color: string; delay?: number; rotate?: number }) {
  return (
    <motion.svg
      width="22" height="58" viewBox="0 0 22 58" fill="none"
      style={{ rotate }}
      animate={{ opacity: [0.2, 1, 0.2] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <path
        d="M11 3 C20 11, 2 20, 11 29 C20 38, 2 47, 11 53"
        stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"
      />
      <path
        d="M6 47 L11 55 L16 47"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    </motion.svg>
  );
}

/* ─── Icon SVGs ──────────────────────────────────────────────────────────── */

function HierarchyIcon() {
  return (
    <svg viewBox="0 0 36 36" fill="none" width="26" height="26">
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
    <svg viewBox="0 0 44 32" fill="none" width="30" height="22">
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
    <svg viewBox="0 0 32 40" fill="none" width="22" height="28">
      <path d="M16 2C9.4 2 4 7.4 4 14c0 4.8 2.7 9 6.7 11.1l.8.9V28h9v-2l.8-.9C25.3 23 28 18.8 28 14 28 7.4 22.6 2 16 2z" fill="white" />
      <rect x="10.5" y="29.5" width="11" height="2.5" rx="1.25" fill="white" />
      <rect x="11.5" y="33" width="9" height="2.5" rx="1.25" fill="white" />
      <rect x="13" y="36.5" width="6" height="2" rx="1" fill="white" />
    </svg>
  );
}

function MegaphoneIcon() {
  return (
    <svg viewBox="0 0 42 34" fill="none" width="30" height="24">
      <path d="M4 12v10h6l14 8V4L10 12H4z" fill="white" />
      <path d="M30 14s3.5 2.5 3.5 5.5-3.5 5.5-3.5 5.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M34 10s6 4 6 9-6 9-6 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.65" />
    </svg>
  );
}

function GlobIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" width="26" height="26">
      <circle cx="16" cy="16" r="13" stroke="white" strokeWidth="2" fill="none" />
      <ellipse cx="16" cy="16" rx="6" ry="13" stroke="white" strokeWidth="1.5" fill="none" />
      <line x1="3" y1="16" x2="29" y2="16" stroke="white" strokeWidth="1.5" />
      <line x1="16" y1="3" x2="16" y2="29" stroke="white" strokeWidth="1.5" />
    </svg>
  );
}

/* ─── Icon Circle ────────────────────────────────────────────────────────── */

type IconKey = "hierarchy" | "people" | "lightbulb" | "megaphone" | "globe";

function IconCircle({ bg, glow, icon }: { bg: string; glow: string; icon: IconKey }) {
  return (
    <div
      className="w-[50px] h-[50px] rounded-full flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: bg, boxShadow: `0 0 14px ${glow}55, 0 0 5px ${glow}80` }}
    >
      {icon === "hierarchy"  && <HierarchyIcon />}
      {icon === "people"     && <PeopleGroupIcon />}
      {icon === "lightbulb"  && <LightbulbIcon />}
      {icon === "megaphone"  && <MegaphoneIcon />}
      {icon === "globe"      && <GlobIcon />}
    </div>
  );
}

function GrayOval({ className = "" }: { className?: string }) {
  return <div className={`rounded-full bg-gray-500/30 border border-gray-400/18 flex-shrink-0 ${className}`} />;
}

/* ─── PCB Background ─────────────────────────────────────────────────────── */

function PCBBackground() {
  const tc = "#16395c";
  const nc = "#1e4a72";
  const ns = "#244f7a";

  const nodes: [number, number][] = [
    [100,60],[220,60],[380,60],[540,30],[680,60],[860,45],[980,60],[1140,60],[1300,60],
    [180,90],[360,120],[500,100],[720,120],[900,95],[1080,120],[1260,105],
    [90,210],[200,240],[400,220],[600,240],[760,215],[980,240],[1100,220],[1340,240],
    [150,360],[320,380],[520,350],[700,380],[900,355],[1100,380],[1280,365],
    [200,420],[440,440],[650,415],[850,440],[1050,430],[1280,440],
    [540,0],[860,0],[220,0],[320,240],[700,240],[1100,240],[440,380],[850,380],
  ];

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1440 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="pcb-glow-a" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.9" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <filter id="pcb-blur"><feGaussianBlur stdDeviation="14" /></filter>
        <linearGradient id="pcb-shine" x1="0%" y1="0%" x2="75%" y2="100%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="45%" stopColor="white" stopOpacity="0.03" />
          <stop offset="55%" stopColor="white" stopOpacity="0.07" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <rect width="1440" height="480" fill="#071c2e" />
      <rect width="1440" height="480" fill="url(#pcb-shine)" />
      <path d="M0 60 H100 V40 H220 V60 H380 V30 H540 V60 H680 V45 H860 V60 H980 V35 H1140 V60 H1300 V50 H1440" stroke={tc} strokeWidth="1.5" fill="none" opacity="0.85" />
      <path d="M0 120 H180 V90 H360 V120 H500 V100 H720 V120 H900 V95 H1080 V120 H1260 V105 H1440" stroke={tc} strokeWidth="1.5" fill="none" opacity="0.85" />
      <path d="M0 240 H90 V210 H200 V240 H400 V220 H600 V240 H760 V215 H980 V240 H1100 V220 H1340 V240 H1440" stroke={tc} strokeWidth="1.5" fill="none" opacity="0.85" />
      <path d="M0 380 H150 V360 H320 V380 H520 V350 H700 V380 H900 V355 H1100 V380 H1280 V365 H1440" stroke={tc} strokeWidth="1.5" fill="none" opacity="0.85" />
      <path d="M0 440 H200 V420 H440 V440 H650 V415 H850 V440 H1050 V430 H1280 V440 H1440" stroke={tc} strokeWidth="1.5" fill="none" opacity="0.85" />
      <line x1="220" y1="40" x2="220" y2="0" stroke={tc} strokeWidth="1.5" opacity="0.6" />
      <line x1="540" y1="30" x2="540" y2="0" stroke={tc} strokeWidth="1.5" opacity="0.6" />
      <line x1="860" y1="45" x2="860" y2="0" stroke={tc} strokeWidth="1.5" opacity="0.6" />
      <line x1="200" y1="210" x2="200" y2="120" stroke={tc} strokeWidth="1.5" opacity="0.75" />
      <line x1="600" y1="220" x2="600" y2="120" stroke={tc} strokeWidth="1.5" opacity="0.75" />
      <line x1="320" y1="360" x2="320" y2="240" stroke={tc} strokeWidth="1.5" opacity="0.75" />
      <line x1="700" y1="350" x2="700" y2="240" stroke={tc} strokeWidth="1.5" opacity="0.75" />
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill={nc} stroke={ns} strokeWidth="0.8" />
      ))}
      <circle cx="380" cy="210" r="22" fill="white" opacity="0.1" filter="url(#pcb-blur)" />
      <circle cx="380" cy="210" r="5" fill="white" opacity="0.7" />
      <circle cx="380" cy="210" r="2.5" fill="white" />
      <circle cx="1000" cy="155" r="22" fill="white" opacity="0.1" filter="url(#pcb-blur)" />
      <circle cx="1000" cy="155" r="5" fill="white" opacity="0.65" />
      <circle cx="1000" cy="155" r="2.5" fill="white" />
    </svg>
  );
}

/* ─── Card ───────────────────────────────────────────────────────────────── */

function Card({
  children, borderCls, glowColor, index, href, onClick,
}: {
  children: ReactNode;
  borderCls: string;
  glowColor?: string;
  index: number;
  href: string;
  onClick: (href: string) => void;
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
      whileHover={{ y: -4, scale: 1.03, backgroundColor: "rgba(30, 55, 90, 0.88)" }}
      onClick={() => onClick(href)}
      className={`relative w-full h-[240px] sm:h-[260px] md:h-[285px] rounded-2xl ${borderCls} bg-[#0b1e30]/60 backdrop-blur-sm flex flex-col overflow-hidden cursor-pointer`}
      style={glowColor ? { boxShadow: `0 0 18px ${glowColor}28` } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Tag label ──────────────────────────────────────────────────────────── */

function Tag({ text, color = "text-white" }: { text: string; color?: string }) {
  return (
    <p className={`text-[10px] font-bold text-center leading-tight px-1.5 ${color}`}>
      {text}
    </p>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */

export default function StartupEcosystemBoard() {
  const router = useRouter();
  const go = (href: string) => router.push(href);

  return (
    <section className="relative overflow-hidden py-5 px-2 md:px-4">
      <PCBBackground />

      <div className="relative z-10 w-full">
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-2">

          {/* 1 · Viable Opportunities — icon TOP */}
          <Card index={0} borderCls="border border-violet-600/70" glowColor="#7c3aed" href="/biz" onClick={go}>
            <div className="flex flex-col justify-between items-center h-full p-3">
              <IconCircle bg="#7c3aed" glow="#7c3aed" icon="hierarchy" />
              <Tag text="Viable opportunities" color="text-violet-300" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <CurlyArrow color="#a78bfa" delay={0} rotate={180} />
            </div>
          </Card>

          {/* 2 · State-of-the-art structures — icon BOTTOM */}
          <Card index={1} borderCls="border border-gray-500/35" href="/portal" onClick={go}>
            <div className="flex flex-col justify-between items-center h-full p-3">
              <Tag text="State-of-the-art structures & systems" />
              <GrayOval className="w-[52px] h-[52px]" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <CurlyArrow color="#9ca3af" delay={0.4} />
            </div>
          </Card>

          {/* 3 · Mentoring Strategy — icon TOP */}
          <Card index={2} borderCls="border border-cyan-400/70" glowColor="#06b6d4" href="/hcd" onClick={go}>
            <div className="flex flex-col justify-between items-center h-full p-3">
              <IconCircle bg="#0891b2" glow="#06b6d4" icon="people" />
              <Tag text="Mentoring Strategy" color="text-cyan-300" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <CurlyArrow color="#22d3ee" delay={0.8} rotate={180} />
            </div>
          </Card>

          {/* 4 · Minimum Viable Prototype — icon BOTTOM */}
          <Card index={3} borderCls="border border-blue-500/70" glowColor="#dc2626" href="/biz" onClick={go}>
            <div className="flex flex-col justify-between items-center h-full p-3">
              <Tag text="Minimum viable Prototype & Model" color="text-blue-300" />
              <IconCircle bg="#dc2626" glow="#2563EB" icon="lightbulb" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <CurlyArrow color="#f87171" delay={1.2} />
            </div>
          </Card>

          {/* 5 · Top-of-market talent — icon TOP */}
          <Card index={4} borderCls="border border-orange-500/70" glowColor="#f97316" href="/hcd/recruitment" onClick={go}>
            <div className="flex flex-col justify-between items-center h-full p-3">
              <IconCircle bg="#ea580c" glow="#f97316" icon="people" />
              <Tag text="Top-of-market talent services" color="text-orange-300" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <CurlyArrow color="#fb923c" delay={1.6} rotate={180} />
            </div>
          </Card>

          {/* 6 · Joint Ventures — icon BOTTOM */}
          <Card index={5} borderCls="border border-teal-500/40" glowColor="#14b8a6" href="/contact" onClick={go}>
            <div className="flex flex-col justify-between items-center h-full p-3">
              <Tag text="Joint Ventures" color="text-teal-300" />
              <IconCircle bg="#0d9488" glow="#14b8a6" icon="megaphone" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <CurlyArrow color="#2dd4bf" delay={2.0} />
            </div>
          </Card>

          {/* 7 · State-of-the-art (2) — icon TOP */}
          <Card index={6} borderCls="border border-gray-500/35" href="/biz" onClick={go}>
            <div className="flex flex-col justify-between items-center h-full p-3">
              <GrayOval className="w-[52px] h-[52px]" />
              <Tag text="State-of-the-art structures & systems" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <CurlyArrow color="#9ca3af" delay={2.4} rotate={180} />
            </div>
          </Card>

          {/* 8 · Global Access — icon BOTTOM */}
          <Card index={7} borderCls="border border-emerald-500/40" glowColor="#10b981" href="/sustainableDev" onClick={go}>
            <div className="flex flex-col justify-between items-center h-full p-3">
              <Tag text="Global Access" color="text-emerald-300" />
              <IconCircle bg="#059669" glow="#10b981" icon="globe" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <CurlyArrow color="#34d399" delay={2.8} />
            </div>
          </Card>

        </div>

        {/* Bottom tagline */}
        <>
          <style>{`
            @keyframes esb-shift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
            @keyframes esb-blink{0%,100%{opacity:1}50%{opacity:0.55}}
            @keyframes esb-dot{0%,100%{box-shadow:0 0 4px rgba(194,18,25,0.9)}50%{box-shadow:0 0 14px rgba(251,113,133,1)}}
            .esb-caption{background:linear-gradient(270deg,#2563EB,#f43f5e,#fb923c,#a78bfa,#34d399,#60a5fa,#f43f5e,#2563EB);background-size:400% 400%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:esb-shift 6s ease-in-out infinite,esb-blink 3.5s ease-in-out infinite}
            .esb-dot{animation:esb-dot 2s ease-in-out infinite}
          `}</style>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.85 }}
            className="flex justify-center mt-6"
          >
            <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full cursor-default select-none border border-[#2563EB]/25 bg-[#2563EB]/5">
              <span className="esb-dot w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#2563EB]" />
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
