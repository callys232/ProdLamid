"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AccountMenu from "./Account";
import PeekView from "@/components/peekview/PeekView";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

interface ServiceItem {
  name: string;
  short: string;
  href: string;
  logo?: string;
  text: string;
  bg: string;
  border: string;
  dot: string;
}

const serviceItems: ServiceItem[] = [
  { name: "Business Innovation Zone", short: "BIZ",       href: "/biz",            logo: "/bizLogo.png",    text: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/25",   dot: "bg-blue-400"    },
  { name: "Talent Development",         short: "TD",        href: "/hcd",            logo: "/hcdLogo.png",    text: "text-orange-400",  bg: "bg-orange-500/10",  border: "border-orange-500/25", dot: "bg-orange-400"  },
  { name: "Sustainable Development",   short: "SD",        href: "/sustainableDev", logo: "/sdLogo.png",     text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/25",dot: "bg-emerald-400" },
  { name: "Portal",                    short: "Portal",    href: "/portal",         logo: "/portalLogo.png", text: "text-red-500",     bg: "bg-red-500/10",     border: "border-red-500/25",    dot: "bg-red-500"     },
  { name: "Portfolio",                 short: "Portfolio", href: "/portfolio",      logo: undefined,         text: "text-gray-400",    bg: "bg-white/5",        border: "border-white/10",      dot: "bg-gray-400"    },
  { name: "Events",                    short: "Events",    href: "/events",         logo: undefined,         text: "text-yellow-400",  bg: "bg-yellow-500/10",  border: "border-yellow-500/25", dot: "bg-yellow-400"  },
];

/* ---------------- Notification Hook ---------------- */

function useNotifications() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications", {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) {
          setCount(data.notifications?.length ?? 0);
        }
      } catch {}
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return count;
}

