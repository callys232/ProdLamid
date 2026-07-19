"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Briefcase, Building2, Save, RefreshCw, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import type { EmploymentEntry, OrgSize } from "@/types/client";

const ORG_SIZES: OrgSize[] = ["1–10", "11–50", "51–200", "201–500", "501–1,000", "1,000+"];
const EMPTY_JOB: EmploymentEntry = { company: "", role: "", startDate: "", endDate: "", location: "", description: "" };

const inp = "w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2.5 text-sm text-white placeholder-gray-600 transition focus:border-blue-500 focus:outline-none";
const lbl = "mb-1.5 block text-xs font-medium text-gray-400";

interface BusinessForm {
  companyName: string;
  industry: string;
  location: string;
  website: string;
  companySize: string;
  description: string;
  employmentHistory: EmploymentEntry[];
}

export default function BusinessProfile({ user }: { user: any }) {
  const biz = user?.businessProfile ?? user?.profile ?? {};

  const [form, setForm] = useState<BusinessForm>({
    companyName:       biz.companyName       ?? "",
    industry:          biz.industry          ?? "",
    location:          biz.location          ?? "",
    website:           biz.website           ?? "",
    companySize:       biz.companySize        ?? "",
    description:       biz.description       ?? "",
    employmentHistory: biz.employmentHistory ?? [],
  });
  const [loading, setLoading]   = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  const setField = (key: keyof BusinessForm, val: string) =>
    setForm(p => ({ ...p, [key]: val }));

  const addJob = () => {
    const next = [...form.employmentHistory, { ...EMPTY_JOB }];
    setForm(p => ({ ...p, employmentHistory: next }));
    setExpanded(next.length - 1);
  };

  const removeJob = (idx: number) => {
    setForm(p => ({ ...p, employmentHistory: p.employmentHistory.filter((_, i) => i !== idx) }));
    setExpanded(null);
  };

  const setJobField = (idx: number, key: keyof EmploymentEntry, val: string) =>
    setForm(p => {
      const next = [...p.employmentHistory];
      next[idx] = { ...next[idx], [key]: val };
      return { ...p, employmentHistory: next };
    });

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);
      toast.success("Business profile saved");
    } catch (e: any) {
      toast.error(e.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white">Business Profile</h2>
        <p className="mt-1 text-sm text-gray-500">Organisation details, size, and work history.</p>
      </div>

      {/* ── Organisation details ── */}
      <section className="rounded-xl border border-gray-800 bg-gray-900/40 p-6">
        <div className="mb-5 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-[#2563EB]" />
          <h3 className="text-sm font-semibold text-white">Organisation Details</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={lbl}>Company Name</label>
            <input className={inp} value={form.companyName} onChange={e => setField("companyName", e.target.value)} placeholder="Acme Corp" />
          </div>
          <div>
            <label className={lbl}>Industry</label>
            <input className={inp} value={form.industry} onChange={e => setField("industry", e.target.value)} placeholder="e.g. Financial Services" />
          </div>
          <div>
            <label className={lbl}>Location</label>
            <input className={inp} value={form.location} onChange={e => setField("location", e.target.value)} placeholder="Lagos, Nigeria" />
          </div>
          <div>
            <label className={lbl}>Website</label>
            <input className={inp} type="url" value={form.website} onChange={e => setField("website", e.target.value)} placeholder="https://yourcompany.com" />
          </div>
          <div>
            <label className={lbl}>Organisation Size</label>
            <div className="relative">
              <select value={form.companySize} onChange={e => setField("companySize", e.target.value)} className={`${inp} appearance-none pr-8`}>
                <option value="">Select size…</option>
                {ORG_SIZES.map(s => <option key={s} value={s}>{s} employees</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className={lbl}>Company Description</label>
          <textarea value={form.description} onChange={e => setField("description", e.target.value)} rows={4}
            className={`${inp} resize-none`} placeholder="Tell us about your business, mission, and services…" />
        </div>
      </section>

      {/* ── Employment history ── */}
      <section className="rounded-xl border border-gray-800 bg-gray-900/40 p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[#2563EB]" />
            <h3 className="text-sm font-semibold text-white">Work / Employment History</h3>
            <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-gray-400">
              {form.employmentHistory.length}
            </span>
          </div>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={addJob}
            className="flex items-center gap-1.5 rounded-lg border border-[#2563EB]/30 bg-[#2563EB]/10 px-3 py-1.5 text-xs font-semibold text-[#2563EB] hover:bg-[#2563EB]/20">
            <Plus className="h-3.5 w-3.5" /> Add Entry
          </motion.button>
        </div>

        {form.employmentHistory.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-600">
            No work history yet. Click <span className="text-[#2563EB]">Add Entry</span> to start.
          </p>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {form.employmentHistory.map((job, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }} className="overflow-hidden rounded-xl border border-gray-700 bg-gray-900">

                  <button type="button" onClick={() => setExpanded(expanded === idx ? null : idx)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-white/5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {job.role || <span className="italic text-gray-500">New entry</span>}
                      </p>
                      {job.company && (
                        <p className="truncate text-xs text-gray-500">
                          {job.company}
                          {job.startDate ? ` · ${job.startDate}` : ""}
                          {job.endDate ? ` → ${job.endDate}` : ""}
                        </p>
                      )}
                    </div>
                    <motion.div animate={{ rotate: expanded === idx ? 180 : 0 }}>
                      <ChevronDown className="ml-3 h-4 w-4 text-gray-500" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {expanded === idx && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-gray-700 px-4 pb-4 pt-4">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label className={lbl}>Company *</label>
                            <input className={inp} value={job.company} onChange={e => setJobField(idx, "company", e.target.value)} placeholder="Acme Corp" />
                          </div>
                          <div>
                            <label className={lbl}>Role / Title *</label>
                            <input className={inp} value={job.role} onChange={e => setJobField(idx, "role", e.target.value)} placeholder="Senior Consultant" />
                          </div>
                          <div>
                            <label className={lbl}>Start Date</label>
                            <input className={inp} type="month" value={job.startDate ?? ""} onChange={e => setJobField(idx, "startDate", e.target.value)} />
                          </div>
                          <div>
                            <label className={lbl}>End Date</label>
                            <input className={inp} placeholder="Present or YYYY-MM" value={job.endDate ?? ""} onChange={e => setJobField(idx, "endDate", e.target.value)} />
                          </div>
                          <div className="sm:col-span-2">
                            <label className={lbl}>Location</label>
                            <input className={inp} value={job.location ?? ""} onChange={e => setJobField(idx, "location", e.target.value)} placeholder="Remote / Lagos, Nigeria" />
                          </div>
                          <div className="sm:col-span-2">
                            <label className={lbl}>Description</label>
                            <textarea className={`${inp} resize-none`} rows={3} value={job.description ?? ""}
                              onChange={e => setJobField(idx, "description", e.target.value)}
                              placeholder="Key responsibilities, achievements…" />
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => removeJob(idx)}
                            className="flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400 hover:bg-blue-500/20">
                            <Trash2 className="h-3.5 w-3.5" /> Remove
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Save */}
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={loading}
        className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-50">
        {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {loading ? "Saving…" : "Save Business Profile"}
      </motion.button>
    </div>
  );
}
