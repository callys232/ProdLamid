"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Lock, Trash2, RefreshCw, Plus, Briefcase, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import type { Organization, EmploymentEntry, OrgSize } from "@/types/enterprise";

const ORG_SIZES: OrgSize[] = ["1–10", "11–50", "51–200", "201–500", "501–1,000", "1,000+"];
const EMPTY_JOB: EmploymentEntry = { company: "", role: "", startDate: "", endDate: "", location: "", description: "" };

interface Props {
  org: Organization | null;
  orgRole: string;
}

const input = "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-600 transition focus:border-[#2563EB]/40 focus:outline-none";

export default function OrgSettings({ org, orgRole }: Props) {
  const [form, setForm] = useState({
    name:              org?.name        ?? "",
    industry:          org?.industry    ?? "",
    website:           org?.website     ?? "",
    description:       org?.description ?? "",
    orgSize:           org?.orgSize     ?? "" as string,
    employmentHistory: (org?.employmentHistory ?? []) as EmploymentEntry[],
  });
  const [expanded, setExpanded] = useState<number | null>(null);
  const [settings, setSettings] = useState({
    allowPublicProjects:    org?.settings?.allowPublicProjects    ?? true,
    requireApprovalForBids: org?.settings?.requireApprovalForBids ?? false,
    whiteLabelEnabled:      org?.settings?.whiteLabelEnabled      ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isAdmin = orgRole === "org_admin";
  const isPlusTier = org?.tier === "enterprise_plus";

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/enterprise/org", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, settings }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Settings saved");
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  }

  return (
    <div className="space-y-4 p-4">
      {/* Org profile */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-gray-600">Organisation Profile</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">Organisation Name</label>
            <input className={input} value={form.name} disabled={!isAdmin} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">Industry</label>
            <input className={input} value={form.industry} disabled={!isAdmin} placeholder="e.g. Financial Services" onChange={e => setForm(p => ({ ...p, industry: e.target.value }))} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">Organisation Size</label>
            <div className="relative">
              <select value={form.orgSize} disabled={!isAdmin} onChange={e => setForm(p => ({ ...p, orgSize: e.target.value }))}
                className={`${input} appearance-none pr-8 ${!isAdmin ? "opacity-50 cursor-not-allowed" : ""}`}>
                <option value="">Select size…</option>
                {ORG_SIZES.map(s => <option key={s} value={s}>{s} employees</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">Website</label>
            <input className={input} value={form.website} disabled={!isAdmin} placeholder="https://yourcompany.com" onChange={e => setForm(p => ({ ...p, website: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-gray-600">Description</label>
            <textarea className={`${input} resize-none`} rows={3} value={form.description} disabled={!isAdmin}
              placeholder="Tell us about your organisation…" onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
        </div>
      </div>

      {/* ── Employment / work history ── */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[#2563EB]" />
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-600">Work / Employment History</h3>
            <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-gray-600">{form.employmentHistory.length}</span>
          </div>
          {isAdmin && (
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => {
                const next = [...form.employmentHistory, { ...EMPTY_JOB }];
                setForm(p => ({ ...p, employmentHistory: next }));
                setExpanded(next.length - 1);
              }}
              className="flex items-center gap-1.5 rounded-lg border border-[#2563EB]/30 bg-[#2563EB]/10 px-3 py-1.5 text-xs font-semibold text-[#2563EB] hover:bg-[#2563EB]/20">
              <Plus className="h-3.5 w-3.5" /> Add Entry
            </motion.button>
          )}
        </div>

        {form.employmentHistory.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-600">No work history yet.{isAdmin && <> Click <span className="text-[#2563EB]">Add Entry</span> to start.</>}</p>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {form.employmentHistory.map((job, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }} className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  <button type="button" onClick={() => setExpanded(expanded === idx ? null : idx)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-white/5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {job.role || <span className="italic text-gray-500">New entry</span>}
                      </p>
                      {job.company && (
                        <p className="truncate text-xs text-gray-500">{job.company}{job.startDate ? ` · ${job.startDate}` : ""}{job.endDate ? ` → ${job.endDate}` : ""}</p>
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
                        className="overflow-hidden border-t border-white/10 px-4 pb-4 pt-4">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {[
                            { key: "company",   label: "Company *",     placeholder: "Acme Corp"         },
                            { key: "role",      label: "Role / Title *", placeholder: "Senior Consultant" },
                            { key: "location",  label: "Location",       placeholder: "Remote / City"    },
                          ].map(({ key, label, placeholder }) => (
                            <div key={key}>
                              <label className="mb-1.5 block text-xs font-medium text-gray-600">{label}</label>
                              <input className={input} disabled={!isAdmin} value={(job as any)[key] ?? ""}
                                placeholder={placeholder}
                                onChange={e => {
                                  if (!isAdmin) return;
                                  const next = [...form.employmentHistory];
                                  next[idx] = { ...next[idx], [key]: e.target.value };
                                  setForm(p => ({ ...p, employmentHistory: next }));
                                }} />
                            </div>
                          ))}
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-600">Start Date</label>
                            <input className={input} type="month" disabled={!isAdmin} value={job.startDate ?? ""}
                              onChange={e => {
                                if (!isAdmin) return;
                                const next = [...form.employmentHistory];
                                next[idx] = { ...next[idx], startDate: e.target.value };
                                setForm(p => ({ ...p, employmentHistory: next }));
                              }} />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-600">End Date</label>
                            <input className={input} disabled={!isAdmin} placeholder="Present or YYYY-MM" value={job.endDate ?? ""}
                              onChange={e => {
                                if (!isAdmin) return;
                                const next = [...form.employmentHistory];
                                next[idx] = { ...next[idx], endDate: e.target.value };
                                setForm(p => ({ ...p, employmentHistory: next }));
                              }} />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-xs font-medium text-gray-600">Description</label>
                            <textarea className={`${input} resize-none`} rows={3} disabled={!isAdmin} value={job.description ?? ""}
                              placeholder="Key responsibilities, achievements…"
                              onChange={e => {
                                if (!isAdmin) return;
                                const next = [...form.employmentHistory];
                                next[idx] = { ...next[idx], description: e.target.value };
                                setForm(p => ({ ...p, employmentHistory: next }));
                              }} />
                          </div>
                        </div>
                        {isAdmin && (
                          <div className="mt-3 flex justify-end">
                            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                              onClick={() => {
                                setForm(p => ({ ...p, employmentHistory: p.employmentHistory.filter((_, i) => i !== idx) }));
                                setExpanded(null);
                              }}
                              className="flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400 hover:bg-blue-500/20">
                              <Trash2 className="h-3.5 w-3.5" /> Remove
                            </motion.button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Platform settings */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-gray-600">Platform Settings</h3>
        <div className="space-y-4">
          {[
            { key: "allowPublicProjects",    label: "Allow Public Projects",    desc: "Projects posted by org members appear in the public marketplace" },
            { key: "requireApprovalForBids", label: "Require Bid Approval",     desc: "Org admin must approve consultant bids before they're accepted" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                disabled={!isAdmin}
                onClick={() => setSettings(p => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ${
                  settings[key as keyof typeof settings] ? "bg-[#2563EB]" : "bg-white/20"
                } ${!isAdmin ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <motion.span
                  animate={{ x: settings[key as keyof typeof settings] ? 18 : 2 }}
                  className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow"
                />
              </motion.button>
            </div>
          ))}

          {/* White-label — Enterprise+ only */}
          <div className={`flex items-start justify-between gap-4 ${!isPlusTier ? "opacity-40" : ""}`}>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-white">White-Label Portal</p>
                {!isPlusTier && <Lock className="h-3 w-3 text-gray-500" />}
              </div>
              <p className="text-xs text-gray-500">Deploy a fully branded version of the platform. Enterprise+ only.</p>
            </div>
            <motion.button
              whileTap={isPlusTier ? { scale: 0.9 } : {}}
              disabled={!isAdmin || !isPlusTier}
              onClick={() => isPlusTier && setSettings(p => ({ ...p, whiteLabelEnabled: !p.whiteLabelEnabled }))}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ${
                settings.whiteLabelEnabled ? "bg-[#2563EB]" : "bg-white/20"
              } ${(!isAdmin || !isPlusTier) ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              <motion.span
                animate={{ x: settings.whiteLabelEnabled ? 18 : 2 }}
                className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow"
              />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Save button */}
      {isAdmin && (
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </motion.button>
      )}

      {/* Danger zone */}
      {isAdmin && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
          <h3 className="mb-2 text-sm font-semibold text-blue-400">Danger Zone</h3>
          <p className="mb-4 text-xs text-gray-500">Deleting your organisation is permanent. All projects, members, and data will be lost.</p>
          {!confirmDelete ? (
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 rounded-lg border border-blue-500/30 px-4 py-2 text-sm font-semibold text-blue-400 transition hover:bg-blue-500/10"
            >
              <Trash2 className="h-4 w-4" /> Delete Organisation
            </motion.button>
          ) : (
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => toast.error("Contact support to delete your org")}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Yes, delete permanently
              </motion.button>
              <button onClick={() => setConfirmDelete(false)} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-600 hover:text-white">
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