/* ---------------- Navbar ---------------- */

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const notificationCount = useNotifications();
  const { isAuthenticated, loading: authLoading } = useAuth();

  /* ── Scroll-aware hide / show ─────────────────────────────── */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 10) {
        setNavVisible(true);
        lastScrollY.current = y;
        return;
      }
      setNavVisible(y < lastScrollY.current);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const servicesRef = useRef<HTMLDivElement>(null);
  const mobileServicesRef = useRef<HTMLDivElement>(null);
  const desktopServiceRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const mobileServiceRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  /* Close menus on route change */
  useEffect(() => {
    setIsOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  /* Outside click + escape */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        servicesRef.current &&
        !servicesRef.current.contains(event.target as Node) &&
        mobileServicesRef.current &&
        !mobileServicesRef.current.contains(event.target as Node)
      ) {
        setServicesOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setServicesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /* Keyboard nav desktop */
  const onDesktopServicesKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (!servicesOpen) return;
    const items = desktopServiceRefs.current.filter(
      Boolean,
    ) as HTMLAnchorElement[];
    const currentIndex = items.findIndex((el) => el === document.activeElement);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex =
        currentIndex >= 0 ? (currentIndex + 1) % items.length : 0;
      items[nextIndex]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex =
        currentIndex >= 0
          ? (currentIndex - 1 + items.length) % items.length
          : items.length - 1;
      items[prevIndex]?.focus();
    }
  };

  /* Keyboard nav mobile */
  const onMobileServicesKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (!servicesOpen) return;
    const items = mobileServiceRefs.current.filter(
      Boolean,
    ) as HTMLAnchorElement[];
    const currentIndex = items.findIndex((el) => el === document.activeElement);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex =
        currentIndex >= 0 ? (currentIndex + 1) % items.length : 0;
      items[nextIndex]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex =
        currentIndex >= 0
          ? (currentIndex - 1 + items.length) % items.length
          : items.length - 1;
      items[prevIndex]?.focus();
    }
  };

  const renderNotificationBadge = (size = "desktop") => (
    <span
      className={`absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center ${
        size === "mobile" ? "h-4 min-w-[16px] px-1" : "h-5 min-w-[20px] px-1.5"
      }`}
      aria-label={`${notificationCount} unread notifications`}
    >
      {notificationCount > 99 ? "99+" : notificationCount}
    </span>
  );

  const linkClass = (href: string) =>
    `hover:text-red-500 ${pathname === href ? "text-red-500" : "text-white"}`;

  return (
    <motion.header
      animate={{ y: navVisible ? 0 : "-100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}
    >
      <nav
        className="aivora-nav w-full"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo — swap span for <Image src="/aivora-logo.png" .../> once logo file is in /public */}
          <Link href="/" aria-label="AIVORA Home" className="flex items-center">
            <span className="text-xl font-black tracking-tight text-[#C12129]">AIVORA</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className={linkClass("/")}>
              HOME
            </Link>

            {/* Services Dropdown (Desktop) */}
            <div
              ref={servicesRef}
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                aria-haspopup="menu"
                className="flex items-center hover:text-red-500"
                onClick={() => setServicesOpen((v) => !v)}
                onKeyDown={onDesktopServicesKeyDown}
              >
                SERVICES <Chevron open={servicesOpen} />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    id="services-dropdown"
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: [0.33, 1, 0.68, 1] }}
                    className="absolute left-0 mt-3 w-64 bg-[#0a0a0a] border border-white/8 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden"
                  >
                    {/* Top accent line */}
                    <div className="h-px w-full bg-gradient-to-r from-[#c21219]/40 via-white/10 to-transparent" />
                    <div className="grid grid-cols-3 gap-1 p-3">
                      {serviceItems.map((item, idx) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          ref={(el) => { desktopServiceRefs.current[idx] = el; }}
                          onClick={() => setServicesOpen(false)}
                          className="group flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-colors duration-150 hover:bg-white/[0.06] text-center"
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden ${item.bg} ${item.border} border`}>
                            {item.logo
                              ? <Image src={item.logo} alt={item.short} width={22} height={22} className="object-contain" />
                              : <span className={`h-2 w-2 rounded-full ${item.dot}`} />
                            }
                          </div>
                          <p className={`text-[10px] font-semibold leading-tight ${item.text}`}>
                            {item.short}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/jobs" className={linkClass("/jobs")}>
              PROJECTS
            </Link>

            <Link href="/contact" className={linkClass("/contact")}>
              CONTACT US
            </Link>

          </div>

          {/* Account + tools + mobile hamburger — always at the far right */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* Tools peek — desktop only */}
            <div className="hidden md:block">
              <PeekView />
            </div>

            {/* Sign In + Get Started — desktop, guests only */}
            {!authLoading && !isAuthenticated && (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/signin"
                  className="px-4 py-2 rounded-xl text-sm font-semibold border border-white/20 text-white/80 hover:border-[#C12129] hover:text-[#C12129] transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#C12129] text-white hover:bg-[#a01a20] transition-colors duration-200 shadow-[0_0_12px_rgba(193,33,41,0.4)]"
                >
                  Get Started
                </Link>
              </div>
            )}

            <div className="relative hidden md:block">
              <AccountMenu />
              {renderNotificationBadge()}
            </div>

            <button
              type="button"
              className="md:hidden flex items-center justify-center w-8 h-8"
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {!isOpen ? "☰" : "✕"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-nav"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black px-4 pb-4 space-y-2"
            >
              <Link
                href="/"
                className="block py-2 hover:text-red-500"
                onClick={() => setIsOpen(false)}
              >
                HOME
              </Link>

              {/* Services (Mobile) */}
              <div ref={mobileServicesRef}>
                <button
                  type="button"
                  aria-haspopup="menu"
                  className="flex justify-between w-full py-2"
                  onClick={() => setServicesOpen((v) => !v)}
                  onKeyDown={onMobileServicesKeyDown}
                >
                  SERVICES <Chevron open={servicesOpen} />
                </button>

                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      id="mobile-services-dropdown"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-1 space-y-0.5 overflow-hidden"
                    >
                      <div className="grid grid-cols-3 gap-1 pt-1">
                        {serviceItems.map((item, idx) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            ref={(el) => { mobileServiceRefs.current[idx] = el; }}
                            onClick={() => { setServicesOpen(false); setIsOpen(false); }}
                            className="group flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/[0.06] transition-colors text-center"
                          >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.bg} ${item.border} border`}>
                              {item.logo
                                ? <Image src={item.logo} alt={item.short} width={18} height={18} className="object-contain" />
                                : <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
                              }
                            </div>
                            <span className={`text-[10px] font-semibold leading-tight ${item.text}`}>{item.short}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/jobs" className="block py-2 hover:text-red-500">
                PROJECTS
              </Link>

              <Link
                href="/contact"
                className="block py-2 hover:text-red-500"
                onClick={() => setIsOpen(false)}
              >
                CONTACT US
              </Link>

              {/* Theme toggle — mobile */}
              <div className="pt-1 flex items-center gap-2">
                <ThemeToggle />
                <span className="text-xs aivora-text-muted">Day / Night</span>
              </div>

              {/* Tools peek */}
              <div className="pt-1">
                <PeekView />
              </div>

              {/* Sign In + Get Started — mobile, guests only */}
              {!authLoading && !isAuthenticated && (
                <div className="flex flex-col gap-2 pt-2">
                  <Link href="/signin" onClick={() => setIsOpen(false)}
                    className="text-center py-2.5 rounded-xl text-sm font-semibold border border-white/20 text-white/80 hover:border-[#C12129] hover:text-[#C12129] transition-colors">
                    Sign In
                  </Link>
                  <Link href="/signup" onClick={() => setIsOpen(false)}
                    className="text-center py-2.5 rounded-xl text-sm font-semibold bg-[#C12129] text-white hover:bg-[#a01a20] transition-colors">
                    Get Started
                  </Link>
                </div>
              )}

              {/* Account Mobile */}
              <div className="pt-2 relative inline-block">
                <AccountMenu align="left" />
                {renderNotificationBadge("mobile")}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-0.5 bg-red-700" />
      </nav>

    </motion.header>
  );
};

/* Chevron */
const Chevron: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    aria-hidden="true"
    className={`ml-1 h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

export default Navbar;
