"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const COLUMNS = [
  {
    heading: "Platform",
    links: [
      { label: "LAMID CORE",   href: "/talent"      },
      { label: "LAMID GROW",   href: "/biz"         },
      { label: "LAMID TALENT", href: "/hcd"         },
      { label: "Pricing",      href: "/pricing"     },
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
    <footer className="lamidone-section border-t border-white/8 dark:border-white/8 border-gray-200">

      {/* ── Main: brand block left + 3 columns ── */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 pt-14 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 items-start">

          {/* Brand block: LAMID ONE + taglines at top, LAMID logo at base */}
          <div className="col-span-2 sm:col-span-1 flex flex-col gap-2 pr-4">
            {/* LAMID ONE — ecosystem brand name */}
            <span className="text-xl font-black tracking-tight lamidone-gradient-text leading-none">
              LAMID ONE
            </span>

            {/* Taglines */}
            <p className="text-xs lamidone-gradient-text font-semibold">Human Insight. AI Precision. One Ecosystem.</p>
            <p className="text-xs text-gray-500 dark:text-white/40 leading-relaxed">
              The HumanAI Consulting &amp; Growth Ecosystem.
            </p>

            {/* LAMID logo — parent brand, sits at base */}
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
                      className="text-sm text-gray-500 dark:text-white/40 hover:text-[#2563EB] dark:hover:text-[#2563EB] transition-colors duration-200"
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
            © 2026 LAMID ONE. All rights reserved. | Human Insight. AI Precision. One Ecosystem.
          </p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
