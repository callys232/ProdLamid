"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, Loader2, GraduationCap } from "lucide-react";

interface TrainingFormProps {
  closeModal?: () => void;
  user?: unknown;
}

interface FormData {
  fullName:         string;
  email:            string;
  phone:            string;
  company:          string;
  jobTitle:         string;
  department:       string;
  trainingTrack:    string;
  preferredDate:    string;
  attendanceMode:   string;
  accessibility:    string;
  paymentAgreement: string;
  consentToRecord:  string;
  comments:         string;
}

const INITIAL: FormData = {
  fullName: "", email: "", phone: "", company: "", jobTitle: "",
  department: "", trainingTrack: "", preferredDate: "", attendanceMode: "",
  accessibility: "", paymentAgreement: "", consentToRecord: "", comments: "",
};

const REQUIRED_FIELDS: (keyof FormData)[] = [
  "fullName", "email", "company", "trainingTrack",
  "preferredDate", "attendanceMode", "paymentAgreement", "consentToRecord",
];

/* ── Shared field primitives ───────────────────────────────── */
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
      {children}{required && <span className="ml-0.5 text-orange-500">*</span>}
    </label>
  );
}

const inputCls = "w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/70 focus:ring-1 focus:ring-orange-500/20 transition duration-200";
const selectCls = inputCls + " appearance-none cursor-pointer";

function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-1 text-[11px] text-red-400 flex items-center gap-1"
    >
      <span className="inline-block w-1 h-1 rounded-full bg-red-400" />{msg}
    </motion.p>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/[0.025] border border-white/[0.07] p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
          {icon}
        </div>
        <h3 className="text-xs font-black uppercase tracking-widest text-orange-400/90">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function FullCol({ children }: { children: React.ReactNode }) {
  return <div className="sm:col-span-2">{children}</div>;
}

