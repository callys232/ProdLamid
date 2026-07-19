"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, CheckCircle2, Loader2, X } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 8); // 8:00 - 21:00

interface Slot { day: string; hour: number; booked?: boolean }

interface BookingModalProps {
  consultantId: string;
  consultantName: string;
  clientId: string;
  onClose: () => void;
}

export default function BookingModal({ consultantId, consultantName, clientId, onClose }: BookingModalProps) {
  const [availability, setAvailability] = useState<Slot[]>([]);
  const [selected, setSelected] = useState<Slot | null>(null);
  const [serviceType, setServiceType] = useState("Consultation");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/bookings?consultantId=${consultantId}`);
        const data = await res.json();
        setAvailability(data.availability || []);
      } catch { setError("Could not load availability."); }
      finally { setLoading(false); }
    })();
  }, [consultantId]);

  const isAvailable = (day: string, hour: number) =>
    availability.some((s) => s.day === day && s.hour === hour && !s.booked);

  const handleBook = async () => {
    if (!selected) { setError("Please select a time slot."); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consultantId, clientId, day: selected.day, hour: selected.hour, serviceType, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setDone(true);
    } catch (e: any) {
      setError(e.message || "Booking failed.");
    } finally { setSubmitting(false); }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#2563EB]" />
            <p className="text-sm font-semibold text-white">Book a session with {consultantName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition"><X className="h-4 w-4" /></button>
        </div>

        <div className="p-6">
          {done ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
              <p className="text-lg font-bold text-white mb-2">Booking Confirmed!</p>
              <p className="text-sm text-gray-400">
                {selected?.day} at {selected?.hour}:00 — {serviceType}.<br />
                You'll receive a confirmation shortly.
              </p>
              <button onClick={onClose} className="mt-6 px-6 py-2 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-blue-700 transition">Done</button>
            </motion.div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 text-[#2563EB] animate-spin" /></div>
          ) : (
            <div className="space-y-5">
              {/* Availability Grid */}
              <div>
                <p className="text-xs text-gray-400 mb-3 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />Select an available time slot</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr>
                        <th className="text-gray-500 font-normal pb-2 pr-2 text-left">Time</th>
                        {DAYS.map((d) => <th key={d} className="text-gray-400 font-medium pb-2 px-1 text-center">{d}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {HOURS.map((h) => (
                        <tr key={h}>
                          <td className="text-gray-500 pr-2 py-0.5 text-right whitespace-nowrap">{h}:00</td>
                          {DAYS.map((d) => {
                            const avail = isAvailable(d, h);
                            const isSel = selected?.day === d && selected?.hour === h;
                            return (
                              <td key={d} className="px-1 py-0.5 text-center">
                                <button
                                  disabled={!avail}
                                  onClick={() => avail && setSelected({ day: d, hour: h })}
                                  className={`w-8 h-6 rounded text-[10px] transition ${
                                    isSel ? "bg-[#2563EB] text-white" :
                                    avail ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40" :
                                    "bg-white/5 text-gray-700 cursor-not-allowed"
                                  }`}
                                >
                                  {avail ? "✓" : "–"}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selected && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Selected: {selected.day} at {selected.hour}:00
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Service type</label>
                    <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}
                      className="w-full rounded-lg bg-black border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-[#2563EB]">
                      {["Consultation", "Strategy Session", "Training", "Coaching", "Review"].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Notes (optional)</label>
                    <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)}
                      placeholder="Brief description of what you need help with…"
                      className="w-full rounded-lg bg-black border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-[#2563EB] resize-none" />
                  </div>
                </motion.div>
              )}

              {error && <p className="text-xs text-blue-400">{error}</p>}

              <button onClick={handleBook} disabled={!selected || submitting}
                className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold transition disabled:opacity-40 flex items-center justify-center gap-2">
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" />Confirming…</> : "Confirm Booking"}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
