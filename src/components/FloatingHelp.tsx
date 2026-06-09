"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import HowWeServeModal from "./navbar/HowWeServeModal";
import s from "./FloatingHelp.module.css";

/* ── Menu item types ────────────────────────────────────────────── */
type LinkItem   = { label: string; desc: string; icon: React.ReactNode; href: string; action?: never };
type ActionItem = { label: string; desc: string; icon: React.ReactNode; action: () => void; href?: never };
type MenuItem   = LinkItem | ActionItem;

/* ── Menu definitions ───────────────────────────────────────────── */
function buildMenu(onGetStarted: () => void): MenuItem[] {
  return [
    {
      label: "Learn Now",
      desc: "Upcoming events & workshops",
      href: "/events",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="8" y1="15" x2="10" y2="15" /><line x1="14" y1="15" x2="16" y2="15" />
        </svg>
      ),
    },
    {
      label: "Get Diagnostics",
      desc: "Free business assessment",
      href: "/contact-sales",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="22" y2="22" />
          <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      ),
    },
    {
      label: "Get Started",
      desc: "Explore all LAMID services",
      action: onGetStarted,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 8 16 12 12 16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
    },
    {
      label: "Concierge",
      desc: "Your dedicated advisor",
      href: "/concierge",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          <polyline points="16 11 18 13 22 9" />
        </svg>
      ),
    },
  ];
}

/* ── Framer Motion variants ────────────────────────────────────── */
const containerV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075, staggerDirection: -1 } },
  exit:  { transition: { staggerChildren: 0.045, staggerDirection: 1  } },
};

const itemV = {
  hidden: { opacity: 0, y: 10, scale: 0.86 },
  show:   { opacity: 1, y: 0,  scale: 1,    transition: { type: "spring" as const, stiffness: 350, damping: 26 } },
  exit:   { opacity: 0, y: 8,  scale: 0.90, transition: { duration: 0.13 } },
};

/* ── Component ──────────────────────────────────────────────────── */
export default function FloatingHelp() {
  const [open,        setOpen]        = useState(false);
  const [modalOpen,   setModalOpen]   = useState(false);

  const menu = buildMenu(() => {
    setOpen(false);
    setModalOpen(true);
  });

  return (
    <>
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
        {/* Staggered menu — items pop bottom-first (staggerDirection:-1) */}
        <AnimatePresence>
          {open && (
            <motion.ul
              className="flex flex-col gap-1.5 mb-0.5 list-none p-0 m-0"
              variants={containerV}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {menu.map((m) => (
                <motion.li key={m.label} variants={itemV}>
                  {m.href ? (
                    <Link href={m.href} onClick={() => setOpen(false)} className={s.item}>
                      <span className={s.itemIcon}>{m.icon}</span>
                      <div>
                        <div className={s.itemLabel}>{m.label}</div>
                        <div className={s.itemDesc}>{m.desc}</div>
                      </div>
                    </Link>
                  ) : (
                    <button type="button" onClick={m.action} className={s.item}>
                      <span className={s.itemIcon}>{m.icon}</span>
                      <div>
                        <div className={s.itemLabel}>{m.label}</div>
                        <div className={s.itemDesc}>{m.desc}</div>
                      </div>
                    </button>
                  )}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        {/* Main trigger */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded="true"
          aria-label={open ? "Close help menu" : "Open help menu"}
          className={s.trigger}
        >
          <span className="relative z-10 flex items-center gap-1.5">
            <span>{open ? "✕" : "✦"}</span>
            <span>{open ? "Close" : "Need Help?"}</span>
          </span>
        </button>
      </div>

      {/* Get Started modal */}
      <AnimatePresence>
        <HowWeServeModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </AnimatePresence>
    </>
  );
}