/* ── Main component ──────────────────────────────────────────── */
const TrainingForm: React.FC<TrainingFormProps> = ({ closeModal }) => {
  const [form,        setForm]       = useState<FormData>(INITIAL);
  const [errors,      setErrors]     = useState<Partial<FormData>>({});
  const [submitting,  setSubmitting] = useState(false);
  const [success,     setSuccess]    = useState(false);

  const set = (k: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((p) => ({ ...p, [k]: e.target.value }));
      setErrors((p) => ({ ...p, [k]: undefined }));
    };

  const totalRequired = REQUIRED_FIELDS.length;
  const filled = REQUIRED_FIELDS.filter((k) => form[k].trim() !== "").length;
  const progress = Math.round((filled / totalRequired) * 100);

  const validate = (): Partial<FormData> => {
    const e: Partial<FormData> = {};
    REQUIRED_FIELDS.forEach((k) => { if (!form[k].trim()) e[k] = "Required"; });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (form.phone && !/^\+?\d{7,15}$/.test(form.phone)) e.phone = "Invalid phone";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setSuccess(true);
      setForm(INITIAL);
    } catch { /* swallow — user sees generic error in the future */ }
    finally { setSubmitting(false); }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-5 py-16 px-8 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-1">You're registered!</h3>
          <p className="text-sm text-gray-400">We'll confirm your slot and send details to your email shortly.</p>
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
        <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0">
          <GraduationCap className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-400/80">LAMID TALENT</p>
          <h2 className="text-lg font-extrabold text-white leading-tight">Training Registration</h2>
          <p className="text-xs text-gray-500 mt-0.5">Reserve your slot in our next cohort</p>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Form progress</span>
          <span className="text-[11px] font-bold text-orange-400">{progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 160, damping: 22 }}
          />
        </div>
      </div>

      {/* Section 1 — Personal */}
      <Section title="Personal Information" icon={<span className="text-[10px] font-black">1</span>}>
        <div>
          <Label required>Full Name</Label>
          <input name="fullName" value={form.fullName} onChange={set("fullName")} placeholder="Jane Doe" className={inputCls} />
          <Err msg={errors.fullName} />
        </div>
        <div>
          <Label required>Email Address</Label>
          <input name="email" type="email" value={form.email} onChange={set("email")} placeholder="you@company.com" className={inputCls} />
          <Err msg={errors.email} />
        </div>
        <div>
          <Label>Phone Number</Label>
          <input name="phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="+234 800 000 0000" className={inputCls} />
          <Err msg={errors.phone} />
        </div>
      </Section>

      {/* Section 2 — Company */}
      <Section title="Organisation Details" icon={<span className="text-[10px] font-black">2</span>}>
        <div>
          <Label required>Company / Organisation</Label>
          <input name="company" value={form.company} onChange={set("company")} placeholder="Acme Corp" className={inputCls} />
          <Err msg={errors.company} />
        </div>
        <div>
          <Label>Job Title</Label>
          <input name="jobTitle" value={form.jobTitle} onChange={set("jobTitle")} placeholder="Head of HR" className={inputCls} />
        </div>
        <div>
          <Label>Department</Label>
          <input name="department" value={form.department} onChange={set("department")} placeholder="People & Culture" className={inputCls} />
        </div>
      </Section>

      {/* Section 3 — Training Preferences */}
      <Section title="Training Preferences" icon={<span className="text-[10px] font-black">3</span>}>
        <FullCol>
          <Label required>Training Track</Label>
          <select name="trainingTrack" aria-label="Training Track" title="Training Track" value={form.trainingTrack} onChange={set("trainingTrack")} className={selectCls}>
            <option value="" className="bg-[#0a0a0a]">Select a track…</option>
            {["Leadership Development", "Project Management", "Sales Enablement", "Digital Transformation"].map((t) => (
              <option key={t} value={t} className="bg-[#0a0a0a]">{t}</option>
            ))}
          </select>
          <Err msg={errors.trainingTrack} />
        </FullCol>
        <div>
          <Label required>Preferred Start Date</Label>
          <input type="date" name="preferredDate" aria-label="Preferred Start Date" title="Preferred Start Date" value={form.preferredDate} onChange={set("preferredDate")} className={inputCls} />
          <Err msg={errors.preferredDate} />
        </div>
        <div>
          <Label required>Attendance Mode</Label>
          <select name="attendanceMode" aria-label="Attendance Mode" title="Attendance Mode" value={form.attendanceMode} onChange={set("attendanceMode")} className={selectCls}>
            <option value="" className="bg-[#0a0a0a]">Select mode…</option>
            <option value="Online" className="bg-[#0a0a0a]">Online</option>
            <option value="In-Person" className="bg-[#0a0a0a]">In-Person</option>
            <option value="Hybrid" className="bg-[#0a0a0a]">Hybrid</option>
          </select>
          <Err msg={errors.attendanceMode} />
        </div>
      </Section>

      {/* Section 4 — Additional */}
      <Section title="Additional Details" icon={<span className="text-[10px] font-black">4</span>}>
        <div>
          <Label>Accessibility Needs</Label>
          <input name="accessibility" value={form.accessibility} onChange={set("accessibility")} placeholder="Any special requirements?" className={inputCls} />
        </div>
        <div>
          <Label required>Payment Agreement</Label>
          <select name="paymentAgreement" aria-label="Payment Agreement" title="Payment Agreement" value={form.paymentAgreement} onChange={set("paymentAgreement")} className={selectCls}>
            <option value="" className="bg-[#0a0a0a]">Select…</option>
            <option value="I agree to pay the training fee" className="bg-[#0a0a0a]">I will pay the training fee</option>
            <option value="My organization will cover the fee" className="bg-[#0a0a0a]">My organisation covers the fee</option>
          </select>
          <Err msg={errors.paymentAgreement} />
        </div>
        <div>
          <Label required>Consent to Record</Label>
          <select name="consentToRecord" aria-label="Consent to Record" title="Consent to Record" value={form.consentToRecord} onChange={set("consentToRecord")} className={selectCls}>
            <option value="" className="bg-[#0a0a0a]">Select…</option>
            <option value="Yes" className="bg-[#0a0a0a]">Yes, I consent</option>
            <option value="No" className="bg-[#0a0a0a]">No, I do not consent</option>
          </select>
          <Err msg={errors.consentToRecord} />
        </div>
        <FullCol>
          <Label>Additional Comments</Label>
          <textarea name="comments" value={form.comments} onChange={set("comments")} rows={3} placeholder="Anything else we should know?" className={inputCls + " resize-none"} />
        </FullCol>
      </Section>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 rounded-2xl text-sm font-extrabold text-white
                   bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700
                   hover:from-orange-600 hover:to-orange-800
                   shadow-[0_8px_32px_rgba(249,115,22,0.35)]
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition focus:outline-none focus:ring-2 focus:ring-orange-500/40"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Submitting…</span>
        ) : (
          <span className="flex items-center justify-center gap-2">Reserve My Slot <ChevronRight className="w-4 h-4" /></span>
        )}
      </button>

      <button type="button" onClick={closeModal} className="w-full py-2.5 rounded-2xl text-xs font-semibold text-gray-500 hover:text-gray-300 border border-white/10 hover:border-white/20 transition">
        Cancel
      </button>
    </form>
  );
};

export default TrainingForm;
