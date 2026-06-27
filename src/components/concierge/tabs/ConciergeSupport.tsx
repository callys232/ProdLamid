"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  HeadphonesIcon, MessageSquare, Phone, Mail,
  Clock, CheckCircle2, Loader2, RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { mockSupportTickets, type SupportTicket } from "@/mocks/mockConciergeSupport";

const SUPPORT_EMAIL = "support@lamidconsulting.com";
const SUPPORT_PHONE = "+2348001234500";

const STATUS_COLOR: Record<string, string> = {
  resolved:      "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  "in-progress": "text-yellow-400  bg-yellow-500/10  border-yellow-500/20",
  open:          "text-blue-400   bg-blue-500/10    border-blue-500/20",
};

interface Props {
  onStartChat?: () => void;
}

export default function ConciergeSupport({ onStartChat }: Props) {
  const [tickets,    setTickets]    = useState<SupportTicket[]>(mockSupportTickets);
  const [subject,    setSubject]    = useState("");
  const [message,    setMessage]    = useState("");
  const [priority,   setPriority]   = useState("medium");
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [fetching,   setFetching]   = useState(false);

  /* ── Fetch real tickets, fall back to mock ──────────────────── */
  async function loadTickets() {
    setFetching(true);
    try {
      const res = await fetch("/api/support/tickets");
      if (res.ok) {
        const { data } = await res.json();
        if (Array.isArray(data) && data.length) setTickets(data);
      }
    } catch { /* silent — keep mock */ } finally {
      setFetching(false);
    }
  }

  useEffect(() => { loadTickets(); }, []);

  /* ── Submit ticket — real API, mailto fallback ──────────────── */
  const submit = async () => {
    if (!subject.trim() || !message.trim()) return;
    setSubmitting(true);
    const tid = toast.loading("Submitting ticket…");
    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message, priority }),
      });
      if (!res.ok) throw new Error();
      toast.success("Ticket submitted — we'll respond within 2 hours.", { id: tid });
      setSubmitted(true);
      setSubject(""); setMessage("");
      await loadTickets();
    } catch {
      toast.dismiss(tid);
      // Mailto fallback
      const sub  = encodeURIComponent(`[${priority.toUpperCase()}] ${subject}`);
      const body = encodeURIComponent(message);
      window.open(`mailto:${SUPPORT_EMAIL}?subject=${sub}&body=${body}`);
      toast.success("Opening your email client as a fallback.");
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 max-w-3xl">
      {/* SLA badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-[#c21219]/30 bg-[#c21219]/5 px-5 py-4 flex items-center gap-4"
      >
        <HeadphonesIcon className="h-8 w-8 text-[#c21219] flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-white">Priority Support — 24/7</p>
          <p className="text-xs text-gray-400">Response SLA: &lt;2 hours for critical · &lt;8 hours for standard</p>
        </div>
        <span className="ml-auto flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
      </motion.div>

      {/* Contact channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Live Chat */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
          whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}
          className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 flex flex-col items-center text-center gap-2"
        >
          <MessageSquare className="h-6 w-6 text-blue-300" />
          <p className="text-sm font-semibold text-white">Live Chat</p>
          <p className="text-xs text-gray-400">Avg. response: 5 min</p>
          <motion.button
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
            onClick={onStartChat}
            className="mt-1 px-4 py-1.5 rounded-lg bg-blue-500/15 border border-blue-500/30 hover:bg-blue-500/25 text-blue-300 text-xs font-medium transition"
          >
            Start Chat
          </motion.button>
        </motion.div>

        {/* Phone */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex flex-col items-center text-center gap-2"
        >
          <Phone className="h-6 w-6 text-emerald-300" />
          <p className="text-sm font-semibold text-white">Phone</p>
          <p className="text-xs text-gray-400">{SUPPORT_PHONE}</p>
          <motion.a
            href={`tel:${SUPPORT_PHONE}`}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
            className="mt-1 px-4 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 text-emerald-300 text-xs font-medium transition"
          >
            Call Now
          </motion.a>
        </motion.div>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}
          whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}
          className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4 flex flex-col items-center text-center gap-2"
        >
          <Mail className="h-6 w-6 text-purple-300" />
          <p className="text-sm font-semibold text-white">Email</p>
          <p className="text-xs text-gray-400 truncate w-full text-center">{SUPPORT_EMAIL}</p>
          <motion.a
            href={`mailto:${SUPPORT_EMAIL}`}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
            className="mt-1 px-4 py-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 hover:bg-purple-500/25 text-purple-300 text-xs font-medium transition"
          >
            Send Email
          </motion.a>
        </motion.div>
      </div>

      {/* Submit ticket */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3"
      >
        <p className="text-sm font-semibold text-white">Submit a Support Ticket</p>

        {submitted ? (
          <div className="flex items-center gap-2 text-emerald-400 text-sm py-4">
            <CheckCircle2 className="h-5 w-5" />
            Ticket submitted — your PM will respond within 2 hours.
            <button
              onClick={() => setSubmitted(false)}
              className="ml-auto text-xs text-gray-500 hover:text-white transition underline"
            >
              New ticket
            </button>
          </div>
        ) : (
          <>
            <input
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Subject"
              className="w-full rounded-xl bg-black border border-white/10 text-white text-sm px-4 py-2.5 focus:outline-none focus:border-[#c21219]/60 placeholder-gray-600 transition"
            />
            <select
              value={priority}
              onChange={e => setPriority(e.target.value)}
              className="w-full rounded-xl bg-black border border-white/10 text-gray-300 text-sm px-3 py-2.5 focus:outline-none focus:border-[#c21219]/60 transition"
            >
              <option value="low">Low priority</option>
              <option value="medium">Medium priority</option>
              <option value="high">High priority</option>
              <option value="critical">Critical</option>
            </select>
            <textarea
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Describe your issue…"
              className="w-full rounded-xl bg-black border border-white/10 text-white text-sm px-4 py-2.5 focus:outline-none focus:border-[#c21219]/60 resize-none placeholder-gray-600 transition"
            />
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 4px 16px rgba(194,18,25,0.35)" }}
              whileTap={{ scale: 0.97 }}
              onClick={submit}
              disabled={!subject.trim() || !message.trim() || submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c21219] hover:bg-red-700 text-white text-sm font-semibold transition disabled:opacity-40"
            >
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" />Submitting…</> : "Submit Ticket"}
            </motion.button>
          </>
        )}
      </motion.div>

      {/* Open tickets */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white">Your tickets</p>
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={loadTickets}
            disabled={fetching}
            className="text-gray-500 hover:text-white transition"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${fetching ? "animate-spin" : ""}`} />
          </motion.button>
        </div>
        <div className="space-y-2">
          {tickets.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ x: 4 }}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm text-white truncate">{t.subject}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t.id} · {t.date} · <span className="capitalize">{t.priority}</span></p>
              </div>
              <span className={`ml-4 flex-shrink-0 text-xs px-2.5 py-1 rounded-full border capitalize ${STATUS_COLOR[t.status] ?? STATUS_COLOR.open}`}>
                {t.status}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
