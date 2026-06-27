"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AccountMenu from "./Account";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

/* ── Main nav links (matches prototype exactly) ── */
const NAV_LINKS = [
  { label: "Home",         href: "/"          },
  { label: "Marketplace",  href: "/talent"    },
  { label: "BIZ Portal",   href: "/biz"       },
  { label: "Talent Portal", href: "/hcd"      },
  { label: "About",        href: "/portfolio" },
  { label: "For Experts",  href: "/signup"    },
  { label: "Pricing",      href: "/pricing"   },
];

/* ── Hidden behind "Actions" dropdown ── */
const ACTION_ITEMS = [
  { label: "Events & Training", href: "/events",    icon: "✦", desc: "Upcoming workshops, webinars, and learning events" },
  { label: "Portfolio",         href: "/portfolio", icon: "◈", desc: "Our work, case studies, and about AIVORA" },
  { label: "Contact",           href: "/contact",   icon: "⬡", desc: "Get in touch with our team" },
  { label: "Blog",              href: "/contact",   icon: "▣", desc: "Insights, research, and ecosystem updates" },
];

/* ── Notification hook ── */
function useNotifications() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let mounted = true;
    const fetch_ = async () => {
      try {
        const res = await fetch("/api/notifications", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setCount(data.notifications?.length ?? 0);
      } catch {}
    };
    fetch_();
    const id = setInterval(fetch_, 60000);
    return () => { mounted = false; clearInterval(id); };
  }, []);
  return count;
}

