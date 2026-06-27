"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Loader2, Star, Upload } from "lucide-react";

export interface TalentClubProps {
  closeModal: () => void;
  user?: unknown;
}

interface FormData {
  fullName:           string;
  email:              string;
  phone:              string;
  country:            string;
  linkedIn:           string;
  currentRole:        string;
  yearsExperience:    string;
  industry:           string;
  modeOfWork:         string;
  accessibilityNeeds: string;
  consentToRecord:    string;
  additionalComments: string;
  motivation:         string;
}

const INITIAL: FormData = {
  fullName: "", email: "", phone: "", country: "", linkedIn: "",
  currentRole: "", yearsExperience: "", industry: "", modeOfWork: "",
  accessibilityNeeds: "", consentToRecord: "", additionalComments: "", motivation: "",
};

const REQUIRED: (keyof FormData)[] = [
  "fullName","email","country","linkedIn","currentRole","yearsExperience","industry","modeOfWork","consentToRecord","motivation",
];

const inputCls = "w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/70 focus:ring-1 focus:ring-orange-500/20 transition duration-200";
const selectCls = "w-full px-4 py-2.5 rounded-xl bg-[#111111] border border-white/10 text-sm text-gray-200 focus:outline-none focus:border-orange-500/70 focus:ring-1 focus:ring-orange-500/20 transition duration-200 appearance-none cursor-pointer";

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
      className="mt-1 text-[11px] text-red-400 flex items-center gap-1">
      <span className="inline-block w-1 h-1 rounded-full bg-red-400" />{msg}
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

