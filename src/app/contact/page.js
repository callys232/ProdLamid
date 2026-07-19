"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const CARDS = [
  {
    icon: "◈",
    title: "For Organizations",
    body:  "Ready to explore LAMID ONE for your organization? Book a 30-minute discovery call and we'll build a recommended configuration for your context.",
    cta:   "Book a Discovery Call",
    href:  "/signup",
  },
  {
    icon: "⬡",
    title: "For Expert Partners",
    body:  "Interested in joining the LAMID CORE? Begin your application or reach out to our Expert Partnerships team.",
    cta:   "Start Your Application",
    href:  "/for-experts",
    sub:   "experts@lamid.io",
  },
  {
    icon: "⬟",
    title: "For Investors & Partners",
    body:  "For investment inquiries, strategic partnership discussions, or media requests, please contact our team directly.",
    cta:   "Contact Investor Relations",
    href:  "mailto:investors@lamid.io",
    sub:   "investors@lamid.io",
  },
];

const ENQUIRY_TYPES = [
  "Getting Started",
  "Expert Partnership",
  "Enterprise Pricing",
  "Investor Relations",
  "Media",
  "Other",
];

const fadeUp = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.45, delay: d } });

export default function ContactPage() {
  const [form,    setForm]    = useState({ name: "", org: "", email: "", type: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setError("Please fill in all required fields."); return; }
    setSending(true); setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError("Something went wrong. Email us directly at hello@lamid.io");
    } finally {
      setSending(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl text-sm aivora-card border text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-[#2563EB]/50 transition-colors";

  return (
    <main className="aivora-section min-h-screen pt-24 pb-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* ── Hero ── */}
        <motion.div {...fadeUp(0)} className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 leading-tight">
            Let&apos;s talk.
          </h1>
          <p className="text-gray-500 dark:text-white/50 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Whether you&apos;re exploring LAMID ONE for the first time, ready to get started, or looking to partner with us — we&apos;d love to hear from you.
          </p>
        </motion.div>

        {/* ── 3 Contact cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {CARDS.map((card, i) => {
            const [hov, setHov] = useState(false);
            return (
              <motion.div key={card.title} {...fadeUp(i * 0.08)}
                onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
                className="aivora-card border rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200"
                style={{ borderColor: hov ? "rgba(37,99,235,0.4)" : undefined }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#2563EB]/12 border border-[#2563EB]/25">
                  <span className="text-base aivora-gradient-text">{card.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{card.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-white/45 leading-relaxed">{card.body}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Link href={card.href}
                    className="text-xs font-semibold aivora-gradient-text hover:opacity-70 transition-opacity">
                    {card.cta} →
                  </Link>
                  {card.sub && <span className="text-[10px] text-gray-400 dark:text-white/25">{card.sub}</span>}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Contact form ── */}
        <motion.div {...fadeUp(0.1)} className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-8">Send us a message.</h2>

          {sent ? (
            <div className="aivora-card border border-emerald-500/30 rounded-2xl p-10 text-center">
              <p className="text-emerald-400 font-semibold mb-2">Message received.</p>
              <p className="text-sm text-gray-500 dark:text-white/50 leading-relaxed">
                We&apos;ll respond within 2 business hours. If urgent, email us at{" "}
                <a href="mailto:hello@lamid.io" className="aivora-gradient-text hover:opacity-70 transition-opacity">hello@lamid.io</a>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-white/40 block mb-1.5">
                    Full Name <span className="text-[#2563EB]">*</span>
                  </label>
                  <input type="text" value={form.name} onChange={set("name")} required className={inputCls} placeholder="Jane Okafor" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-white/40 block mb-1.5">
                    Organization Name
                  </label>
                  <input type="text" value={form.org} onChange={set("org")} className={inputCls} placeholder="Apex Group" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-white/40 block mb-1.5">
                  Email Address <span className="text-[#2563EB]">*</span>
                </label>
                <input type="email" value={form.email} onChange={set("email")} required className={inputCls} placeholder="jane@apexgroup.com" />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-white/40 block mb-1.5">
                  Enquiry Type
                </label>
                <select value={form.type} onChange={set("type")} aria-label="Enquiry type"
                  className={inputCls + " appearance-none cursor-pointer"}>
                  <option value="">Select a reason…</option>
                  {ENQUIRY_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-white/40 block mb-1.5">
                  Message <span className="text-[#2563EB]">*</span>
                </label>
                <textarea value={form.message} onChange={set("message")} required rows={4} className={inputCls + " resize-none"}
                  placeholder="Tell us what you need…" />
              </div>
              {error && <p className="text-xs text-blue-400">{error}</p>}
              <motion.button type="submit" disabled={sending}
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(37,99,235,0.5)" }} whileTap={{ scale: 0.97 }}
                className="py-3 rounded-xl text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors cursor-pointer shadow-[0_0_14px_rgba(37,99,235,0.35)]">
                {sending ? "Sending…" : "Send Message"}
              </motion.button>
            </form>
          )}
        </motion.div>

      </div>
    </main>
  );
}
