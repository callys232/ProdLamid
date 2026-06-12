"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Mail, Phone, CheckCircle, Loader2, Bell } from "lucide-react";
import toast from "react-hot-toast";

const OVERLAY = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const PANEL = {
  hidden: { opacity: 0, scale: 0.92, y: 32 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 26 } },
  exit: { opacity: 0, scale: 0.94, y: 20, transition: { duration: 0.18 } },
};

const INPUT_STYLE = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
};
const onInputFocus = (e) => (e.target.style.borderColor = "rgba(194,18,25,0.5)");
const onInputBlur  = (e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)");

export default function BizSphereModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* reset state each time the modal opens + lock body scroll */
  useEffect(() => {
    if (isOpen) {
      setForm({ name: "", email: "", whatsapp: "" });
      setSuccess(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  /* trap ESC */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.whatsapp) {
      toast.error("Email and WhatsApp number are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/bizphere/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setSuccess(true);
    } catch (err) {
      toast.error(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          variants={OVERLAY}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.82)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            key="panel"
            variants={PANEL}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="BIZPHERE waitlist"
            className="relative w-full max-w-md rounded-2xl overflow-hidden"
            style={{
              background: "radial-gradient(ellipse at 20% 0%, #1a0404 0%, #0a0a0a 55%, #080808 100%)",
              border: "1px solid rgba(194,18,25,0.25)",
              boxShadow: "0 32px 80px rgba(194,18,25,0.18), 0 0 0 1px rgba(255,255,255,0.04)",
            }}
          >
            {/* Stripe texture overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.04] z-0"
              style={{
                backgroundImage: "repeating-linear-gradient(135deg,#fff 0px,#fff 1px,transparent 1px,transparent 28px)",
              }}
            />
            {/* Top glow */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full bg-[#c21219]/20 blur-3xl pointer-events-none z-0" />

            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors duration-200"
            >
              <X className="h-4 w-4" />
            </button>

            {/* ── Content ── */}
            <div className="relative z-10 p-8 sm:p-10">
              <AnimatePresence mode="wait">
                {success ? (
                  /* ── Success view ── */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="flex flex-col items-center text-center gap-5 py-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.1 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ background: "radial-gradient(circle, rgba(194,18,25,0.25) 0%, rgba(194,18,25,0.05) 100%)", border: "1px solid rgba(194,18,25,0.4)" }}
                    >
                      <CheckCircle className="h-8 w-8 text-[#c21219]" />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-black text-white">You&apos;re on the list!</h3>
                      <p className="mt-2 text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
                        We&apos;ll reach out on WhatsApp or email as soon as early access opens. The BIZ ecosystem is almost ready for you.
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="mt-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-105"
                      style={{ background: "linear-gradient(135deg,#c21219,#8b0f14)" }}
                    >
                      Done
                    </button>
                    <p className="text-[10px] text-gray-600 tracking-wide">One Ecosystem. Every Layer of Impact</p>
                  </motion.div>
                ) : (
                  /* ── Form view ── */
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "rgba(194,18,25,0.15)", border: "1px solid rgba(194,18,25,0.35)" }}
                      >
                        <Bell className="h-5 w-5 text-[#c21219]" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#c21219]">
                          BIZPHERE
                        </span>
                        <h2 className="text-xl font-black text-white leading-tight">
                          Join the Waitlist
                        </h2>
                      </div>
                    </div>

                    <p className="text-sm text-gray-400 leading-relaxed mb-7">
                      Get first access to the exclusive small business networking marketplace — where sellers meet buyers and finance becomes possible.
                    </p>

                    <div className="h-px mb-7" style={{ background: "linear-gradient(90deg,rgba(194,18,25,0.4),transparent)" }} />

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Name (optional) */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Name <span className="text-gray-600 normal-case font-normal">(optional)</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all duration-200"
                          style={INPUT_STYLE}
                          onFocus={onInputFocus}
                          onBlur={onInputBlur}
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Email address <span className="text-[#c21219]">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                            className="w-full rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all duration-200"
                            style={INPUT_STYLE}
                            onFocus={onInputFocus}
                            onBlur={onInputBlur}
                          />
                        </div>
                      </div>

                      {/* WhatsApp */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          WhatsApp number <span className="text-[#c21219]">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                          <input
                            type="tel"
                            name="whatsapp"
                            value={form.whatsapp}
                            onChange={handleChange}
                            placeholder="+234 800 000 0000"
                            required
                            className="w-full rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all duration-200"
                            style={INPUT_STYLE}
                            onFocus={onInputFocus}
                            onBlur={onInputBlur}
                          />
                        </div>
                      </div>

                      {/* Submit */}
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={!loading ? { scale: 1.02 } : {}}
                        whileTap={!loading ? { scale: 0.98 } : {}}
                        className="relative w-full mt-2 py-3.5 rounded-xl font-bold text-sm text-white overflow-hidden transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{
                          background: "linear-gradient(135deg, #c21219 0%, #8b0f14 60%, #5a0a0e 100%)",
                          boxShadow: "0 8px 24px rgba(194,18,25,0.4)",
                        }}
                      >
                        {/* shine sweep */}
                        <span className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none" />
                        <span className="relative flex items-center justify-center gap-2">
                          {loading ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
                          ) : (
                            <>Notify Me When It Launches</>
                          )}
                        </span>
                      </motion.button>

                      <p className="text-center text-[10px] text-gray-600 tracking-wide pt-1">
                        No spam. We&apos;ll only reach out when it matters.
                      </p>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
