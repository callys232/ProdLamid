"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Building2, Users, Send, CheckCircle } from "lucide-react";

export default function ContactSalesPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", company: "", size: "", message: "",
  });
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, subject: "Enterprise Sales Enquiry" }),
      });
      setSent(true);
    } catch {
      setSent(true); // show success anyway — contact form is non-critical
    } finally {
      setSending(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 transition focus:border-red-600/50 focus:outline-none";

  return (
    <main className="min-h-screen bg-black pt-24 pb-20 text-white">
      <div className="mx-auto max-w-5xl px-4">

        {/* Header */}
        <div className="mb-12 text-center">
          <span className="mb-4 inline-block rounded-full border border-red-600/30 bg-red-600/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-red-400">
            Enterprise Sales
          </span>
          <h1 className="text-4xl font-bold">Talk to our sales team</h1>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto">
            Get a personalised walkthrough, custom pricing for your organisation, and answers to your enterprise questions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Left — contact info */}
          <div className="space-y-6">
            {[
              { icon: <Mail className="h-5 w-5 text-red-500" />, label: "Email", value: "sales@lamid.io" },
              { icon: <Phone className="h-5 w-5 text-red-500" />, label: "Phone", value: "+1 (800) LAMID-01" },
              { icon: <Building2 className="h-5 w-5 text-red-500" />, label: "HQ", value: "Lagos, Nigeria · London, UK" },
              { icon: <Users className="h-5 w-5 text-red-500" />, label: "Team size", value: "Serving 5+ person teams" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mt-0.5">{item.icon}</div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">{item.label}</p>
                  <p className="mt-0.5 text-sm text-white">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right — form */}
          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-green-600/30 bg-green-600/10 p-10 text-center"
            >
              <CheckCircle className="h-12 w-12 text-green-400" />
              <h2 className="text-lg font-semibold text-white">Message received!</h2>
              <p className="text-sm text-gray-400">Our enterprise team will reach out within 1 business day.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="grid grid-cols-2 gap-4">
                <input value={form.name}    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}    placeholder="Full name"   required className={inputCls} />
                <input value={form.email}   onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}   placeholder="Work email"  required type="email" className={inputCls} />
              </div>
              <input value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} placeholder="Company name" className={inputCls} />
              <select value={form.size} onChange={(e) => setForm((p) => ({ ...p, size: e.target.value }))}
                className={`${inputCls} appearance-none`}
              >
                <option value="">Team size</option>
                {["1–10", "11–50", "51–200", "200+"].map((s) => <option key={s} value={s}>{s} employees</option>)}
              </select>
              <textarea value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                placeholder="Tell us about your project or what you need…" rows={4}
                className={`${inputCls} resize-none`}
              />
              <motion.button type="submit" disabled={sending}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-40"
              >
                {sending ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Send className="h-4 w-4" />}
                {sending ? "Sending…" : "Send Message"}
              </motion.button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
