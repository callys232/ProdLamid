"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Loader2, CheckCircle2, X, Clock } from "lucide-react";
import toast from "react-hot-toast";

const ORG_TYPES = [
  "Government Agency",
  "UN / International Body",
  "Large NGO",
  "Corporation (500+ employees)",
  "Foundation",
  "Other",
];

interface Props {
  label?: string;
  className?: string;
}

export default function ConciergeRequestButton({ label = "Request Concierge Access", className = "" }: Props) {
  const [open, setOpen]         = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [form, setForm]         = useState({
    name: "", email: "", organisation: "", orgType: "", description: "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.name || !form.email || !form.organisation) {
      toast.error("Please fill in name, email and organisation.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/concierge/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSubmitted(true);
    } catch (e: any) {
      toast.error(e.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full rounded-xl bg-black border border-white/10 text-white text-sm px-4 py-2.5 focus:outline-none focus:border-[#2563EB]/60 placeholder-gray-600";

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(true)}
        className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition ${className}`}
      >
        <Star className="h-4 w-4" />{label}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
            onClick={() => !submitted && setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#2563EB]/5">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-[#2563EB]" />
                  <p className="text-sm font-bold text-white">Concierge Access Request</p>
                </div>
                {!submitted && (
                  <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white transition">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="p-6">
                {submitted ? (
                  /* ── Success state ── */
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="text-center py-4 space-y-4">
                    <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
                    <div>
                      <p className="text-base font-bold text-white mb-2">Request Submitted</p>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        Our team will review your request and contact you at{" "}
                        <span className="text-white">{form.email}</span> within{" "}
                        <span className="text-[#2563EB] font-semibold">24 hours</span>.
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 px-4 py-3">
                      <Clock className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                      <p className="text-xs text-yellow-300">Pending admin approval</p>
                    </div>
                    <button onClick={() => setOpen(false)}
                      className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition">
                      Close
                    </button>
                  </motion.div>
                ) : (
                  /* ── Form ── */
                  <div className="space-y-3">
                    <p className="text-xs text-gray-400 mb-4">
                      The Concierge tier requires admin review. Tell us about your organisation and we'll be in touch within 24 hours.
                    </p>

                    {[
                      { label: "Full Name *", key: "name", placeholder: "e.g. Dr. Amaka Okafor" },
                      { label: "Email *", key: "email", placeholder: "official@organisation.org", type: "email" },
                      { label: "Organisation *", key: "organisation", placeholder: "e.g. UNDP, or your organisation" },
                    ].map(({ label, key, placeholder, type }) => (
                      <div key={key}>
                        <label className="text-xs text-gray-400 mb-1 block">{label}</label>
                        <input type={type || "text"} placeholder={placeholder} value={(form as any)[key]} onChange={set(key)} className={inputCls} />
                      </div>
                    ))}

                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Organisation Type</label>
                      <select value={form.orgType} onChange={set("orgType")} className={inputCls}>
                        <option value="">Select type…</option>
                        {ORG_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">What do you need help with?</label>
                      <textarea rows={3} value={form.description} onChange={set("description")}
                        placeholder="Brief description of your consulting needs…"
                        className={`${inputCls} resize-none`} />
                    </div>

                    <button onClick={submit} disabled={loading}
                      className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
                      {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Submitting…</> : <><Star className="h-4 w-4" />Submit Request</>}
                    </button>

                    <p className="text-[10px] text-gray-600 text-center">
                      Reviewed by our team within 24 hours. No payment required at this stage.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
