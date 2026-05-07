"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HeadphonesIcon, MessageSquare, Phone, Mail, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const TICKETS = [
  { id: "LCS-001", subject: "Escrow release request — UNDP project", status: "resolved",    priority: "high",   date: "2 Jun 2026" },
  { id: "LCS-002", subject: "Team member access permissions",         status: "in-progress", priority: "medium", date: "4 Jun 2026" },
  { id: "LCS-003", subject: "Custom report request — Q2 summary",    status: "open",        priority: "low",    date: "6 Jun 2026" },
];

const STATUS_COLOR: Record<string, string> = {
  resolved:      "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  "in-progress": "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  open:          "text-blue-400 bg-blue-500/10 border-blue-500/20",
};

export default function ConciergeSupport() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("medium");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = async () => {
    if (!subject || !message) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitted(true);
    setSubmitting(false);
    setSubject(""); setMessage("");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* SLA badge */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-[#c21219]/30 bg-[#c21219]/5 px-5 py-4 flex items-center gap-4">
        <HeadphonesIcon className="h-8 w-8 text-[#c21219] flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-white">Priority Support — 24/7</p>
          <p className="text-xs text-gray-400">Response SLA: &lt;2 hours for critical · &lt;8 hours for standard</p>
        </div>
        <span className="ml-auto flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
      </motion.div>

      {/* Contact channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: MessageSquare, label: "Live Chat",    sub: "Avg. response: 5 min",   action: "Start Chat",    color: "border-blue-500/30 bg-blue-500/5" },
          { icon: Phone,         label: "Phone",        sub: "+234 800 LAMID 00",       action: "Call Now",      color: "border-emerald-500/30 bg-emerald-500/5" },
          { icon: Mail,          label: "Email",        sub: "support@lamidconsulting.com", action: "Send Email", color: "border-purple-500/30 bg-purple-500/5" },
        ].map(({ icon: Icon, label, sub, action, color }, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`rounded-xl border p-4 flex flex-col items-center text-center gap-2 ${color}`}>
            <Icon className="h-6 w-6 text-white" />
            <p className="text-sm font-semibold text-white">{label}</p>
            <p className="text-xs text-gray-400">{sub}</p>
            <button className="mt-1 px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition">{action}</button>
          </motion.div>
        ))}
      </div>

      {/* Submit ticket */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3">
        <p className="text-sm font-semibold text-white">Submit a Support Ticket</p>

        {submitted ? (
          <div className="flex items-center gap-2 text-emerald-400 text-sm py-4">
            <CheckCircle2 className="h-5 w-5" />Ticket submitted — your PM will respond within 2 hours.
          </div>
        ) : (
          <>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject"
              className="w-full rounded-xl bg-black border border-white/10 text-white text-sm px-4 py-2.5 focus:outline-none focus:border-[#c21219]/60 placeholder-gray-600" />
            <div className="flex gap-3">
              <select value={priority} onChange={e => setPriority(e.target.value)}
                className="rounded-xl bg-black border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#c21219]/60">
                <option value="low">Low priority</option>
                <option value="medium">Medium priority</option>
                <option value="high">High priority</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <textarea rows={3} value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe your issue…"
              className="w-full rounded-xl bg-black border border-white/10 text-white text-sm px-4 py-2.5 focus:outline-none focus:border-[#c21219]/60 resize-none placeholder-gray-600" />
            <button onClick={submit} disabled={!subject || !message || submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c21219] hover:bg-red-700 text-white text-sm font-semibold transition disabled:opacity-40">
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" />Submitting…</> : "Submit Ticket"}
            </button>
          </>
        )}
      </motion.div>

      {/* Open tickets */}
      <div>
        <p className="text-sm font-semibold text-white mb-3">Your tickets</p>
        <div className="space-y-2">
          {TICKETS.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <p className="text-sm text-white">{t.subject}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t.id} · {t.date}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${STATUS_COLOR[t.status]}`}>{t.status}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
