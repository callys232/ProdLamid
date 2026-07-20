"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Network, TrendingUp, GraduationCap, Landmark, Menu, X } from "lucide-react";
import AccountMenu from "./Account";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import PeekView from "@/components/peekview/PeekView";

/* ── Flat nav links ── */
const FLAT_LINKS = [
  { label: "Home",      href: "/"          },
  { label: "Ecosystem", href: "/ecosystem" },
  { label: "Solutions", href: "/solutions" },
  { label: "Pricing",   href: "/pricing"   },
  { label: "About",     href: "/about"     },
];

/* ── Engines dropdown — four engine pages ── */
const ENGINES = [
  { label: "LAMID CORE",    Icon: Network,       badge: "Strategy", href: "/core",    emoji: "◈" },
  { label: "LAMID GROW",    Icon: TrendingUp,    badge: "Growth",   href: "/grow",    emoji: "▣" },
  { label: "LAMID TALENT",  Icon: GraduationCap, badge: "People",   href: "/talent",  emoji: "✦" },
  { label: "LAMID FINANCE", Icon: Landmark,      badge: "Capital",  href: "/finance", emoji: "⬡" },
];

/* ── Notification hook ── */
function useNotifications() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let es: EventSource | null = null;
    let poll: ReturnType<typeof setInterval> | null = null;
    const fetchCount = async () => {
      try {
        const r = await fetch("/api/notifications", { credentials: "include" });
        if (!r.ok) return;
        const d = await r.json();
        setCount(d.unreadCount ?? d.notifications?.length ?? 0);
      } catch {}
    };
    const startPoll = () => { fetchCount(); poll = setInterval(fetchCount, 60000); };
    try {
      es = new EventSource("/api/notifications/stream");
      es.onmessage = (e) => {
        try { const d = JSON.parse(e.data); if (d.type === "count") setCount(d.count); } catch {}
      };
      es.onerror = () => { es?.close(); es = null; startPoll(); };
    } catch { startPoll(); }
    return () => { es?.close(); if (poll) clearInterval(poll); };
  }, []);
  return count;
}

