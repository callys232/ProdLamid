"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const COLUMNS = [
  {
    heading: "Platform",
    links: [
      { label: "Marketplace",   href: "/talent"   },
      { label: "BIZ Portal",    href: "/biz"      },
      { label: "Talent Portal", href: "/hcd"      },
      { label: "Pricing",       href: "/pricing"  },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About",      href: "/portfolio" },
      { label: "For Experts", href: "/signup"   },
      { label: "Careers",    href: "/contact"   },
      { label: "Contact",    href: "/contact"   },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy",  href: "/privacy" },
      { label: "Terms of Service", href: "/terms"  },
      { label: "Cookie Policy",   href: "/privacy" },
      { label: "Security",        href: "/privacy" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="aivora-section border-t border-white/8 dark:border-white/8 border-gray-200">

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 pt-14 pb-10">

        {/* Brand block above columns */}
        <div className="flex flex-col gap-2 mb-10">
          <Link href="/" className="inline-block">
            <Image src="/Logo.png" alt="AIVORA" width={120} height={40} className="object-contain" />
          </Link>
          <p className="text-sm text-[#C12129] font-medium">Smarter. Faster. Accessible.</p>
          <p className="text-sm text-gray-500 dark:text-white/45">The Human–AI Consulting Ecosystem.</p>
        </div>

        <div className="h-px bg-white/6 dark:bg-white/6 bg-gray-200 mb-10" />

        {/* 3-column navigation (matches prototype) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C12129] mb-4">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}
                      className="text-sm text-gray-500 dark:text-white/45 hover:text-[#C12129] dark:hover:text-[#C12129] transition-colors duration-200 hover:translate-x-0.5 inline-block">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/6 dark:border-white/6 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400 dark:text-white/25">
            © 2026 AIVORA. All rights reserved. | Smarter. Faster. Accessible.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
