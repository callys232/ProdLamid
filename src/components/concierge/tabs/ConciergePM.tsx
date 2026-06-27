"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCheck, Mail, Phone, Calendar, MessageSquare,
  Star, Clock, X, CheckCircle2, Send, Loader2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { mockConciergePM, type PMProfile } from "@/mocks/mockConciergePM";

/* ── Types ───────────────────────────────────────────────────────── */
interface ChatMessage {
  _id?: string;
  tempId?: string;
  message: string;
  senderId: string | { _id: string; username?: string };
  sentAt: string;
  status?: "sending" | "sent" | "failed";
}

/* ── PM Chat Modal ───────────────────────────────────────────────── */
function PMChatModal({ pm, currentUserId, onClose }: {
  pm: PMProfile;
  currentUserId: string;
  onClose: () => void;
}) {
  const threadId                      = `pm-direct-${pm.id}`;
  const [messages, setMessages]       = useState<ChatMessage[]>([]);
  const [loading, setLoading]         = useState(true);
  const [text, setText]               = useState("");
  const [sending, setSending]         = useState(false);
  const bottomRef                     = useRef<HTMLDivElement>(null);
  const inputRef                      = useRef<HTMLTextAreaElement>(null);

  /* ── Load history ──────────────────────────────────────────── */
  useEffect(() => {
    setLoading(true);
    fetch(`/api/messages?projectId=${threadId}&limit=50`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.data) setMessages(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [threadId]);

  /* ── Auto-scroll to bottom ─────────────────────────────────── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ── Focus input on open ───────────────────────────────────── */
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  /* ── Send message ──────────────────────────────────────────── */
  async function sendMessage() {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const tempId = `temp-${Date.now()}`;
    const optimistic: ChatMessage = {
      tempId,
      message:  trimmed,
      senderId: currentUserId,
      sentAt:   new Date().toISOString(),
      status:   "sending",
    };

    setText("");
    setSending(true);
    setMessages(prev => [...prev, optimistic]);

    try {
      const res = await fetch("/api/messages", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          projectId: threadId,
          message:   trimmed,
          recipient: "consultant",
        }),
      });
      if (!res.ok) throw new Error();
      const { data } = await res.json();
      setMessages(prev =>
        prev.map(m => m.tempId === tempId ? { ...data, status: "sent" } : m)
      );
    } catch {
      setMessages(prev =>
        prev.map(m => m.tempId === tempId ? { ...m, status: "failed" } : m)
      );
      toast.error("Message couldn't be saved — check your connection.");
    } finally {
      setSending(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  function senderId(m: ChatMessage): string {
    return typeof m.senderId === "object" ? m.senderId._id : m.senderId;
  }

  function isMe(m: ChatMessage) {
    return senderId(m) === currentUserId;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 20 }}
        transition={{ duration: 0.22, ease: [0.33, 1, 0.68, 1] as const }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg flex flex-col rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl overflow-hidden"
        style={{ height: "min(80vh, 600px)" }}
      >
        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex-shrink-0 flex items-center gap-4 border-b border-white/10 bg-[#0d1117]/95 px-5 py-4">
          <div className="relative flex-shrink-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c21219]/15 border border-[#c21219]/25 text-sm font-bold text-[#c21219]">
              {pm.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#0d1117]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white truncate">{pm.name}</p>
            <p className="text-[11px] text-gray-500">Your Dedicated PM · <span className="text-emerald-400">Online</span></p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="flex-shrink-0 rounded-xl border border-white/10 bg-white/5 p-2 text-gray-400 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </motion.button>
        </div>

        {/* ── Message list ────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <MessageSquare className="h-6 w-6 text-gray-500" />
              </div>
              <p className="text-sm text-gray-400 font-medium">Start the conversation</p>
              <p className="text-xs text-gray-600">Send {pm.name} a message — they typically reply within 2 hours.</p>
            </div>
          ) : (
            <>
              {messages.map((m, i) => {
                const mine = isMe(m);
                return (
                  <motion.div
                    key={m._id ?? m.tempId ?? i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className={`flex gap-2.5 ${mine ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    {!mine && (
                      <div className="flex-shrink-0 h-7 w-7 rounded-full bg-[#c21219]/15 border border-[#c21219]/25 flex items-center justify-center text-[10px] font-bold text-[#c21219] mt-1">
                        {pm.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                    )}

                    <div className={`flex flex-col gap-1 max-w-[75%] ${mine ? "items-end" : "items-start"}`}>
                      <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        mine
                          ? "bg-[#c21219] text-white rounded-tr-sm"
                          : "bg-white/8 border border-white/10 text-gray-200 rounded-tl-sm"
                      }`}>
                        {m.message}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-gray-600">
                          {new Date(m.sentAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {mine && m.status === "sending" && (
                          <Loader2 className="h-2.5 w-2.5 animate-spin text-gray-600" />
                        )}
                        {mine && m.status === "failed" && (
                          <AlertCircle className="h-2.5 w-2.5 text-red-400" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* ── Input bar ───────────────────────────────────────── */}
        <div className="flex-shrink-0 border-t border-white/10 bg-[#0d1117] px-4 py-3">
          <div className="flex items-end gap-3">
            <textarea
              ref={inputRef}
              rows={1}
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKey}
              placeholder={`Message ${pm.name.split(" ")[0]}…`}
              className="flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c21219]/50 transition max-h-28 overflow-y-auto"
              style={{ lineHeight: "1.5" }}
            />
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: "0 4px 16px rgba(194,18,25,0.4)" }}
              whileTap={{ scale: 0.93 }}
              onClick={sendMessage}
              disabled={!text.trim() || sending}
              className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-[#c21219] text-white transition hover:bg-red-700 disabled:opacity-40"
            >
              {sending
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Send className="h-4 w-4" />}
            </motion.button>
          </div>
          <p className="mt-1.5 text-[10px] text-gray-700 text-center">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main component ──────────────────────────────────────────────── */
export default function ConciergePM() {
  const [pm, setPm]                     = useState<PMProfile>(mockConciergePM);
  const [currentUserId, setCurrentUserId] = useState("");
  const [showChat, setShowChat]         = useState(false);
  const [showBooking, setShowBooking]   = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string } | null>(null);
  const [note, setNote]                 = useState("");
  const [booking, setBooking]           = useState(false);
  const [booked, setBooked]             = useState(false);

  /* ── Bootstrap ──────────────────────────────────────────────── */
  useEffect(() => {
    // Fetch current user ID for the chat
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.data) setCurrentUserId(d.data._id ?? d.data.id ?? ""); })
      .catch(() => {});

    // Fetch real PM data
    fetch("/api/concierge/pm")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.data) setPm(d.data); })
      .catch(() => {});
  }, []);

  /* ── Booking ────────────────────────────────────────────────── */
  function openBooking(day?: string, time?: string) {
    setSelectedSlot(day && time ? { day, time } : null);
    setNote("");
    setBooked(false);
    setShowBooking(true);
  }

  async function confirmBooking() {
    setBooking(true);
    const tid = toast.loading("Booking call…");
    try {
      const res = await fetch("/api/concierge/pm/schedule", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ slot: selectedSlot, note }),
      });
      if (!res.ok) throw new Error();
      toast.success("Call scheduled!", { id: tid });
      setBooked(true);
    } catch {
      toast.dismiss(tid);
      const subject = encodeURIComponent(`Schedule call${selectedSlot ? ` — ${selectedSlot.day} ${selectedSlot.time}` : ""}`);
      const body    = encodeURIComponent(`Hi ${pm.name},\n\nI'd like to schedule a call${selectedSlot ? ` for ${selectedSlot.day} at ${selectedSlot.time}` : ""}.\n\n${note}`);
      window.open(`mailto:${pm.email}?subject=${subject}&body=${body}`);
      toast.success("Opening your email client…");
      setShowBooking(false);
    } finally {
      setBooking(false);
    }
  }

  return (
    <>
      <div className="space-y-4 max-w-3xl">

        {/* ── PM Card ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[#c21219]/30 bg-[#c21219]/5 p-4"
        >
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-xl border border-white/10 bg-black/40 flex items-center justify-center flex-shrink-0">
              <UserCheck className="h-8 w-8 text-[#c21219]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-lg font-bold text-white">{pm.name}</p>
                <span className="text-xs bg-[#c21219]/20 text-[#c21219] border border-[#c21219]/30 px-2 py-0.5 rounded-full">Your PM</span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                </span>
              </div>
              <p className="text-sm text-gray-400">{pm.title}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 flex-wrap">
                <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-400" />{pm.rating}/5.0</span>
                <span>{pm.projectsManaged} projects managed</span>
                <span>{pm.yearsExperience} yrs experience</span>
              </div>
            </div>
          </div>

          {/* Contact chips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
            <motion.a
              href={`mailto:${pm.email}`}
              whileHover={{ scale: 1.03, boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}
              className="flex items-center gap-2 rounded-xl bg-black/30 border border-white/10 px-3 py-2.5 hover:border-white/20 transition"
            >
              <Mail className="h-3.5 w-3.5 text-[#c21219] flex-shrink-0" />
              <p className="text-xs text-gray-300 truncate">{pm.email}</p>
            </motion.a>
            <motion.a
              href={`tel:${pm.phone}`}
              whileHover={{ scale: 1.03, boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}
              className="flex items-center gap-2 rounded-xl bg-black/30 border border-white/10 px-3 py-2.5 hover:border-white/20 transition"
            >
              <Phone className="h-3.5 w-3.5 text-[#c21219] flex-shrink-0" />
              <p className="text-xs text-gray-300 truncate">{pm.phone}</p>
            </motion.a>
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="flex items-center gap-2 rounded-xl bg-black/30 border border-white/10 px-3 py-2.5 cursor-default"
            >
              <Clock className="h-3.5 w-3.5 text-[#c21219] flex-shrink-0" />
              <p className="text-xs text-gray-300 truncate">{pm.availability}</p>
            </motion.div>
          </div>

          {/* Specialties */}
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Specialties</p>
            <div className="flex flex-wrap gap-2">
              {pm.specialties.map(s => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">{s}</span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 flex gap-3 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 6px 20px rgba(194,18,25,0.4)" }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowChat(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#c21219] hover:bg-red-700 text-white text-sm font-semibold transition"
            >
              <MessageSquare className="h-4 w-4" /> Message PM
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.96 }}
              onClick={() => openBooking()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-sm transition"
            >
              <Calendar className="h-4 w-4" /> Schedule Call
            </motion.button>
          </div>
        </motion.div>

        {/* ── Next check-in ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-5 py-4"
        >
          <p className="text-xs text-gray-400 mb-1">Next scheduled check-in</p>
          <p className="text-sm font-semibold text-white">{pm.nextCheckIn}</p>
        </motion.div>

        {/* ── Current projects ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-xl border border-white/10 bg-white/5 p-5"
        >
          <p className="text-sm font-semibold text-white mb-3">Projects currently managed</p>
          <ul className="space-y-2">
            {pm.currentProjects.map((p, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c21219] flex-shrink-0" />{p}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* ── Weekly availability ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-xl border border-white/10 bg-white/5 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-white">Weekly availability</p>
            <p className="text-xs text-gray-500">Click a slot to book a call</p>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {pm.schedule.map(day => (
              <div key={day.day} className="text-center">
                <p className="text-xs text-gray-500 mb-2">{day.day}</p>
                <div className="space-y-1">
                  {day.slots.map(slot => (
                    <motion.button
                      key={slot}
                      whileHover={{ scale: 1.08, boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openBooking(day.day, slot)}
                      className="block w-full text-[10px] py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25 transition"
                    >
                      {slot}
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── PM Chat Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showChat && (
          <PMChatModal
            pm={pm}
            currentUserId={currentUserId}
            onClose={() => setShowChat(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Booking Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showBooking && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            onClick={() => setShowBooking(false)}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 16 }}
              transition={{ duration: 0.22, ease: [0.33, 1, 0.68, 1] as const }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d1117] shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#c21219]/15 border border-[#c21219]/25">
                    <Calendar className="h-4 w-4 text-[#c21219]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Book a Call</h3>
                    <p className="text-[11px] text-gray-500">with {pm.name}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                  onClick={() => setShowBooking(false)}
                  className="rounded-xl border border-white/10 bg-white/5 p-2 text-gray-400 hover:text-white transition"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>

              <div className="px-5 py-4 space-y-4">
                {booked ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-3 py-4 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30"
                    >
                      <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                    </motion.div>
                    <div>
                      <p className="text-base font-bold text-white">Call Booked!</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {selectedSlot ? `${selectedSlot.day} at ${selectedSlot.time} WAT` : "Your PM will confirm the time."}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      onClick={() => setShowBooking(false)}
                      className="mt-2 px-6 py-2 rounded-xl bg-[#c21219] text-sm font-semibold text-white hover:bg-red-700 transition"
                    >
                      Done
                    </motion.button>
                  </motion.div>
                ) : (
                  <>
                    {selectedSlot ? (
                      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/8 px-4 py-3 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                        <p className="text-sm text-emerald-300 font-medium">{selectedSlot.day} at {selectedSlot.time} WAT</p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">Your PM will suggest an available time.</p>
                    )}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">Agenda / note <span className="text-gray-600">(optional)</span></label>
                      <textarea
                        rows={3}
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        placeholder="What would you like to discuss?"
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c21219]/50 resize-none transition"
                      />
                    </div>
                    <p className="text-[11px] text-gray-600">A calendar invite will be sent to your email. If our scheduler is unavailable, your email client will open.</p>
                    <div className="flex items-center justify-end gap-3 pt-1">
                      <button onClick={() => setShowBooking(false)} className="text-sm text-gray-400 hover:text-white transition px-3 py-2">Cancel</button>
                      <motion.button
                        whileHover={{ scale: 1.04, boxShadow: "0 4px 16px rgba(194,18,25,0.35)" }} whileTap={{ scale: 0.96 }}
                        disabled={booking}
                        onClick={confirmBooking}
                        className="flex items-center gap-2 rounded-xl bg-[#c21219] px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-50"
                      >
                        {booking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                        {booking ? "Booking…" : "Confirm"}
                      </motion.button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
