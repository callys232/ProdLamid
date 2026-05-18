"use client";

import { Typewriter } from "react-simple-typewriter";
import Link from "next/link";
import Serv from "./Serv";
import AISystemSection from "./aiHero/Aihero";

// Deterministic positions — avoids SSR/client hydration mismatch
const PARTICLES = Array.from({ length: 34 }, (_, i) => {
  const a = (i * 7 + 3) % 97;
  return {
    id: i,
    cx: ((a * 13 + i * 31) % 100).toFixed(1),
    cy: ((a * 17 + i * 23) % 100).toFixed(1),
    r: ((a % 12) / 10 + 0.6).toFixed(1),
    opacity: ((a % 4) / 10 + 0.18).toFixed(2),
    anim: ["fp-a", "fp-b", "fp-c", "fp-d"][i % 4],
    dur: ((a % 8) + 7).toFixed(1),
    del: ((i % 8) * 0.65).toFixed(1),
  };
});

export default function Header() {
  return (
    <>
      <header className="relative w-full bg-black text-white overflow-hidden px-6 md:px-12 flex flex-col md:flex-row items-center justify-between">

        {/* ── Particle keyframes injected once, zero bundle weight ── */}
        <style>{`
          @keyframes fp-a{0%,100%{transform:translate(0,0)}50%{transform:translate(2px,-6px)}}
          @keyframes fp-b{0%,100%{transform:translate(0,0)}50%{transform:translate(-3px,-4px)}}
          @keyframes fp-c{0%,100%{transform:translate(0,0)}50%{transform:translate(1px,-7px)}}
          @keyframes fp-d{0%,100%{transform:translate(0,0)}50%{transform:translate(-2px,-5px)}}
        `}</style>

        {/* Red dotted SVG particle layer */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 w-full h-full z-0 pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          {PARTICLES.map((p) => (
            <circle
              key={p.id}
              cx={`${p.cx}%`}
              cy={`${p.cy}%`}
              r={p.r}
              fill="#C12129"
              fillOpacity={p.opacity}
              style={{ animation: `${p.anim} ${p.dur}s ${p.del}s ease-in-out infinite` }}
            />
          ))}
        </svg>

        {/* ── Left content ── */}
        <div className="w-full md:w-2/3 z-10 pt-20 md:pt-0 text-center md:text-left space-y-5">

          {/* Typewriter headline */}
          <h1 className="whitespace-pre-line text-2xl sm:text-3xl md:text-5xl font-extrabold leading-snug max-w-2xl mx-auto md:mx-0 px-2 font-display text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-white">
            <Typewriter
              words={["Empowering Growth. Digitally."]}
              loop={Infinity}
              typeSpeed={60}
              deleteSpeed={30}
              delaySpeed={1800}
              cursor
              cursorStyle="|"
            />
          </h1>

          {/* Paragraph */}
          <p className="mt-12 text-slate-300 text-base sm:text-lg font-light tracking-wide max-w-lg mx-auto md:mx-0 px-2 leading-8">
            LAMID unifies strategy, performance, systems, and seamless work into one AIenabled, marketplacedriven, enterprisegrade ecosystem.

          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-start px-2 mt-12 pb-8 md:pb-0">

            {/* Primary — filled gradient + glow */}
            <Link
              href="/biz"
              className="group relative inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-black text-sm overflow-hidden
                transition-all duration-300 ease-out
                bg-gradient-to-br from-zinc-100 via-rose-400 to-[#C12129]
                shadow-[0_0_18px_rgba(193,33,41,0.55)]
                hover:shadow-[0_0_32px_rgba(193,33,41,0.9)]
                hover:scale-105 active:scale-95"
            >
              {/* Shine sweep on hover */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" />
              <span className="relative z-10">Get Started</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>

            {/* Secondary — gradient border, fills on hover, smooth scrolls to services */}
            <button
              onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
              className="group relative inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm
                transition-all duration-300 ease-out cursor-pointer
                text-red-400 hover:text-white
                shadow-[0_0_12px_rgba(193,33,41,0.25)]
                hover:shadow-[0_0_26px_rgba(193,33,41,0.65)]
                hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(#000,#000) padding-box, linear-gradient(135deg,#C12129,#ff6b6b) border-box",
                border: "2px solid transparent",
              }}
            >
              {/* Fill overlay on hover */}
              <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-red-800 via-red-600 to-rose-500 pointer-events-none" />
              <span className="relative z-10">Explore Services</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>

          </div>
        </div>

        {/* ── Right — Serv cards ── */}
        <div className="w-full md:w-1/3 flex justify-end items-center mt-10 md:mt-0 z-10">
          <Serv />
        </div>

      </header>
      <AISystemSection />
    </>
  );
}