const TalentClubForm: React.FC<TalentClubProps> = ({ closeModal }) => {
  const [form,       setForm]      = useState<FormData>(INITIAL);
  const [cvFile,     setCvFile]    = useState<File | null>(null);
  const [errors,     setErrors]    = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting]= useState(false);
  const [success,    setSuccess]   = useState(false);

  const set = (k: keyof FormData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((p) => ({ ...p, [k]: e.target.value }));
      setErrors((p) => { const n = { ...p }; delete n[k]; return n; });
    };

  const filled   = REQUIRED.filter((k) => form[k].trim() !== "").length;
  const progress = Math.round((filled / REQUIRED.length) * 100);

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    REQUIRED.forEach((k) => { if (!form[k].trim()) e[k] = "Required"; });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    return e;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([k, v]) => body.append(k, v));
      if (cvFile) body.append("cvFile", cvFile);
      const res = await fetch("/api/talent-club", { method: "POST", body });
      if (!res.ok) throw new Error("Failed");
      setSuccess(true);
      setForm(INITIAL);
      setCvFile(null);
    } catch { /* silent */ }
    finally { setSubmitting(false); }
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-5 py-16 px-8 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-amber-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Welcome to the Club!</h3>
          <p className="text-sm text-gray-400">Your Talent Club application is in. We'll reach out when a matching opportunity arises.</p>
        </div>
        <button type="button" onClick={closeModal} className="px-8 py-2.5 rounded-full text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white transition">
          Close
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 text-white">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
          <Star className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-400/80">AIVORA TD</p>
          <h2 className="text-lg font-extrabold text-white leading-tight">Join the Talent Club</h2>
          <p className="text-xs text-gray-500 mt-0.5">Be first in line when elite opportunities open up</p>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Profile completeness</span>
          <span className="text-[11px] font-bold text-amber-400">{progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400"
            animate={{ width: `${progress}%` }} transition={{ type: "spring", stiffness: 160, damping: 22 }} />
        </div>
      </div>

      {/* 1 — Personal */}
      <Section num="1" title="Personal Information">
        <div>
          <Label required>Full Name</Label>
          <input value={form.fullName} onChange={set("fullName")} placeholder="Jane Doe" className={inputCls} />
          <Err msg={errors.fullName} />
        </div>
        <div>
          <Label required>Email Address</Label>
          <input type="email" value={form.email} onChange={set("email")} placeholder="you@company.com" className={inputCls} />
          <Err msg={errors.email} />
        </div>
        <div>
          <Label>Phone Number</Label>
          <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+234 800 000 0000" className={inputCls} />
        </div>
        <div>
          <Label required>Country</Label>
          <input value={form.country} onChange={set("country")} placeholder="Nigeria" className={inputCls} />
          <Err msg={errors.country} />
        </div>
        <Full>
          <Label required>LinkedIn Profile URL</Label>
          <input value={form.linkedIn} onChange={set("linkedIn")} placeholder="https://linkedin.com/in/…" className={inputCls} />
          <Err msg={errors.linkedIn} />
        </Full>
      </Section>

      {/* 2 — Professional */}
      <Section num="2" title="Professional Profile">
        <div>
          <Label required>Current Role</Label>
          <input value={form.currentRole} onChange={set("currentRole")} placeholder="Head of Strategy" className={inputCls} />
          <Err msg={errors.currentRole} />
        </div>
        <div>
          <Label required>Years of Experience</Label>
          <input type="number" min="0" value={form.yearsExperience} onChange={set("yearsExperience")} placeholder="7" className={inputCls} />
          <Err msg={errors.yearsExperience} />
        </div>
        <div>
          <Label required>Industry</Label>
          <input value={form.industry} onChange={set("industry")} placeholder="Financial Services" className={inputCls} />
          <Err msg={errors.industry} />
        </div>
        <div>
          <Label required>Preferred Work Mode</Label>
          <select value={form.modeOfWork} onChange={set("modeOfWork")} aria-label="Preferred Work Mode" title="Preferred Work Mode" className={selectCls}>
            <option value="" className="bg-[#111111]">Select mode…</option>
            {["Remote","Hybrid","Onsite"].map((m) => (
              <option key={m} value={m} className="bg-[#111111] text-gray-200">{m}</option>
            ))}
          </select>
          <Err msg={errors.modeOfWork} />
        </div>
      </Section>

      {/* 3 — About You */}
      <Section num="3" title="About You">
        <Full>
          <Label required>Why do you want to join the Talent Club?</Label>
          <textarea rows={4} value={form.motivation} onChange={set("motivation")}
            placeholder="Tell us about your goals, what you're looking for, and what makes you stand out…"
            className={inputCls + " resize-none"} />
          <Err msg={errors.motivation} />
        </Full>
        <Full>
          <Label>Additional Comments</Label>
          <textarea rows={2} value={form.additionalComments} onChange={set("additionalComments")}
            placeholder="Anything else we should know?" className={inputCls + " resize-none"} />
        </Full>
        <div>
          <Label>Accessibility Needs</Label>
          <input value={form.accessibilityNeeds} onChange={set("accessibilityNeeds")} placeholder="Any special requirements?" className={inputCls} />
        </div>
        <div>
          <Label required>Consent to Record</Label>
          <select value={form.consentToRecord} onChange={set("consentToRecord")} aria-label="Consent to Record" title="Consent to Record" className={selectCls}>
            <option value="" className="bg-[#111111]">Select…</option>
            <option value="Yes" className="bg-[#111111] text-gray-200">Yes, I consent</option>
            <option value="No" className="bg-[#111111] text-gray-200">No, I do not consent</option>
          </select>
          <Err msg={errors.consentToRecord} />
        </div>

        {/* CV Upload */}
        <Full>
          <Label>CV / Resume</Label>
          <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-white/20 text-xs text-gray-400 hover:border-orange-500/50 hover:text-orange-300 transition cursor-pointer">
            <Upload className="w-4 h-4 shrink-0" />
            {cvFile ? cvFile.name : "Click to upload PDF, DOC, or DOCX"}
            <input type="file" accept=".pdf,.doc,.docx" className="hidden" aria-label="Upload CV"
              onChange={(e) => setCvFile(e.target.files?.[0] ?? null)} />
          </label>
        </Full>
      </Section>

      {/* Submit */}
      <button type="submit" disabled={submitting}
        className="w-full py-3.5 rounded-2xl text-sm font-extrabold text-white
                   bg-gradient-to-r from-amber-500 via-orange-500 to-orange-700
                   hover:from-amber-600 hover:to-orange-800
                   shadow-[0_8px_32px_rgba(249,115,22,0.35)]
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition focus:outline-none focus:ring-2 focus:ring-orange-500/40">
        {submitting
          ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Submitting…</span>
          : <span className="flex items-center justify-center gap-2">Join the Talent Club <ChevronRight className="w-4 h-4" /></span>}
      </button>

      <button type="button" onClick={closeModal}
        className="w-full py-2.5 rounded-2xl text-xs font-semibold text-gray-500 hover:text-gray-300 border border-white/10 hover:border-white/20 transition">
        Cancel
      </button>
    </form>
  );
};

export default TalentClubForm;
