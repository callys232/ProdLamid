"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Loader2, CheckCircle2, Briefcase, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import type { JobOpeningData } from "./JobCard";

interface ApplyModalProps {
  job:      JobOpeningData | null;
  onClose:  () => void;
  onSuccess?: () => void;
}

const inputCls = "w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/70 focus:ring-1 focus:ring-orange-500/20 transition duration-200";

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
      {children}{required && <span className="ml-0.5 text-orange-500">*</span>}
    </label>
  );
}

function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
      className="mt-1 text-[11px] text-blue-400 flex items-center gap-1">
      <span className="inline-block w-1 h-1 rounded-full bg-blue-400" />{msg}
    </motion.p>
  );
}

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/[0.025] border border-white/[0.07] p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 text-[10px] font-black">{num}</div>
        <h3 className="text-xs font-black uppercase tracking-widest text-orange-400/90">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Full({ children }: { children: React.ReactNode }) {
  return <div className="sm:col-span-2">{children}</div>;
}

export default function ApplyModal({ job, onClose, onSuccess }: ApplyModalProps) {
  const { user } = useAuth();
  const fileRef  = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName:        user?.username ?? "",
    email:           user?.email    ?? "",
    phone:           "",
    country:         "",
    linkedIn:        "",
    currentRole:     "",
    yearsExperience: "",
    industry:        "",
    skills:          "",
    motivation:      "",
  });
  const [errors,     setErrors]     = useState<Record<string, string>>({});
  const [cvFile,     setCvFile]     = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState(false);

  if (!job) return null;

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((p) => ({ ...p, [k]: e.target.value }));
      setErrors((p) => { const n = { ...p }; delete n[k]; return n; });
    };

  const REQUIRED_FIELDS = ["fullName", "email"] as const;
  const filled   = REQUIRED_FIELDS.filter((k) => form[k].trim() !== "").length;
  const progress = Math.round((filled / REQUIRED_FIELDS.length) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = "Required";
    if (!form.email.trim())    errs.email    = "Required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("jobOpeningId", job._id);
      if (user?.id)  fd.append("userId", user.id);
      if (cvFile)    fd.append("cv", cvFile);

      const res  = await fetch("/api/recruitment/candidates", { method: "POST", body: fd });
      const data = await res.json();
      if (!data.success) throw new Error(data.message ?? "Failed");

      setSuccess(true);
      onSuccess?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
        style={{ backgroundColor: "rgba(0,0,0,0.82)", backdropFilter: "blur(8px)" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative bg-[#0a0a0a] border border-white/10 rounded-t-2xl sm:rounded-2xl
                     w-full sm:w-[95%] md:w-[680px] max-h-[92vh] overflow-y-auto overscroll-contain"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top orange accent line */}
          <div className="h-[2px] w-full rounded-t-2xl bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

          {/* Sticky header */}
          <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/[0.07] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-orange-400/80">Apply for</p>
                <h2 className="text-sm font-extrabold text-white leading-tight">{job.title}</h2>
                <p className="text-[10px] text-gray-500">{job.department}</p>
              </div>
            </div>
            <button type="button" aria-label="Close" onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.12] transition">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Success state */}
          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center gap-5 py-16 px-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Application Submitted!</h3>
                <p className="text-sm text-gray-400">We'll review your profile and be in touch.</p>
              </div>
              <button type="button" onClick={onClose} className="px-8 py-2.5 rounded-full text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white transition">
                Done
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
              {/* Progress */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Profile strength</span>
                  <span className="text-[11px] font-bold text-orange-400">{progress}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                    animate={{ width: `${progress}%` }} transition={{ type: "spring", stiffness: 160, damping: 22 }} />
                </div>
              </div>

              {/* 1 — Personal */}
              <Section num="1" title="Your Details">
                <div>
                  <Label required>Full Name</Label>
                  <input value={form.fullName} onChange={set("fullName")} placeholder="Jane Doe" className={inputCls} />
                  <Err msg={errors.fullName} />
                </div>
                <div>
                  <Label required>Email Address</Label>
                  <input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" className={inputCls} />
                  <Err msg={errors.email} />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+234 800 000 0000" className={inputCls} />
                </div>
                <div>
                  <Label>Country</Label>
                  <input value={form.country} onChange={set("country")} placeholder="Country" className={inputCls} />
                </div>
                <Full>
                  <Label>LinkedIn URL</Label>
                  <input value={form.linkedIn} onChange={set("linkedIn")} placeholder="linkedin.com/in/…" className={inputCls} />
                </Full>
              </Section>

              {/* 2 — Professional */}
              <Section num="2" title="Professional Background">
                <div>
                  <Label>Current Role</Label>
                  <input value={form.currentRole} onChange={set("currentRole")} placeholder="Product Manager" className={inputCls} />
                </div>
                <div>
                  <Label>Years of Experience</Label>
                  <input type="number" min="0" value={form.yearsExperience} onChange={set("yearsExperience")} placeholder="5" className={inputCls} />
                </div>
                <div>
                  <Label>Industry</Label>
                  <input value={form.industry} onChange={set("industry")} placeholder="Fintech / FMCG…" className={inputCls} />
                </div>
                <Full>
                  <Label>Relevant Skills</Label>
                  <input value={form.skills} onChange={set("skills")} placeholder="Leadership, Agile, CRM… (comma-separated)" className={inputCls} />
                </Full>
              </Section>

              {/* 3 — Motivation */}
              <Section num="3" title="Cover Note">
                <Full>
                  <Label>Why are you a great fit?</Label>
                  <textarea rows={4} value={form.motivation} onChange={set("motivation")}
                    placeholder="Tell us about your motivation and what makes you the right person for this role…"
                    className={inputCls + " resize-none"} />
                </Full>
                <Full>
                  <Label>CV / Resume</Label>
                  <button type="button" title="Upload your CV or Resume" onClick={() => fileRef.current?.click()}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-white/20 text-xs text-gray-400 hover:border-orange-500/50 hover:text-orange-300 transition">
                    <Upload className="w-4 h-4 shrink-0" />
                    {cvFile ? cvFile.name : "Click to upload PDF or DOCX"}
                  </button>
                  <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden"
                    aria-label="Upload CV" title="Upload CV"
                    onChange={(e) => setCvFile(e.target.files?.[0] ?? null)} />
                </Full>
              </Section>

              <button type="submit" disabled={submitting}
                className="w-full py-3.5 rounded-2xl text-sm font-extrabold text-white
                           bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700
                           hover:from-orange-600 hover:to-orange-800
                           shadow-[0_8px_32px_rgba(249,115,22,0.35)]
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition focus:outline-none focus:ring-2 focus:ring-orange-500/40">
                {submitting
                  ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Submitting…</span>
                  : <span className="flex items-center justify-center gap-2">Submit Application <ChevronRight className="w-4 h-4" /></span>}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
