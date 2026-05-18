"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/* ── Mosaic card data — color tied to parent service ── */
const MOSAIC = [
  // Row 1 — BIZ wide · HCD · SD
  { title: "Process Transformation",  desc: "Redesign workflows to eliminate friction and unlock speed.",        label: "Best", icon: "/rocket-icon.png", href: "/biz",            hex: "#3b82f6", span: "md:col-span-2", h: "h-36" },
  { title: "Talent Sourcing",         desc: "Connect with vetted experts matched precisely to your needs.",      label: "HCD",  icon: "/people-icon.png", href: "/hcd",            hex: "#f59e0b", span: "md:col-span-1", h: "h-36" },
  { title: "Sustainable Development", desc: "Build long-term impact through responsible growth frameworks.",     label: "SD",   icon: "/rocket-icon.png", href: "/sustainableDev", hex: "#10b981", span: "md:col-span-1", h: "h-36" },
  // Row 2 — HCD · BIZ · BIZ wide
  { title: "HR, Training & Support",  desc: "Develop people, build capability, and future-proof your teams.",   label: "HCD",  icon: "/rocket-icon.png", href: "/hcd",            hex: "#f97316", span: "md:col-span-1", h: "h-36" },
  { title: "Digital Transformation",  desc: "Modernize systems and operations with intelligent technology.",     label: "BIZ",  icon: "/chart-icon.png",  href: "/biz",            hex: "#2563eb", span: "md:col-span-1", h: "h-36" },
  { title: "Innovation Consulting",   desc: "Turn ideas into market-ready solutions with guided strategy.",      label: "BIZ",  icon: "/rocket-icon.png", href: "/biz",            hex: "#6366f1", span: "md:col-span-2", h: "h-36" },
  // Row 3 — SD wide · BIZ wide
  { title: "Management Solutions",    desc: "Strengthen leadership, governance, and operational performance.",   label: "SD",   icon: "/rocket-icon.png", href: "/sustainableDev", hex: "#059669", span: "md:col-span-2", h: "h-36" },
  { title: "Strategy Development",    desc: "Align vision, execution, and resources for competitive advantage.", label: "BIZ",  icon: "/rocket-icon.png", href: "/biz",            hex: "#4f46e5", span: "md:col-span-2", h: "h-36" },
];

const PORTAL = [
  { title: "Business Portal", sub: "For organizations & clients", icon: "/portalLogo.png", href: "/portal", hex: "#c21219" },
  { title: "Expert Portal",   sub: "For consultants & talent",    icon: "/portalLogo.png", href: "/portal", hex: "#9f1239" },
];

const MosaicCard = ({ title, desc, label, icon, href, hex, span, h, index }) => (
  <Link href={href} className={`${span} col-span-1`}>
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 24 }}
      whileHover={{ y: -5, boxShadow: `0 16px 40px ${hex}40` }}
      whileTap={{ scale: 0.97 }}
      className={`group relative flex flex-col justify-between p-5 rounded-2xl overflow-hidden cursor-pointer ${h} w-full`}
      style={{ border: `1px solid ${hex}35`, background: `linear-gradient(135deg, ${hex}18 0%, ${hex}08 100%)` }}
    >
      {/* Shine sweep */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/8 to-transparent skew-x-12 pointer-events-none" />
      {/* Corner glow */}
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl pointer-events-none transition-opacity duration-300 opacity-40 group-hover:opacity-80"
        style={{ backgroundColor: hex }} />

      {/* Top row: label badge + icon */}
      <div className="relative z-10 flex items-start justify-between">
        {label === "Best" ? (
          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <span style={{ color: "#c21219" }}>B</span>
            <span style={{ color: "#3b82f6" }}>E</span>
            <span style={{ color: "#10b981" }}>S</span>
            <span style={{ color: "#ffffff" }}>T</span>
          </span>
        ) : (
          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ color: hex, backgroundColor: `${hex}20`, border: `1px solid ${hex}35` }}>
            {label}
          </span>
        )}
        <motion.div
          whileHover={{ scale: 1.2, rotate: 8 }}
          transition={{ type: "spring", stiffness: 400, damping: 16 }}
        >
          <Image src={icon} alt={title} width={22} height={22} className="w-5 h-5 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      </div>

      {/* Title + animated underline */}
      <div className="relative z-10">
        <p className="text-white text-sm font-semibold leading-snug">{title}</p>
        <p className="text-[11px] leading-snug mb-2 truncate" style={{ color: `${hex}bb` }}>{desc}</p>
        <motion.div
          initial={{ width: "16px" }}
          whileHover={{ width: "60%" }}
          transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
          className="h-0.5 rounded-full"
          style={{ backgroundColor: hex }}
        />
      </div>
    </motion.div>
  </Link>
);

const PortalCard = ({ title, sub, icon, href, hex, index }) => (
  <Link href={href}>
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 + index * 0.1, type: "spring", stiffness: 300, damping: 24 }}
      whileHover={{ y: -6, boxShadow: `0 20px 52px ${hex}55` }}
      whileTap={{ scale: 0.97 }}
      className="group relative flex items-center gap-4 rounded-2xl p-5 h-24 cursor-pointer overflow-hidden"
      style={{ border: `1px solid ${hex}45`, background: `linear-gradient(135deg, ${hex}20 0%, ${hex}08 100%)` }}
    >
      {/* Shine sweep */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none" />
      {/* Glow orb */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-30 group-hover:opacity-60 transition-opacity duration-300"
        style={{ backgroundColor: hex }} />

      <motion.div
        whileHover={{ scale: 1.12, rotate: -5 }}
        transition={{ type: "spring", stiffness: 380, damping: 18 }}
        className="relative z-10 flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${hex}25`, border: `1px solid ${hex}50` }}
      >
        <Image src={icon} alt={title} width={28} height={28} className="w-7 h-7 object-contain" />
      </motion.div>

      <div className="relative z-10 flex-1">
        <p className="text-white font-bold text-sm leading-tight">{title}</p>
        <p className="text-xs mt-0.5" style={{ color: `${hex}cc` }}>{sub}</p>
        <motion.div
          initial={{ width: "20px" }}
          whileHover={{ width: "80px" }}
          transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
          className="mt-1.5 h-0.5 rounded-full"
          style={{ backgroundColor: hex }}
        />
      </div>

      <motion.span
        animate={{ x: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        className="relative z-10 text-lg font-bold"
        style={{ color: hex }}
      >→</motion.span>
    </motion.div>
  </Link>
);

export default function ResponsiveServiceGrid() {
  return (
    <div className="w-full space-y-4">

      {/* Mosaic grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {MOSAIC.map((card, i) => (
          <MosaicCard key={card.title} {...card} index={i} />
        ))}
      </div>

      {/* Portal section */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#c21219] to-rose-400">
          Portal Access
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PORTAL.map((p, i) => (
            <PortalCard key={p.title} {...p} index={i} />
          ))}
        </div>
      </div>

    </div>
  );
}
