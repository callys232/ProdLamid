"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AccountMenu from "./Account";
import PeekView from "@/components/peekview/PeekView";
import HowWeServeModal from "./HowWeServeModal";

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
  { name: "Human Capital Development", short: "HCD",       href: "/hcd",            logo: "/hcdLogo.png",    text: "text-orange-400",  bg: "bg-orange-500/10",  border: "border-orange-500/25", dot: "bg-orange-400"  },
  { name: "Sustainable Development",   short: "SD",        href: "/sustainableDev", logo: "/sdLogo.png",     text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/25",dot: "bg-emerald-400" },
  { name: "Portal",                    short: "Portal",    href: "/portal",         logo: "/portalLogo.png", text: "text-red-500",     bg: "bg-red-500/10",     border: "border-red-500/25",    dot: "bg-red-500"     },
  { name: "Portfolio",                 short: "Portfolio", href: "/portfolio",      logo: undefined,         text: "text-gray-400",    bg: "bg-white/5",        border: "border-white/10",      dot: "bg-gray-400"    },
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
  const [howWeServeOpen, setHowWeServeOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const notificationCount = useNotifications();

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
        className="bg-black text-white w-full"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" aria-label="Home">
            <Image
              src="/Logo.png"
              alt="Lamid Consulting Logo"
              width={120}
              height={40}
              priority
            />
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
                    <div className="py-2">
                      {serviceItems.map((item, idx) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          ref={(el) => { desktopServiceRefs.current[idx] = el; }}
                          onClick={() => setServicesOpen(false)}
                          className="group flex items-center gap-3 px-4 py-2.5 transition-colors duration-150 hover:bg-white/[0.04]"
                        >
                          {/* Logo or fallback dot */}
                          <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden ${item.bg} ${item.border} border`}>
                            {item.logo
                              ? <Image src={item.logo} alt={item.short} width={20} height={20} className="object-contain" />
                              : <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
                            }
                          </div>
                          {/* Name */}
                          <div className="min-w-0">
                            <p className={`text-[13px] font-semibold leading-tight truncate transition-colors duration-150 ${item.text}`}>
                              {item.short}
                            </p>
                            <p className="text-[10px] text-gray-500 leading-tight truncate group-hover:text-gray-400 transition-colors duration-150">
                              {item.name}
                            </p>
                          </div>
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

            <motion.button
              type="button"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 22px rgba(194,18,25,0.7)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setHowWeServeOpen(true)}
              className="group relative inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white overflow-hidden
                bg-gradient-to-r from-[#c21219] via-rose-600 to-rose-500
                shadow-[0_0_14px_rgba(194,18,25,0.4)]"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" />
              <span className="relative z-10">How We Serve</span>
              <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </motion.button>
          </div>

          {/* Account + tools + mobile hamburger — always at the far right */}
          <div className="flex items-center gap-2">
            {/* Tools peek — desktop only */}
            <div className="hidden md:block">
              <PeekView />
            </div>

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
                      {serviceItems.map((item, idx) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          ref={(el) => { mobileServiceRefs.current[idx] = el; }}
                          onClick={() => { setServicesOpen(false); setIsOpen(false); }}
                          className="flex items-center gap-2.5 py-2 px-2 rounded-lg hover:bg-white/[0.04] transition-colors"
                        >
                          <div className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center ${item.bg} ${item.border} border`}>
                            {item.logo
                              ? <Image src={item.logo} alt={item.short} width={16} height={16} className="object-contain" />
                              : <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
                            }
                          </div>
                          <span className={`text-sm font-semibold ${item.text}`}>{item.short}</span>
                        </Link>
                      ))}
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

              <button
                type="button"
                onClick={() => {
                  setHowWeServeOpen(true);
                  setIsOpen(false);
                }}
                className="group relative flex items-center justify-between w-full mt-1 px-4 py-2.5 rounded-xl text-xs font-bold text-white overflow-hidden
                  bg-gradient-to-r from-[#c21219] via-rose-600 to-rose-500
                  shadow-[0_0_12px_rgba(194,18,25,0.35)]"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" />
                <span className="relative z-10">How We Serve</span>
                <span className="relative z-10">→</span>
              </button>

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

      <HowWeServeModal
        open={howWeServeOpen}
        onClose={() => setHowWeServeOpen(false)}
      />
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