/* ── Engines panel ── */
function EnginesPanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      exit={{    opacity: 0, y: -6, scale: 0.96 }}
      transition={{ duration: 0.18, ease: [0.33, 1, 0.68, 1] as const }}
      className="absolute left-0 top-full mt-2 w-80 bg-[#0b0b0b] border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/8">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#2563EB]/20 border border-[#2563EB]/30 flex-shrink-0">
          <span className="text-[10px] font-black text-[#2563EB] leading-none">L</span>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-white leading-none">The Engines</p>
          <p className="text-[9px] text-white/45 mt-0.5">Four unified engines</p>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="ml-auto text-white/45 hover:text-white/70 transition-colors cursor-pointer"
          aria-label="Close engines menu"
        >
          <X className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {/* 2 × 2 engine card grid */}
      <div className="p-3">
        <div className="grid grid-cols-2 gap-2">
          {ENGINES.map((engine, i) => (
            <motion.div
              key={engine.label}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, duration: 0.18, ease: [0.33, 1, 0.68, 1] as const }}
            >
              <Link href={engine.href} onClick={onClose}>
                <motion.div
                  whileHover={{ y: -3, boxShadow: "0 8px 20px rgba(37,99,235,0.25)" }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col items-center text-center rounded-xl py-4 px-2 gap-2 border border-transparent hover:border-white/10 transition-colors cursor-pointer bg-[rgba(37,99,235,0.07)]"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg border transition-transform group-hover:scale-110 bg-[rgba(37,99,235,0.15)] border-[rgba(37,99,235,0.35)]">
                    <engine.Icon className="w-4 h-4 text-[#2563EB]" strokeWidth={1.75} />
                  </div>
                  <p className="text-[10px] font-semibold text-white leading-tight">
                    {engine.label}
                  </p>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full text-[#2563EB] bg-[rgba(37,99,235,0.2)]">
                    {engine.badge}
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-white/8 flex items-center justify-between">
        <p className="text-[9px] text-white/45">One Ecosystem. Four Engines. Endless Possibilities.</p>
        <div className="flex gap-1">
          {ENGINES.map((e) => (
            <div key={e.label} className="h-1.5 w-1.5 rounded-full bg-[#2563EB] opacity-40" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Chevron icon ── */
function Chevron({ open }: { open: boolean }) {
  return (
    <motion.svg
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.2 }}
      className="w-3.5 h-3.5"
      fill="none" viewBox="0 0 24 24" stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </motion.svg>
  );
}

/* ── Navbar ── */
const Navbar: React.FC = () => {
  const [isOpen,      setIsOpen]      = useState(false);
  const [enginesOpen, setEnginesOpen] = useState(false);
  const [navVisible,  setNavVisible]  = useState(true);

  const lastScrollY  = useRef(0);
  const enginesRef   = useRef<HTMLDivElement>(null);

  const pathname   = usePathname() ?? "";
  const notifCount = useNotifications();
  const { isAuthenticated, loading: authLoading } = useAuth();

  /* Scroll-aware hide/show */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 10) { setNavVisible(true); lastScrollY.current = y; return; }
      setNavVisible(y < lastScrollY.current);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close on outside click / escape */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (enginesRef.current && !enginesRef.current.contains(e.target as Node))
        setEnginesOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setEnginesOpen(false); setIsOpen(false); }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  useEffect(() => { setIsOpen(false); setEnginesOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const enginesActive = ENGINES.some((e) => pathname.startsWith(e.href));

  const renderNotifBadge = () =>
    notifCount > 0 ? (
      <span className="absolute -top-1 -right-1 bg-[#2563EB] text-white text-[9px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
        {notifCount > 99 ? "99+" : notifCount}
      </span>
    ) : null;

  const FlatLink = ({ link }: { link: typeof FLAT_LINKS[0] }) => {
    const active = isActive(link.href);
    return (
      <Link href={link.href}
        className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group
          ${active
            ? "text-[#2563EB]"
            : "text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white hover:bg-white/5 dark:hover:bg-white/5"
          }`}
      >
        {link.label}
        {active && (
          <motion.span layoutId="nav-underline"
            className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-[#2563EB]"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
        {!active && (
          <span className="absolute bottom-0 left-3 right-3 h-[1px] rounded-full bg-gray-400 dark:bg-white/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
        )}
      </Link>
    );
  };

  return (
    <motion.header
      animate={{ y: navVisible ? 0 : "-100%" }}
      transition={{ duration: 0.28, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav className="aivora-nav w-full" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" aria-label="LAMID ONE Home" className="flex-shrink-0 flex items-center gap-2">
            <Image src="/Logo.png" alt="LAMID" width={90} height={30} priority className="object-contain" />
            <span className="text-base font-black tracking-tight aivora-gradient-text hidden sm:block">LAMID ONE</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Home */}
            <FlatLink link={FLAT_LINKS[0]} />

            {/* Ecosystem — single link */}
            <FlatLink link={FLAT_LINKS[1]} />

            {/* Engines ▾ — dropdown */}
            <div ref={enginesRef} className="relative">
              <motion.button
                type="button"
                onClick={() => setEnginesOpen((v) => !v)}
                whileTap={{ scale: 0.96 }}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer
                  ${enginesOpen || enginesActive
                    ? "text-[#2563EB]"
                    : "text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white hover:bg-white/5 dark:hover:bg-white/5"
                  }`}
              >
                Engines
                <Chevron open={enginesOpen} />
              </motion.button>
              <AnimatePresence>
                {enginesOpen && <EnginesPanel onClose={() => setEnginesOpen(false)} />}
              </AnimatePresence>
            </div>

            {/* Solutions · Pricing · About */}
            <FlatLink link={FLAT_LINKS[2]} />
            <FlatLink link={FLAT_LINKS[3]} />
            <FlatLink link={FLAT_LINKS[4]} />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <PeekView />
            <ThemeToggle />

            {!authLoading && !isAuthenticated && (
              <motion.div className="hidden lg:block" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/contact"
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors duration-200 shadow-[0_0_12px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(37,99,235,0.7)] whitespace-nowrap">
                  Book a Demo
                </Link>
              </motion.div>
            )}

            <div className="relative hidden lg:block">
              <AccountMenu />
              {renderNotifBadge()}
            </div>

            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-white/15 text-gray-600 dark:text-white/70 hover:border-[#2563EB]/50 hover:text-[#2563EB] transition-colors duration-200 cursor-pointer"
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu-panel"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen
                  ? <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X className="w-4 h-4" /></motion.span>
                  : <motion.span key="open"  initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu className="w-4 h-4" /></motion.span>
                }
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-menu-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="lg:hidden border-t border-gray-200 dark:border-white/8 overflow-hidden"
              style={{ background: "var(--navbar-bg)" }}
            >
              <div className="px-4 py-4 flex flex-col gap-1">

                {/* Home */}
                <Link href="/" onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive("/")
                      ? "bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20"
                      : "text-gray-500 dark:text-white/50 hover:bg-white/6 dark:hover:bg-white/6 hover:text-gray-900 dark:hover:text-white border border-transparent"
                    }`}
                >
                  {isActive("/") && <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />}
                  Home
                </Link>

                {/* Ecosystem */}
                <Link href="/ecosystem" onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive("/ecosystem")
                      ? "bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20"
                      : "text-gray-500 dark:text-white/50 hover:bg-white/6 dark:hover:bg-white/6 hover:text-gray-900 dark:hover:text-white border border-transparent"
                    }`}
                >
                  {isActive("/ecosystem") && <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />}
                  Ecosystem
                </Link>

                <div className="h-px bg-gray-200 dark:bg-white/8 my-1" />
                <p className="px-4 text-[10px] font-bold uppercase tracking-widest aivora-gradient-text mb-1">Engines</p>
                {ENGINES.map((e) => (
                  <Link key={e.href} href={e.href} onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-600 dark:text-white/55 hover:bg-[#2563EB]/8 hover:text-[#2563EB] transition-colors duration-200"
                  >
                    <span className="text-[#2563EB]">{e.emoji}</span>
                    {e.label}
                    <span className="ml-auto text-[9px] font-bold text-white/30">{e.badge}</span>
                  </Link>
                ))}

                <div className="h-px bg-gray-200 dark:bg-white/8 my-1" />

                {/* Solutions · Pricing · About */}
                {[
                  { label: "Solutions", href: "/solutions" },
                  { label: "Pricing",   href: "/pricing"   },
                  { label: "About",     href: "/about"     },
                ].map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                        ${active
                          ? "bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20"
                          : "text-gray-500 dark:text-white/50 hover:bg-white/6 dark:hover:bg-white/6 hover:text-gray-900 dark:hover:text-white border border-transparent"
                        }`}
                    >
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />}
                      {link.label}
                    </Link>
                  );
                })}

                <div className="h-px bg-gray-200 dark:bg-white/8 my-2" />
                <div className="flex items-center gap-3 px-4 py-2">
                  <ThemeToggle />
                  <span className="text-xs aivora-text-muted">Day / Night</span>
                </div>

                {!authLoading && !isAuthenticated && (
                  <div className="pt-2">
                    <Link href="/contact" onClick={() => setIsOpen(false)}
                      className="block text-center py-3 rounded-xl text-sm font-semibold bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors shadow-[0_0_12px_rgba(37,99,235,0.4)]">
                      Book a Demo
                    </Link>
                  </div>
                )}

                <div className="pt-2 relative">
                  <AccountMenu align="left" />
                  {notifCount > 0 && renderNotifBadge()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#2563EB]/30 to-transparent" />
      </nav>
    </motion.header>
  );
};

export default Navbar;
