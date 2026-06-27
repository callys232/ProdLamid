"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import axios from "axios";

const COLUMNS = [
  {
    heading: "Platform",
    links: [
      { label: "Marketplace",   href: "/talent"   },
      { label: "BIZ Portal",    href: "/biz"      },
      { label: "Talent Portal", href: "/hcd"      },
      { label: "How It Works",  href: "/#how-it-works" },
      { label: "Pricing",       href: "/pricing"  },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About AIVORA", href: "/portfolio" },
      { label: "Our Story",    href: "/portfolio" },
      { label: "Careers",      href: "/contact"   },
      { label: "Press",        href: "/contact"   },
    ],
  },
  {
    heading: "For Experts",
    links: [
      { label: "Join as an Expert Partner", href: "/signup"  },
      { label: "Expert Standards",          href: "/contact" },
      { label: "FAQs",                      href: "/pricing" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Case Studies", href: "/portfolio" },
      { label: "Help Center",  href: "/contact"   },
      { label: "Events",       href: "/events"    },
      { label: "API Docs",     href: "/contact"   },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use",   href: "/terms"   },
      { label: "Cookie Policy",  href: "/privacy" },
    ],
  },
];

const Footer = () => {
  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await axios.post("/api/newsletter/subscribe", { email });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <footer className="aivora-section border-t border-white/8 dark:border-white/8 border-gray-200">

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 pt-14 pb-10">

        {/* Top row — wordmark + tagline + newsletter */}
        <div className="flex flex-col lg:flex-row justify-between gap-10 mb-12">

          {/* Brand block */}
          <div className="flex flex-col gap-4 max-w-xs">
            <Link href="/" className="inline-block">
              <Image
                src="/Logo.png"
                alt="AIVORA"
                width={140}
                height={48}
                className="object-contain"
              />
            </Link>
            <p className="text-sm text-gray-500 dark:text-white/45 leading-relaxed">
              Built for organizations that refuse to stand still.
            </p>
            <div className="flex gap-3 mt-1">
              {[
                { Icon: FaLinkedin,  href: "https://linkedin.com"  },
                { Icon: FaTwitter,   href: "https://twitter.com"   },
                { Icon: FaFacebook,  href: "https://facebook.com"  },
                { Icon: FaInstagram, href: "https://instagram.com" },
              ].map(({ Icon, href }) => (
                <Link
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 dark:text-white/30 hover:text-[#C12129] transition-colors duration-200"
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="max-w-sm w-full">
            <p className="text-xs font-bold uppercase tracking-widest text-[#C12129] mb-2">
              Stay Informed
            </p>
            <p className="text-sm text-gray-500 dark:text-white/45 mb-4 leading-relaxed">
              Intelligence, insights, and ecosystem updates — direct to your inbox.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-white/5 dark:bg-white/5 border border-white/10 dark:border-white/10 border-gray-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-[#C12129]/50 transition-colors"
              />
              <motion.button
                type="submit"
                disabled={status === "loading"}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#C12129] hover:bg-[#a01a20] disabled:opacity-50 transition-colors"
              >
                {status === "loading" ? "..." : "Subscribe"}
              </motion.button>
            </form>
            {status === "success" && (
              <p className="text-emerald-500 text-xs mt-2">You&apos;re subscribed. Welcome to the ecosystem.</p>
            )}
            {status === "error" && (
              <p className="text-red-400 text-xs mt-2">Something went wrong. Try again.</p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/6 dark:bg-white/6 bg-gray-200 mb-10" />

        {/* Five-column navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C12129] mb-4">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 dark:text-white/45 hover:text-[#C12129] dark:hover:text-[#C12129] transition-colors duration-200"
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

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/6 dark:border-white/6 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400 dark:text-white/25">
            © 2026 AIVORA. All rights reserved.
          </p>
          <p className="text-xs font-semibold text-[#C12129] tracking-wide">
            AIVORA — Smarter. Faster. Accessible.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
