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
      { label: "About",       href: "/portfolio"   },
      { label: "For Experts", href: "/for-experts" },
      { label: "Careers",     href: "/contact"     },
      { label: "Contact",     href: "/contact"     },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy",   href: "/privacy" },
      { label: "Terms of Service", href: "/terms"   },
      { label: "Cookie Policy",    href: "/privacy" },
      { label: "Security",         href: "/privacy" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="aivora-section border-t border-white/8 dark:border-white/8 border-gray-200">

      {/* ── Main grid: logo beside columns ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Brand block ── */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="inline-block">
              <Image
                src="/Logo.png"
                alt="AIVORA"
                width={120}
                height={40}
                className="object-contain"
              />
            </Link>
            <p className="text-sm aivora-gradient-text font-semibold leading-snug">
              Smarter. Faster. Accessible.
            </p>
            <p className="text-sm text-gray-500 dark:text-white/40 leading-snug">
              The Human–AI Consulting Ecosystem.
            </p>
          </div>

          {/* ── 3 nav columns ── */}
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] aivora-gradient-text mb-5">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1.5 text-sm text-gray-500 dark:text-white/40 hover:text-[#C12129] dark:hover:text-[#C12129] transition-colors duration-200"
                    >
                      <span className="w-0 group-hover:w-2 transition-all duration-200 h-[1px] bg-[#C12129] inline-block shrink-0" />
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
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400 dark:text-white/25">
            © 2026 AIVORA. All rights reserved.
          </p>
          <p className="text-xs aivora-gradient-text font-semibold tracking-wide">
            Smarter. Faster. Accessible.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
