"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Building2, Users, GraduationCap, Globe } from "lucide-react";

const STATS = [
  { value: 40,     suffix: "+", label: "Enterprise Partners",           sub: "across Africa & beyond",       Icon: Building2,      hex: "#2563EB" },
  { value: 10000,  suffix: "+", label: "Workers Impacted",              sub: "through skills & systems",     Icon: Users,          hex: "#3b82f6" },
  { value: 500,    suffix: "+", label: "Leaders Trained",               sub: "in transformational programs", Icon: GraduationCap,  hex: "#10b981" },
  { value: 20,     suffix: "+", label: "Community Initiatives",         sub: "supported & sustained",        Icon: Globe,          hex: "#a855f7" },
];

function CountUp({ target, suffix, active }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    if (!active) return;
    const duration = 1800;
    const start = performance.now();
    const run = (now) => {
      const pct = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 3);
      setDisplay(Math.round(ease * target));
      if (pct < 1) raf.current = requestAnimationFrame(run);
    };
    raf.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf.current);
  }, [active, target]);

  return (
    <span>
      {display >= 1000 ? `${(display / 1000).toFixed(0)}k` : display}
      {suffix}
    </span>
  );
}

export default function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(null);

  return (
    <div ref={ref} className="relative w-full overflow-hidden">

      {/* Top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#2563EB]/40 to-transparent" />

      <div className="relative bg-[#080808] px-6 py-8">

        {/* Subtle dot grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        {/* Red glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-24 rounded-full bg-[#2563EB]/8 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/6">
          {STATS.map((s, i) => {
            const isHov = hovered === i;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 280, damping: 24 }}
                whileHover={{ backgroundColor: `${s.hex}0c` }}
                whileTap={{ scale: 0.97 }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                className="relative flex flex-col items-center justify-center gap-2 px-6 py-8 bg-[#080808] cursor-default transition-colors duration-200 group"
              >
                {/* Divider glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `linear-gradient(135deg, ${s.hex}10, transparent)` }} />

                {/* Icon */}
                <motion.div
                  animate={isHov
                    ? { scale: 1.15, rotate: 6, boxShadow: `0 0 16px ${s.hex}50` }
                    : { scale: 1, rotate: 0, boxShadow: "none" }}
                  transition={{ type: "spring", stiffness: 400, damping: 16 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-1"
                  style={{ backgroundColor: `${s.hex}18`, border: `1px solid ${s.hex}35` }}
                >
                  <s.Icon className="h-4 w-4" style={{ color: s.hex }} />
                </motion.div>

                {/* Number */}
                <div className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-transparent bg-clip-text"
                  style={{ backgroundImage: `linear-gradient(135deg, ${s.hex}, white)` }}>
                  <CountUp target={s.value} suffix={s.suffix} active={inView} />
                </div>

                {/* Label */}
                <p className="text-white text-xs sm:text-sm font-semibold text-center leading-tight">{s.label}</p>

                {/* Sub label */}
                <p className="text-gray-500 text-[10px] text-center leading-snug">{s.sub}</p>

                {/* Bottom accent bar */}
                <motion.div
                  animate={{ width: isHov ? "40%" : "12px", opacity: isHov ? 1 : 0.4 }}
                  transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full"
                  style={{ backgroundColor: s.hex }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#2563EB]/40 to-transparent" />
    </div>
  );
}
