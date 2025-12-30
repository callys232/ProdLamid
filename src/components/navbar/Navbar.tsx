"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  { name: "Portfolio", href: "/portfolio" },
  { name: "Event", href: "/event" },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const mobileServicesRef = useRef<HTMLDivElement>(null);
  const desktopServiceRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const mobileServiceRefs = useRef<(HTMLAnchorElement | null)[]>([]);

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

  const onDesktopServicesKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    if (!servicesOpen) return;
    const items = desktopServiceRefs.current.filter(
      Boolean
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

  const onMobileServicesKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    if (!servicesOpen) return;
    const items = mobileServiceRefs.current.filter(
      Boolean
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
            <Link href="/" className="hover:text-red-500">
              HOME
            </Link>

            {/* Services Dropdown (Desktop) */}
            <div ref={servicesRef} className="relative">
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
              {servicesOpen && (
                <div
                  id="services-dropdown"
                  className="absolute left-0 mt-2 w-48 bg-black rounded shadow-lg"
                  aria-label="Services"
                >
                  <ul className="py-1">
                    {serviceItems.map((item, idx) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          ref={(el) => {
                            desktopServiceRefs.current[idx] = el;
                          }}
                          className="block w-full text-left px-4 py-2 hover:text-red-500 focus:bg-gray-800 focus:outline-none"
                          onClick={() => setServicesOpen(false)}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Link href="/contact" className="hover:text-red-500">
              CONTACT US
            </Link>

            {/* Account */}
            <AccountMenu />
          </div>

          {/* Mobile Hamburger */}
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

        {/* Mobile Menu */}
        {isOpen && (
          <div
            id="mobile-nav"
            className="md:hidden bg-black px-4 pb-4 space-y-2"
          >
            <Link
              href="/"
              className="block py-2 hover:text-red-500"
              onClick={() => setIsOpen(false)}
            >
              HOME
            </Link>
            <Link
              href="/portfolio"
              className="block py-2 hover:text-red-500"
              onClick={() => setIsOpen(false)}
            >
              PORTFOLIO
            </Link>
            <Link
              href="/talentclub"
              className="block py-2 hover:text-red-500"
              onClick={() => setIsOpen(false)}
            >
              TALENT CLUB
            </Link>

            {/* Services Dropdown (Mobile) */}
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
              {servicesOpen && (
                <div
                  id="mobile-services-dropdown"
                  className="pl-4"
                  aria-label="Services"
                >
                  <ul className="space-y-1">
                    {serviceItems.map((item, idx) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          ref={(el) => {
                            mobileServiceRefs.current[idx] = el;
                          }}
                          className="block w-full text-left py-1 hover:text-red-500"
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
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className="block py-2 hover:text-red-500"
              onClick={() => setIsOpen(false)}
            >
              CONTACT US
            </Link>

            {/* Account Dropdown */}
            <div className="pt-2">
              <AccountMenu align="left" />
            </div>
          </div>
        )}

        <div className="h-0.5 bg-red-700" />
      </nav>
    </header>
  );
};

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
