"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AccountMenu from "./Account";

interface ServiceItem {
  name: string;
  href: string;
}

const serviceItems: ServiceItem[] = [
  { name: "Biz", href: "/biz" },
  { name: "BizPrototype", href: "/bizprototype" },
  { name: "HCD", href: "/hcd" },
  { name: "SustainableDev", href: "/sustainableDev" },
  { name: "Values", href: "/portfolio" },
  { name: "Event", href: "/event" },
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
      } catch { }
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
  const pathname = usePathname();
  const notificationCount = useNotifications();

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
    e: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    if (!servicesOpen) return;
    const items = desktopServiceRefs.current.filter(
      Boolean
    ) as HTMLAnchorElement[];
    const currentIndex = items.findIndex(
      (el) => el === document.activeElement
    );

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
    e: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    if (!servicesOpen) return;
    const items = mobileServiceRefs.current.filter(
      Boolean
    ) as HTMLAnchorElement[];
    const currentIndex = items.findIndex(
      (el) => el === document.activeElement
    );

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
      className={`absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center ${size === "mobile"
          ? "h-4 min-w-[16px] px-1"
          : "h-5 min-w-[20px] px-1.5"
        }`}
      aria-label={`${notificationCount} unread notifications`}
    >
      {notificationCount > 99 ? "99+" : notificationCount}
    </span>
  );

  const linkClass = (href: string) =>
    `hover:text-red-500 ${pathname === href ? "text-red-500" : "text-white"
    }`;

  return (
    <header>
      <nav
        className="bg-black text-white fixed top-0 w-full z-50"
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
                aria-haspopup="true"
                aria-expanded={servicesOpen}
                aria-controls="services-dropdown"
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
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-48 bg-black rounded shadow-lg"
                  >
                    <ul className="py-1">
                      {serviceItems.map((item, idx) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            ref={(el) => {
                              desktopServiceRefs.current[idx] = el;
                            }
                            }
                            className="block px-4 py-2 hover:text-red-500 focus:bg-gray-800"
                            onClick={() => setServicesOpen(false)}
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
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

          {/* Account + mobile hamburger — always at the far right */}
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <AccountMenu />
              {renderNotificationBadge()}
            </div>

            <button
              type="button"
              className="md:hidden"
              onClick={() => setIsOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
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
                  aria-haspopup="true"
                  aria-expanded={servicesOpen}
                  aria-controls="mobile-services-dropdown"
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
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="pl-4"
                    >
                      <ul className="space-y-1">
                        {serviceItems.map((item, idx) => (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              ref={(el) => {
                                mobileServiceRefs.current[idx] = el;
                              }}
                              className="block py-1 hover:text-red-500"
                              onClick={() => {
                                setServicesOpen(false);
                                setIsOpen(false);
                              }}
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/jobs"
                className="block py-2 hover:text-red-500"
              >
                PROJECTS
              </Link>

              <Link
                href="/contact"
                className="block py-2 hover:text-red-500"
                onClick={() => setIsOpen(false)}
              >
                CONTACT US
              </Link>

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
    </header>
  );
};

/* Chevron */
const Chevron: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    aria-hidden="true"
    className={`ml-1 h-4 w-4 transition-transform ${open ? "rotate-180" : ""
      }`}
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