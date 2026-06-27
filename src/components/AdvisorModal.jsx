"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, User, Mail, Phone, Briefcase, MessageSquare, CheckCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const SERVICES = [
  "BIZ for Market Access",
  "BIZ for Finance Access",
  "Business Clinic",
  "General Advisory",
  "Mentorship & Strategy",
  "Other",
];

const EMPTY = { name: "", email: "", whatsapp: "", service: "", challenge: "" };

export default function AdvisorModal({ isOpen, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) { setForm(EMPTY); setSuccess(false); }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.whatsapp || !form.challenge) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/bizphere/advisor", {
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

  const inputBase = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
  };
  const focusStyle = (e) => (e.target.style.borderColor = "rgba(59,130,246,0.55)");
  const blurStyle  = (e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)");

  return (
    <AnimatePresence>
      {isOpen && (
        /* Backdrop — partial opacity so the rest of the page stays visible */
        <motion.div
          key="advisor-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onClick={onClose}
        >
          {/* Drawer — slides in from the right, leaves most of the screen uncovered */}
          <motion.div
            key="advisor-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="absolute top-0 right-0 h-full w-full max-w-sm flex flex-col overflow-hidden"
            style={{
              background: "radial-gradient(ellipse at 80% 0%, #030d1c 0%, #070a10 40%, #080808 100%)",
              borderLeft: "1px solid rgba(59,130,246,0.2)",
              boxShadow: "-16px 0 48px rgba(0,0,0,0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Subtle stripe texture */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
              style={{ backgroundImage: "repeating-linear-gradient(135deg,#fff 0px,#fff 1px,transparent 1px,transparent 28px)" }}
            />
            {/* Top corner glow */}
            <div className="absolute -top-10 right-0 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none z-0" />

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors duration-200"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Scrollable content */}
            <div className="relative z-10 flex-1 overflow-y-auto p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {success ? (
                  /* ── Success ── */
                  <motion.div
                    key="advisor-success"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="flex flex-col items-center text-center gap-5 py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.1 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ background: "radial-gradient(circle,rgba(59,130,246,0.2) 0%,rgba(59,130,246,0.05) 100%)", border: "1px solid rgba(59,130,246,0.35)" }}
                    >
                      <CheckCircle className="h-8 w-8 text-blue-400" />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-black text-white">Request Received!</h3>
                      <p className="mt-2 text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
                        An advisor will review your details and reach out via WhatsApp or email within 1 business day.
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="mt-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-105 bg-blue-600 hover:bg-blue-500"
                    >
                      Done
                    </button>
                    <p className="text-[10px] text-gray-600 tracking-wide">One Ecosystem. Every Layer of Impact</p>
                  </motion.div>
                ) : (
                  /* ── Form ── */
                  <motion.div key="advisor-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-5 pr-8">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-blue-500/15 border border-blue-500/30">
                        <MessageSquare className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Free Consultation</span>
                        <h2 className="text-lg font-black text-white leading-tight">Talk to an Advisor</h2>
                      </div>
                    </div>

                    <p className="text-sm text-gray-400 leading-relaxed mb-5">
                      Get a free business diagnostic — tell us your challenge and an expert will map the path forward.
                    </p>

                    <div className="h-px mb-5" style={{ background: "linear-gradient(90deg,rgba(59,130,246,0.35),transparent)" }} />

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Full name <span className="text-blue-400">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-600 pointer-events-none" />
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            required
                            className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors duration-200"
                            style={inputBase}
                            onFocus={focusStyle}
                            onBlur={blurStyle}
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Email <span className="text-blue-400">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-600 pointer-events-none" />
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                            className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors duration-200"
                            style={inputBase}
                            onFocus={focusStyle}
                            onBlur={blurStyle}
                          />
                        </div>
                      </div>

                      {/* WhatsApp */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          WhatsApp <span className="text-blue-400">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-600 pointer-events-none" />
                          <input
                            type="tel"
                            name="whatsapp"
                            value={form.whatsapp}
                            onChange={handleChange}
                            placeholder="+234 800 000 0000"
                            required
                            className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors duration-200"
                            style={inputBase}
                            onFocus={focusStyle}
                            onBlur={blurStyle}
                          />
                        </div>
                      </div>

                      {/* Service interest */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Service <span className="text-gray-600 normal-case font-normal">(optional)</span>
                        </label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-600 pointer-events-none" />
                          <select
                            name="service"
                            value={form.service}
                            onChange={handleChange}
                            className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm text-white outline-none transition-colors duration-200 appearance-none"
                            style={{ ...inputBase, color: form.service ? "#fff" : "#4b5563" }}
                            onFocus={focusStyle}
                            onBlur={blurStyle}
                          >
                            <option value="" disabled>Select a service area</option>
                            {SERVICES.map((s) => (
                              <option key={s} value={s} style={{ background: "#111", color: "#fff" }}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Challenge */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Your challenge <span className="text-blue-400">*</span>
                        </label>
                        <textarea
                          name="challenge"
                          value={form.challenge}
                          onChange={handleChange}
                          placeholder="Tell us about your business and the challenge you're facing…"
                          required
                          rows={4}
                          maxLength={500}
                          className="w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors duration-200 resize-none"
                          style={inputBase}
                          onFocus={focusStyle}
                          onBlur={blurStyle}
                        />
                        <p className="text-right text-[10px] text-gray-600">{form.challenge.length}/500</p>
                      </div>

                      {/* Submit */}
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={!loading ? { scale: 1.02 } : {}}
                        whileTap={!loading ? { scale: 0.98 } : {}}
                        className="relative w-full py-3 rounded-xl font-bold text-sm text-white overflow-hidden transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-500"
                        style={{ boxShadow: "0 6px 20px rgba(59,130,246,0.28)" }}
                      >
                        <span className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none" />
                        <span className="relative flex items-center justify-center gap-2">
                          {loading
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
                            : <>Request a Free Diagnostic</>
                          }
                        </span>
                      </motion.button>

                      <p className="text-center text-[10px] text-gray-600 tracking-wide pb-4">
                        A LAMID advisor will respond within 1 business day.
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
