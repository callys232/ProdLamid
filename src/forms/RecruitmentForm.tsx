"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Loader2, Users, Upload } from "lucide-react";

interface RecruitmentFormProps {
  closeModal: () => void;
  user?: unknown;
}

interface FormData {
  fullName:       string;
  email:          string;
  phone:          string;
  company:        string;
  jobTitle:       string;
  department:     string;
  linkedin:       string;
  experience:     string;
  certifications: string;
  track:          string;
  date:           string;
  mode:           string;
  accessibility:  string;
  consent:        string;
  comments:       string;
  interest:       string;
  formType:       string;
}

const INITIAL: FormData = {
  fullName: "", email: "", phone: "", company: "", jobTitle: "",
  department: "", linkedin: "", experience: "", certifications: "",
  track: "", date: "", mode: "", accessibility: "", consent: "",
  comments: "", interest: "", formType: "Recruitment",
};

const REQUIRED: (keyof FormData)[] = ["fullName", "email", "company", "track", "date", "mode", "consent", "interest"];

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

const RecruitmentForm: React.FC<RecruitmentFormProps> = ({ closeModal }) => {
  const [form,       setForm]      = useState<FormData>(INITIAL);
  const [cvFile,     setCvFile]    = useState<File | null>(null);
  const [errors,     setErrors]    = useState<Record<string, string>>({});
  const [submitting, setSubmitting]= useState(false);
  const [success,    setSuccess]   = useState(false);

  const set = (k: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((p) => ({ ...p, [k]: e.target.value }));
      setErrors((p) => { const n = { ...p }; delete n[k]; return n; });
    };

  const filled  = REQUIRED.filter((k) => form[k].trim() !== "").length;
  const progress = Math.round((filled / REQUIRED.length) * 100);

  const validate = () => {
    const e: Record<string, string> = {};
    REQUIRED.forEach((k) => { if (!form[k].trim()) e[k] = "Required"; });
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
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (cvFile) fd.append("cv", cvFile);
      const res = await fetch("/api/recruitment", { method: "POST", body: fd });
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
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Application Received!</h3>
          <p className="text-sm text-gray-400">Our team will review your profile and be in touch shortly.</p>
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
          <Users className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-400/80">LAMID TALENT</p>
          <h2 className="text-lg font-extrabold text-white leading-tight">Recruitment Application</h2>
          <p className="text-xs text-gray-500 mt-0.5">Sign up to be considered for executive roles</p>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Form progress</span>
          <span className="text-[11px] font-bold text-orange-400">{progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
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
          <Err msg={errors.phone} />
        </div>
        <div>
          <Label>LinkedIn Profile</Label>
          <input value={form.linkedin} onChange={set("linkedin")} placeholder="linkedin.com/in/…" className={inputCls} />
        </div>
      </Section>

      {/* 2 — Professional */}
      <Section num="2" title="Professional Background">
        <div>
          <Label required>Company / Organisation</Label>
          <input value={form.company} onChange={set("company")} placeholder="Acme Corp" className={inputCls} />
          <Err msg={errors.company} />
        </div>
        <div>
          <Label>Job Title</Label>
          <input value={form.jobTitle} onChange={set("jobTitle")} placeholder="Head of Sales" className={inputCls} />
        </div>
        <div>
          <Label>Department</Label>
          <input value={form.department} onChange={set("department")} placeholder="Commercial" className={inputCls} />
        </div>
        <div>
          <Label>Years of Experience</Label>
          <input type="number" value={form.experience} onChange={set("experience")} placeholder="5" className={inputCls} />
        </div>
        <Full>
          <Label>Certifications</Label>
          <input value={form.certifications} onChange={set("certifications")} placeholder="PMP, CFA, SHRM…" className={inputCls} />
        </Full>
      </Section>

      {/* 3 — Preferences */}
      <Section num="3" title="Role Preferences">
        <Full>
          <Label required>Recruitment Track</Label>
          <select value={form.track} onChange={set("track")} aria-label="Recruitment Track" title="Recruitment Track" className={selectCls}>
            <option value="" className="bg-[#111111]">Select a track…</option>
            {["Leadership Development","Project Management","Sales Enablement","Digital Transformation"].map((t) => (
              <option key={t} value={t} className="bg-[#111111] text-gray-200">{t}</option>
            ))}
          </select>
          <Err msg={errors.track} />
        </Full>
        <div>
          <Label required>Preferred Start Date</Label>
          <input type="date" value={form.date} onChange={set("date")} aria-label="Preferred Start Date" title="Preferred Start Date" className={inputCls} />
          <Err msg={errors.date} />
        </div>
        <div>
          <Label required>Mode of Work</Label>
          <select value={form.mode} onChange={set("mode")} aria-label="Mode of Work" title="Mode of Work" className={selectCls}>
            <option value="" className="bg-[#111111]">Select mode…</option>
            {["Remote","Hybrid","Onsite"].map((m) => (
              <option key={m} value={m} className="bg-[#111111] text-gray-200">{m}</option>
            ))}
          </select>
          <Err msg={errors.mode} />
        </div>
      </Section>

      {/* 4 — Additional */}
      <Section num="4" title="Additional Details">
        <div>
          <Label>Accessibility Needs</Label>
          <input value={form.accessibility} onChange={set("accessibility")} placeholder="Any special requirements?" className={inputCls} />
        </div>
        <div>
          <Label required>Consent to Record</Label>
          <select value={form.consent} onChange={set("consent")} aria-label="Consent to Record" title="Consent to Record" className={selectCls}>
            <option value="" className="bg-[#111111]">Select…</option>
            <option value="Yes" className="bg-[#111111] text-gray-200">Yes, I consent</option>
            <option value="No" className="bg-[#111111] text-gray-200">No, I do not consent</option>
          </select>
          <Err msg={errors.consent} />
        </div>
        <Full>
          <Label required>Why are you interested in this track?</Label>
          <textarea rows={4} value={form.interest} onChange={set("interest")} placeholder="Share your motivation and relevant experience…" className={inputCls + " resize-none"} />
          <Err msg={errors.interest} />
        </Full>
        <Full>
          <Label>Additional Comments</Label>
          <textarea rows={2} value={form.comments} onChange={set("comments")} placeholder="Anything else we should know?" className={inputCls + " resize-none"} />
        </Full>

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
                   bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700
                   hover:from-orange-600 hover:to-orange-800
                   shadow-[0_8px_32px_rgba(249,115,22,0.35)]
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition focus:outline-none focus:ring-2 focus:ring-orange-500/40">
        {submitting
          ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Submitting…</span>
          : <span className="flex items-center justify-center gap-2">Submit Application <ChevronRight className="w-4 h-4" /></span>}
      </button>

      <button type="button" onClick={closeModal}
        className="w-full py-2.5 rounded-2xl text-xs font-semibold text-gray-500 hover:text-gray-300 border border-white/10 hover:border-white/20 transition">
        Cancel
      </button>
    </form>
  );
};

export default RecruitmentForm;
