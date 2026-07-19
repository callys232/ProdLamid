"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Plus, Trash2, CheckCircle2, PlusCircle, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

interface PostJobModalProps {
  open:      boolean;
  onClose:   () => void;
  onSuccess?: () => void;
}

const TRACKS     = ["Leadership Development", "Project Management", "Sales Enablement", "Digital Transformation", "General"];
const TYPES      = ["full-time", "part-time", "contract", "freelance", "internship"];
const DELIVERIES = ["Remote", "Onsite", "Hybrid"];
const TYPE_LABELS: Record<string, string> = {
  "full-time": "Full-time", "part-time": "Part-time", contract: "Contract",
  freelance: "Freelance", internship: "Internship",
};

const inputCls  = "w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/70 focus:ring-1 focus:ring-orange-500/20 transition duration-200";
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

function ArrayField({
  label, items, placeholder, onAdd, onUpdate, onRemove,
}: {
  label: string; items: string[]; placeholder: string;
  onAdd: () => void; onUpdate: (i: number, v: string) => void; onRemove: (i: number) => void;
}) {
  return (
    <div className="sm:col-span-2 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <button type="button" onClick={onAdd} title={`Add ${label}`}
          className="flex items-center gap-1 text-[10px] font-semibold text-orange-400 hover:text-orange-300 transition">
          <Plus className="w-3 h-3" />Add
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input value={item} placeholder={placeholder} title={`${label} item ${i + 1}`}
            onChange={(e) => onUpdate(i, e.target.value)} className={inputCls} />
          {items.length > 1 && (
            <button type="button" title="Remove item" onClick={() => onRemove(i)}
              className="shrink-0 text-gray-600 hover:text-blue-400 transition">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default function PostJobModal({ open, onClose, onSuccess }: PostJobModalProps) {
  const [form, setForm] = useState({
    title: "", department: "", track: "General", type: "full-time",
    delivery: "Remote", location: "", description: "", deadline: "",
    salaryMin: "", salaryMax: "", currency: "USD",
  });
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [skills,        setSkills]       = useState<string[]>([""]);
  const [errors,       setErrors]       = useState<Record<string, string>>({});
  const [submitting,   setSubmitting]   = useState(false);
  const [success,      setSuccess]      = useState(false);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((p) => ({ ...p, [k]: e.target.value }));
      setErrors((p) => { const n = { ...p }; delete n[k]; return n; });
    };

  const REQUIRED_KEYS = ["title", "department"] as const;
  const filled   = REQUIRED_KEYS.filter((k) => form[k].trim() !== "").length;
  const progress = Math.round((filled / REQUIRED_KEYS.length) * 100);

  const arrOps = (arr: string[], setArr: (v: string[]) => void) => ({
    add:    () => setArr([...arr, ""]),
    update: (i: number, v: string) => { const n = [...arr]; n[i] = v; setArr(n); },
    remove: (i: number) => setArr(arr.filter((_, idx) => idx !== i)),
  });

  const reqOps  = arrOps(requirements, setRequirements);
  const skillOps = arrOps(skills, setSkills);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.title.trim())      errs.title      = "Required";
    if (!form.department.trim()) errs.department = "Required";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        requirements: requirements.filter(Boolean),
        skills:       skills.filter(Boolean),
        salaryRange:  form.salaryMin ? {
          min: Number(form.salaryMin), max: form.salaryMax ? Number(form.salaryMax) : undefined, currency: form.currency,
        } : undefined,
        deadline: form.deadline || undefined,
      };
      const res  = await fetch("/api/recruitment/jobs", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message ?? "Failed");
      setSuccess(true);
      onSuccess?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Post failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.82)", backdropFilter: "blur(8px)" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative bg-[#0a0a0a] border border-white/10 rounded-t-2xl sm:rounded-2xl
                       w-full sm:w-[95%] md:w-[720px] max-h-[92vh] overflow-y-auto overscroll-contain"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent */}
            <div className="h-[2px] w-full rounded-t-2xl bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/[0.07] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
                  <PlusCircle className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-orange-400/80">Enterprise</p>
                  <h2 className="text-sm font-extrabold text-white leading-tight">Post a New Role</h2>
                  <p className="text-[10px] text-gray-500">Fill in the details below to publish this opening</p>
                </div>
              </div>
              <button type="button" aria-label="Close" title="Close" onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.12] transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Success */}
            {success ? (
              <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center gap-5 py-16 px-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Role Published!</h3>
                  <p className="text-sm text-gray-400">The opening is now live and visible to candidates.</p>
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
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Form completeness</span>
                    <span className="text-[11px] font-bold text-orange-400">{progress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <motion.div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                      animate={{ width: `${progress}%` }} transition={{ type: "spring", stiffness: 160, damping: 22 }} />
                  </div>
                </div>

                {/* 1 — Role Info */}
                <Section num="1" title="Role Information">
                  <div>
                    <Label required>Job Title</Label>
                    <input value={form.title} onChange={set("title")} placeholder="Head of Sales" className={inputCls} />
                    <Err msg={errors.title} />
                  </div>
                  <div>
                    <Label required>Department</Label>
                    <input value={form.department} onChange={set("department")} placeholder="Sales & Business Development" className={inputCls} />
                    <Err msg={errors.department} />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <input value={form.location} onChange={set("location")} placeholder="Lagos, Nigeria" className={inputCls} />
                  </div>
                  <div>
                    <Label>Application Deadline</Label>
                    <input type="date" value={form.deadline} onChange={set("deadline")}
                      aria-label="Application Deadline" title="Application Deadline" className={inputCls} />
                  </div>
                </Section>

                {/* 2 — Classification */}
                <Section num="2" title="Classification">
                  <div>
                    <Label>Track</Label>
                    <select value={form.track} onChange={set("track")} aria-label="Track" title="Track" className={selectCls}>
                      {TRACKS.map((t) => <option key={t} value={t} className="bg-[#111111] text-gray-200">{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Job Type</Label>
                    <select value={form.type} onChange={set("type")} aria-label="Job Type" title="Job Type" className={selectCls}>
                      {TYPES.map((t) => <option key={t} value={t} className="bg-[#111111] text-gray-200">{TYPE_LABELS[t]}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Delivery Mode</Label>
                    <select value={form.delivery} onChange={set("delivery")} aria-label="Delivery Mode" title="Delivery Mode" className={selectCls}>
                      {DELIVERIES.map((d) => <option key={d} value={d} className="bg-[#111111] text-gray-200">{d}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:col-span-1">
                    <div className="col-span-2">
                      <Label>Salary Range</Label>
                      <div className="flex gap-2">
                        <input type="number" value={form.salaryMin} onChange={set("salaryMin")} placeholder="Min" title="Minimum salary" className={inputCls} />
                        <input type="number" value={form.salaryMax} onChange={set("salaryMax")} placeholder="Max" title="Maximum salary" className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <Label>Currency</Label>
                      <input value={form.currency} onChange={set("currency")} placeholder="USD" className={inputCls} />
                    </div>
                  </div>
                </Section>

                {/* 3 — Description */}
                <Section num="3" title="Role Details">
                  <Full>
                    <Label>Description</Label>
                    <textarea rows={4} value={form.description} onChange={set("description")}
                      placeholder="Describe the role, key responsibilities, and what success looks like in this position…"
                      className={inputCls + " resize-none"} />
                  </Full>

                  <ArrayField label="Requirements" items={requirements} placeholder="3+ years experience in…"
                    onAdd={reqOps.add} onUpdate={reqOps.update} onRemove={reqOps.remove} />

                  <ArrayField label="Skills" items={skills} placeholder="Leadership, Agile, Excel…"
                    onAdd={skillOps.add} onUpdate={skillOps.update} onRemove={skillOps.remove} />
                </Section>

                <button type="submit" disabled={submitting}
                  className="w-full py-3.5 rounded-2xl text-sm font-extrabold text-white
                             bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700
                             hover:from-orange-600 hover:to-orange-800
                             shadow-[0_8px_32px_rgba(249,115,22,0.35)]
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition focus:outline-none focus:ring-2 focus:ring-orange-500/40">
                  {submitting
                    ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Publishing…</span>
                    : <span className="flex items-center justify-center gap-2">Publish Role <ChevronRight className="w-4 h-4" /></span>}
                </button>

                <button type="button" onClick={onClose}
                  className="w-full py-2.5 rounded-2xl text-xs font-semibold text-gray-500 hover:text-gray-300 border border-white/10 hover:border-white/20 transition">
                  Cancel
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