const Navbar: React.FC = () => {
  const [isOpen,     setIsOpen]     = useState(false);
  const [actionsOpen,setActionsOpen]= useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY   = useRef(0);
  const actionsRef    = useRef<HTMLDivElement>(null);
  const pathname      = usePathname() ?? "";
  const notifCount    = useNotifications();
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

  /* Close actions on outside click / escape */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target as Node))
        setActionsOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setActionsOpen(false); setIsOpen(false); }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  /* Close on route change */
  useEffect(() => { setIsOpen(false); setActionsOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const renderNotifBadge = () =>
    notifCount > 0 ? (
      <span className="absolute -top-1 -right-1 bg-[#C12129] text-white text-[9px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
        {notifCount > 99 ? "99+" : notifCount}
      </span>
    ) : null;

  return (
    <motion.header
      animate={{ y: navVisible ? 0 : "-100%" }}
      transition={{ duration: 0.28, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav className="aivora-nav w-full" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link href="/" aria-label="AIVORA Home" className="flex-shrink-0">
            <Image src="/Logo.png" alt="AIVORA" width={110} height={36} priority className="object-contain" />
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 group
                    ${active
                      ? "text-[#C12129]"
                      : "text-gray-600 dark:text-white/65 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                  {link.label}
                  {/* Active underline */}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-[#C12129]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {/* Hover underline for inactive */}
                  {!active && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-[#C12129]/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                  )}
                </Link>
              );
            })}

            {/* Actions dropdown — Events & Portfolio hidden here */}
            <div ref={actionsRef} className="relative">
              <motion.button
                type="button"
                onClick={() => setActionsOpen((v) => !v)}
                whileTap={{ scale: 0.96 }}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer
                  ${actionsOpen
                    ? "text-[#C12129]"
                    : "text-gray-600 dark:text-white/65 hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                More
                <motion.svg
                  animate={{ rotate: actionsOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-3.5 h-3.5"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </motion.button>

              <AnimatePresence>
                {actionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="absolute left-0 mt-2 w-64 rounded-2xl border border-white/8 dark:border-white/8 border-gray-200 shadow-[0_16px_48px_rgba(0,0,0,0.25)] overflow-hidden"
                    style={{ background: "var(--navbar-bg)" }}
                  >
                    {/* Top accent */}
                    <div className="h-[2px] bg-gradient-to-r from-[#C12129] to-transparent" />
                    <div className="p-2">
                      {ACTION_ITEMS.map((item) => (
                        <Link
                          key={item.href + item.label}
                          href={item.href}
                          onClick={() => setActionsOpen(false)}
                          className="group flex items-start gap-3 p-3 rounded-xl hover:bg-[#C12129]/8 transition-colors duration-150"
                        >
                          <span className="text-[#C12129] text-base shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-150">
                            {item.icon}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                              {item.label}
                            </p>
                            <p className="text-[11px] text-gray-500 dark:text-white/40 leading-snug mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Right side actions ── */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <ThemeToggle />

            {/* Guest CTAs */}
            {!authLoading && !isAuthenticated && (
              <div className="hidden lg:flex items-center gap-2">
                <Link href="/signin"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                  Sign In
                </Link>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/signup"
                    className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#C12129] hover:bg-[#a01a20] transition-colors duration-200 shadow-[0_0_12px_rgba(193,33,41,0.4)] hover:shadow-[0_0_20px_rgba(193,33,41,0.7)]">
                    Get Started
                  </Link>
                </motion.div>
              </div>
            )}

            {/* Account menu + notifications (auth users) */}
            <div className="relative hidden lg:block">
              <AccountMenu />
              {renderNotifBadge()}
            </div>

            {/* Mobile hamburger */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-white/15 dark:border-white/15 border-gray-200 text-gray-600 dark:text-white/70 hover:border-[#C12129]/50 hover:text-[#C12129] transition-colors duration-200 cursor-pointer"
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                className="text-base leading-none select-none"
              >
                {isOpen ? "✕" : "☰"}
              </motion.span>
            </motion.button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="lg:hidden border-t border-white/8 dark:border-white/8 border-gray-200 overflow-hidden"
              style={{ background: "var(--navbar-bg)" }}
            >
              <div className="px-4 py-4 flex flex-col gap-1">

                {/* Main links */}
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200
                        ${active
                          ? "bg-[#C12129]/10 text-[#C12129]"
                          : "text-gray-700 dark:text-white/70 hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-[#C12129] shrink-0" />}
                      {link.label}
                    </Link>
                  );
                })}

                {/* Divider */}
                <div className="h-px bg-white/8 dark:bg-white/8 bg-gray-200 my-2" />

                {/* Hidden items */}
                <p className="px-4 text-[10px] font-bold uppercase tracking-widest aivora-gradient-text mb-1">
                  More
                </p>
                {ACTION_ITEMS.map((item) => (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-600 dark:text-white/55 hover:bg-[#C12129]/8 hover:text-[#C12129] transition-colors duration-200"
                  >
                    <span className="text-[#C12129]">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}

                {/* Divider */}
                <div className="h-px bg-white/8 dark:bg-white/8 bg-gray-200 my-2" />

                {/* Theme toggle */}
                <div className="flex items-center gap-3 px-4 py-2">
                  <ThemeToggle />
                  <span className="text-xs aivora-text-muted">Day / Night</span>
                </div>

                {/* Guest CTAs */}
                {!authLoading && !isAuthenticated && (
                  <div className="flex flex-col gap-2 pt-2">
                    <Link href="/signin" onClick={() => setIsOpen(false)}
                      className="text-center py-3 rounded-xl text-sm font-medium border border-white/20 dark:border-white/20 border-gray-300 text-gray-700 dark:text-white/70 hover:border-[#C12129]/50 hover:text-[#C12129] transition-colors">
                      Sign In
                    </Link>
                    <Link href="/signup" onClick={() => setIsOpen(false)}
                      className="text-center py-3 rounded-xl text-sm font-semibold bg-[#C12129] text-white hover:bg-[#a01a20] transition-colors shadow-[0_0_12px_rgba(193,33,41,0.4)]">
                      Get Started
                    </Link>
                  </div>
                )}

                {/* Account (mobile) */}
                <div className="pt-2 relative">
                  <AccountMenu align="left" />
                  {notifCount > 0 && renderNotifBadge()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom red line accent */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C12129]/30 to-transparent" />
      </nav>
    </motion.header>
  );
};

export default Navbar;
