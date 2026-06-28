"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const COLUMNS = [
  {
    heading: "Platform",
    links: [
      { label: "Marketplace",   href: "/talent"      },
      { label: "BIZ Portal",    href: "/biz"         },
      { label: "Talent Portal", href: "/hcd"         },
      { label: "Pricing",       href: "/pricing"     },
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

      {/* ── Main: brand block left + 3 columns ── */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 pt-14 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 items-start">

          {/* Brand block: AIVORA + taglines at top, LAMID logo at base */}
          <div className="col-span-2 sm:col-span-1 flex flex-col gap-2 pr-4">
            {/* AIVORA — ecosystem brand name */}
            <span className="text-xl font-black tracking-tight aivora-gradient-text leading-none">
              AIVORA
            </span>

            {/* Taglines */}
            <p className="text-xs aivora-gradient-text font-semibold">Smarter. Faster. Accessible.</p>
            <p className="text-xs text-gray-500 dark:text-white/40 leading-relaxed">
              The Human–AI Consulting Ecosystem.
            </p>

            {/* LAMID logo — the legacy root, sits at base */}
            <Link href="/" className="inline-block mt-4">
              <Image
                src="/Logo.png"
                alt="LAMID Consulting"
                width={88}
                height={30}
                className="object-contain opacity-50 dark:opacity-35 hover:opacity-70 dark:hover:opacity-55 transition-opacity duration-200"
              />
            </Link>
          </div>

          {/* 3 nav columns */}
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400 dark:text-white/30 mb-4">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 dark:text-white/40 hover:text-[#C12129] dark:hover:text-[#C12129] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Copyright bar ── */}
      <div className="border-t border-white/6 dark:border-white/6 border-gray-100">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-4">
          <p className="text-xs text-gray-400 dark:text-white/25">
            © 2026 AIVORA. All rights reserved. | Smarter. Faster. Accessible.
          </p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
