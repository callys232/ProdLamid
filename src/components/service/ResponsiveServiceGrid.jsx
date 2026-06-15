"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const CAPABILITIES = [
  { title: "Process Transformation",  desc: "Redesign workflows to eliminate friction and unlock speed.",        label: "BEST",       icon: "/rocket-icon.png",       href: "/biz",                       hex: "#3b82f6" },
  { title: "Talent Sourcing",         desc: "Connect with vetted experts matched precisely to your needs.",      label: "HCD",        icon: "/people-icon.png",       href: "/hcd/recruitment",           hex: "#f59e0b" },
  { title: "Sustainable Development", desc: "Build long-term impact through responsible growth frameworks.",     label: "SD",         icon: "/sustainable-icon.png",  href: "/sustainableDev",            hex: "#10b981" },
  { title: "HR, Training & Support",  desc: "Develop people, build capability, and future-proof your teams.",   label: "HCD",        icon: "/human-capital-icon.png",href: "/hcd",                       hex: "#f97316" },
  { title: "Digital Transformation",  desc: "Modernize systems and operations with intelligent technology.",     label: "BEST",       icon: "/chart-icon.png",        href: "/biz",                       hex: "#6366f1" },
  { title: "Innovation Consulting",   desc: "Turn ideas into market-ready solutions with guided strategy.",      label: "Enterprise", icon: "/rocket-icon.png",       href: "/enterprise",                hex: "#8b5cf6" },
  { title: "Management Solutions",    desc: "Strengthen leadership, governance, and operational performance.",   label: "SD",         icon: "/rocket-icon.png",       href: "/sustainableDev",            hex: "#059669" },
  { title: "Strategy Development",    desc: "Align vision, execution, and resources for competitive advantage.", label: "Diagnostic", icon: "/rocket-icon.png",       href: "/premium/business-diagnostic", hex: "#2563eb" },
];

const PORTALS = [
  { title: "Business Portal", sub: "For organizations & clients",  icon: "/portalLogo.png", href: "/portal", hex: "#c21219" },
  { title: "Expert Portal",   sub: "For consultants & talent",     icon: "/portalLogo.png", href: "/talent", hex: "#9f1239" },
];

const CapabilityCard = ({ title, desc, label, icon, href, hex, index }) => (
  <Link href={href} className="col-span-1">
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, type: "spring", stiffness: 300, damping: 24 }}
      whileHover={{ y: -4, boxShadow: `0 10px 28px ${hex}30` }}
      whileTap={{ scale: 0.97 }}
      className="group relative flex flex-col justify-between p-3 rounded-xl overflow-hidden cursor-pointer h-28 w-full"
      style={{ border: `1px solid ${hex}30`, background: `linear-gradient(135deg, ${hex}15 0%, ${hex}06 100%)` }}
    >
      {/* Shine sweep */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/8 to-transparent skew-x-12 pointer-events-none" />
      {/* Corner glow */}
      <div
        className="absolute -top-4 -right-4 w-14 h-14 rounded-full blur-xl pointer-events-none opacity-35 group-hover:opacity-70 transition-opacity duration-300"
        style={{ backgroundColor: hex }}
      />

      {/* Top row: label badge + icon */}
      <div className="relative z-10 flex items-start justify-between">
        <span
          className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full"
          style={{ color: hex, backgroundColor: `${hex}20`, border: `1px solid ${hex}30` }}
        >
          {label}
        </span>
        <motion.div
          whileHover={{ scale: 1.2, rotate: 8 }}
          transition={{ type: "spring", stiffness: 400, damping: 16 }}
        >
          <Image
            src={icon}
            alt={title}
            width={16}
            height={16}
            className="w-4 h-4 object-contain opacity-75 group-hover:opacity-100 transition-opacity"
          />
        </motion.div>
      </div>

      {/* Title + desc + underline */}
      <div className="relative z-10">
        <p className="text-white text-xs font-semibold leading-snug mb-0.5">{title}</p>
        <p className="text-[10px] leading-snug mb-1.5 truncate" style={{ color: `${hex}aa` }}>{desc}</p>
        <motion.div
          initial={{ width: "12px" }}
          whileHover={{ width: "55%" }}
          transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
          className="h-px rounded-full"
          style={{ backgroundColor: hex }}
        />
      </div>
    </motion.div>
  </Link>
);

const PortalCard = ({ title, sub, icon, href, hex, index }) => (
  <Link href={href}>
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.32 + index * 0.08, type: "spring", stiffness: 300, damping: 24 }}
      whileHover={{ y: -4, boxShadow: `0 14px 36px ${hex}40` }}
      whileTap={{ scale: 0.97 }}
      className="group relative flex items-center gap-3 rounded-xl p-3 h-16 cursor-pointer overflow-hidden"
      style={{ border: `1px solid ${hex}35`, background: `linear-gradient(135deg, ${hex}18 0%, ${hex}07 100%)` }}
    >
      {/* Shine sweep */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/8 to-transparent skew-x-12 pointer-events-none" />
      {/* Glow orb */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-25 group-hover:opacity-50 transition-opacity duration-300"
        style={{ backgroundColor: hex }}
      />

      <motion.div
        whileHover={{ scale: 1.1, rotate: -4 }}
        transition={{ type: "spring", stiffness: 380, damping: 18 }}
        className="relative z-10 flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${hex}22`, border: `1px solid ${hex}45` }}
      >
        <Image src={icon} alt={title} width={20} height={20} className="w-5 h-5 object-contain" />
      </motion.div>

      <div className="relative z-10 flex-1 min-w-0">
        <p className="text-white font-bold text-xs leading-tight">{title}</p>
        <p className="text-[10px] mt-0.5 truncate" style={{ color: `${hex}bb` }}>{sub}</p>
        <motion.div
          initial={{ width: "16px" }}
          whileHover={{ width: "70px" }}
          transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
          className="mt-1 h-px rounded-full"
          style={{ backgroundColor: hex }}
        />
      </div>

      <motion.span
        animate={{ x: [0, 4, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        className="relative z-10 text-sm font-bold flex-shrink-0"
        style={{ color: hex }}
      >→</motion.span>
    </motion.div>
  </Link>
);

export default function ResponsiveServiceGrid() {
  return (
    <div className="w-full bg-black px-4 md:px-8 lg:px-16 pt-4 pb-10">

      {/* Section label */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/30">Our Capabilities</p>
        <div className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent" />
      </div>

      {/* Capabilities grid */}
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-2.5 mb-4">
          {CAPABILITIES.map((card, i) => (
            <CapabilityCard key={card.title} {...card} index={i} />
          ))}
        </div>

        {/* Portal strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {PORTALS.map((p, i) => (
            <PortalCard key={p.title} {...p} index={i} />
          ))}
        </div>
      </div>

    </div>
  );
}
