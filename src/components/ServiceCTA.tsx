"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ServiceCTA.module.css";

type ServiceKey = "fileshare" | "concierge" | null;

/* ─── Service definitions ─────────────────────────────────────── */
const SERVICES = {
  fileshare: {
    title: "Lamid FileShare",
    tagline: "Secure document exchange for businesses.",
    badge: "Premium · Enterprise",
    description:
      "Share, store and collaborate on sensitive client documents with confidence. Lamid FileShare gives your team bank-level encrypted transfers, per-client access controls, and a full audit trail — purpose-built for consultants and advisors who handle critical data.",
    bullets: [
      "AES-256 encrypted file transfers",
      "Granular per-client access controls",
      "Download tracking & audit trail",
      "Bulk uploads · version history",
    ],
    ctaPrimary: { label: "View Plans →", href: "/pricing" },
    accent: "text-white",
    tagline_: "text-indigo-100/80",
    bullet_: "text-indigo-100/70",
    badge_: "bg-white/20 text-white",
    hoverBg: "hover:bg-white/10",
    modalBadge: "bg-indigo-500/15 text-indigo-300",
    modalAccent: "text-indigo-400",
    modalIconBg: "bg-indigo-500/8 border-indigo-500/20",
    btnText: "text-white",
    btnClass: styles.btnFileshare,
    modalStripe: styles.modalStripeFileshare,
    icon: (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8"
      >
        <rect
          x="4"
          y="10"
          width="24"
          height="28"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M4 17h24"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeDasharray="3 2"
        />
        <path
          d="M28 17V7a1 1 0 0 0-1-1H11L4 13v4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M11 6v7H4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M32 20v14M32 20l-4 4M32 20l4 4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },

  concierge: {
    title: "Lamid Concierge",
    tagline: "Your dedicated business execution partner.",
    badge: "On-Demand",
    description:
      "Lamid Concierge connects you with a dedicated advisor who handles the operational, strategic and administrative tasks that slow your business down. From sourcing partners to managing workflows — we execute so you can lead.",
    bullets: [
      "Dedicated advisor assigned to your account",
      "Strategic & administrative task execution",
      "Partner & vendor sourcing",
      "Priority response within 2 business hours",
    ],
    ctaPrimary: { label: "Register for Concierge →", href: "/signup" },
    accent: "text-white",
    tagline_: "text-red-100/80",
    bullet_: "text-red-100/70",
    badge_: "bg-white/20 text-white",
    hoverBg: "hover:bg-white/10",
    modalBadge: "bg-red-500/15 text-red-300",
    modalAccent: "text-red-400",
    modalIconBg: "bg-red-500/8 border-red-500/20",
    btnText: "text-white",
    btnClass: styles.btnConcierge,
    modalStripe: styles.modalStripeConcierge,
    icon: (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8"
      >
        <circle cx="20" cy="13" r="6" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M7 34c0-7.18 5.82-13 13-13s13 5.82 13 13"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M29 19l2 2 5-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
};

type ServiceId = keyof typeof SERVICES;

/* ─── Modal ───────────────────────────────────────────────────── */
function ServiceModal({ id, onClose }: { id: ServiceId; onClose: () => void }) {
  const s = SERVICES[id];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[999999] flex items-end sm:items-center justify-center"
      style={{
        backgroundColor: "rgba(0,0,0,0.82)",
        backdropFilter: "blur(7px)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full sm:w-[92%] md:w-[60%] lg:w-[46%]
                   max-h-[92vh] sm:max-h-[85vh] rounded-t-2xl sm:rounded-2xl
                   overflow-y-auto overscroll-contain bg-[#0d0d0d] border border-white/10"
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-600" />
        </div>

        {/* Top colour strip */}
        <div
          className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl ${s.modalStripe}`}
        />

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10
                     flex items-center justify-center text-gray-400
                     hover:text-white hover:bg-white/20 transition-colors duration-200"
        >
          ✕
        </button>

        <div className="px-6 pt-6 pb-8 sm:px-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-5">
            <div
              className={`p-3 rounded-xl border ${s.modalIconBg} ${s.modalAccent}`}
            >
              {s.icon}
            </div>
            <div>
              <span
                className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-1 ${s.modalBadge}`}
              >
                {s.badge}
              </span>
              <h2 className="text-xl font-extrabold text-white leading-tight">
                {s.title}
              </h2>
              <p className={`text-sm font-medium mt-0.5 ${s.modalAccent}`}>
                {s.tagline}
              </p>
            </div>
          </div>

          <div className="h-px bg-white/8 mb-5" />
          <p className="text-sm text-gray-300 leading-relaxed mb-5">
            {s.description}
          </p>

          <ul className="space-y-2 mb-6">
            {s.bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2.5 text-sm text-gray-300"
              >
                <span className={`mt-0.5 leading-none ${s.modalAccent}`}>
                  ✓
                </span>
                {b}
              </li>
            ))}
          </ul>

          <Link
            href={s.ctaPrimary.href}
            onClick={onClose}
            className={`block w-full text-center px-5 py-3 rounded-full text-sm font-bold
                       transition-all duration-300 shadow-lg ${s.btnText} ${s.btnClass}`}
          >
            {s.ctaPrimary.label}
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Half panel (one side of the joined card) ────────────────── */
function HalfPanel({ id, onClick }: { id: ServiceId; onClick: () => void }) {
  const s = SERVICES[id];
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className={`relative z-10 flex-1 w-full text-left px-5 py-5 sm:px-6
                  group transition-colors duration-300 focus:outline-none
                  focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-white/20
                  ${s.hoverBg}`}
    >
      {/* Shine sweep on hover */}
      <span
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full
                       transition-transform duration-700 ease-in-out
                       bg-gradient-to-r from-transparent via-white/5 to-transparent
                       skew-x-12 pointer-events-none"
      />

      {/* Row: icon + text block + arrow */}
      <div className="relative flex items-center gap-3.5">
        {/* Icon */}
        <div
          className={`flex-shrink-0 opacity-75 group-hover:opacity-100 transition-opacity duration-200 ${s.accent}`}
        >
          {s.icon}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span
              className={`text-[8.5px] font-black uppercase tracking-[0.18em] px-2 py-0.5 rounded-full ${s.badge_}`}
            >
              {s.badge}
            </span>
          </div>
          <h3 className="text-[0.95rem] font-extrabold text-white leading-tight tracking-tight">
            {s.title}
          </h3>
          <p className={`text-xs leading-snug mt-0.5 ${s.tagline_}`}>
            {s.tagline}
          </p>
          {/* Inline bullets */}
          <div className="flex flex-wrap gap-x-3 mt-1.5">
            {s.bullets.slice(0, 2).map((b) => (
              <span
                key={b}
                className={`text-[11px] flex items-center gap-1 ${s.bullet_}`}
              >
                <span className={s.accent}>✓</span>
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <motion.span
          variants={{ hover: { x: 3 } }}
          className={`flex-shrink-0 text-base leading-none ml-1 ${s.accent}`}
        >
          →
        </motion.span>
      </div>
    </motion.button>
  );
}

/* ─── Export ──────────────────────────────────────────────────── */
export default function ServiceCTA() {
  const [open, setOpen] = useState<ServiceKey>(null);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-4"></div>

      {/* Single joined card */}
      <div className={`relative ${styles.joinedCard}`}>
        {/* Shared dot pattern */}
        <div className={styles.pattern} />

        {/* Two halves */}
        <div className="flex flex-col sm:flex-row">
          <HalfPanel id="fileshare" onClick={() => setOpen("fileshare")} />
          <div className={styles.divider} />
          <HalfPanel id="concierge" onClick={() => setOpen("concierge")} />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <ServiceModal id={open as ServiceId} onClose={() => setOpen(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
