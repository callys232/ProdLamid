"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase, Plus, Trash2, Edit2, X, Check,
  Calendar, MapPin, Tag, ChevronDown, ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";

/* ── Types ────────────────────────────────────────────────────── */
export interface EmploymentEntry {
  id: string;
  company: string;
  role: string;
  type: string;
  industry: string;
  location: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  current: boolean;
  description: string;
  skills: string[];
  achievements: string[];
}

const EMPTY_ENTRY: Omit<EmploymentEntry, "id"> = {
  company: "", role: "", type: "Full-time", industry: "",
  location: "", startMonth: "", startYear: "",
  endMonth: "", endYear: "", current: false,
  description: "", skills: [], achievements: [],
};

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const YEARS = Array.from({ length: 40 }, (_, i) => String(new Date().getFullYear() - i));

const EMPLOYMENT_TYPES = ["Full-time","Part-time","Contract","Freelance","Internship","Volunteer"];

/* ── Input primitives ─────────────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gray-400">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-gray-700 bg-black/60 px-3 py-2.5 text-sm text-white placeholder-gray-600 transition focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]/40";

const selectCls =
  "w-full rounded-lg border border-gray-700 bg-black/60 px-3 py-2.5 text-sm text-white transition focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]/40 appearance-none";

/* ── Main Component ───────────────────────────────────────────── */
export default function EmploymentHistory({ user }: { user?: any }) {
  const initial: EmploymentEntry[] = user?.profile?.employment ?? [];
  const [entries, setEntries]   = useState<EmploymentEntry[]>(initial);
  const [editing, setEditing]   = useState<string | null>(null);   // id or "new"
  const [form, setForm]         = useState<Omit<EmploymentEntry,"id">>(EMPTY_ENTRY);
  const [skillInput, setSkillInput]           = useState("");
  const [achievementInput, setAchievementInput] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [saving, setSaving]     = useState(false);

  /* ── Helpers ────────────────────────────────────────────── */
  function openNew() {
    setForm(EMPTY_ENTRY);
    setSkillInput("");
    setAchievementInput("");
    setEditing("new");
  }

  function openEdit(entry: EmploymentEntry) {
    const { id, ...rest } = entry;
    setForm(rest);
    setSkillInput("");
    setAchievementInput("");
    setEditing(id);
  }

  function cancel() { setEditing(null); }

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function addSkill() {
    const s = skillInput.trim();
    if (!s || form.skills.includes(s)) return;
    setForm((p) => ({ ...p, skills: [...p.skills, s] }));
    setSkillInput("");
  }

  function removeSkill(s: string) {
    setForm((p) => ({ ...p, skills: p.skills.filter((x) => x !== s) }));
  }

  function addAchievement() {
    const a = achievementInput.trim();
    if (!a) return;
    setForm((p) => ({ ...p, achievements: [...p.achievements, a] }));
    setAchievementInput("");
  }

  function removeAchievement(a: string) {
    setForm((p) => ({ ...p, achievements: p.achievements.filter((x) => x !== a) }));
  }

  async function save() {
    if (!form.company || !form.role) {
      toast.error("Company and role are required.");
      return;
    }

    setSaving(true);
    const updated =
      editing === "new"
        ? [...entries, { ...form, id: crypto.randomUUID() }]
        : entries.map((e) => (e.id === editing ? { ...form, id: e.id } : e));

    try {
      await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employment: updated }),
      });
      setEntries(updated);
      toast.success(editing === "new" ? "Employment added." : "Entry updated.");
      setEditing(null);
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    const updated = entries.filter((e) => e.id !== id);
    try {
      await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employment: updated }),
      });
      setEntries(updated);
      toast.success("Entry removed.");
    } catch {
      toast.error("Failed to remove entry.");
    }
  }

  function dateRange(e: EmploymentEntry) {
    const start = [e.startMonth, e.startYear].filter(Boolean).join(" ");
    const end   = e.current ? "Present" : [e.endMonth, e.endYear].filter(Boolean).join(" ");
    return [start, end].filter(Boolean).join(" – ");
  }

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-[#2563EB]" />
          <h2 className="text-lg font-semibold text-white">Employment History</h2>
          <span className="rounded-full bg-[#2563EB]/20 px-2 py-0.5 text-[10px] font-semibold text-[#2563EB]">
            {entries.length} {entries.length === 1 ? "entry" : "entries"}
          </span>
        </div>
        {editing === null && (
          <motion.button
            onClick={openNew}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Add Position
          </motion.button>
        )}
      </div>

      {/* Add / Edit Form */}
      <AnimatePresence>
        {editing !== null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-[#2563EB]/40 bg-black/80 p-6 shadow-2xl shadow-[#2563EB]/10"
          >
            <h3 className="mb-5 text-sm font-semibold text-white">
              {editing === "new" ? "Add New Position" : "Edit Position"}
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Company */}
              <Field label="Company *">
                <input
                  value={form.company}
                  onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                  placeholder="e.g. Google, Accenture"
                  className={inputCls}
                />
              </Field>

              {/* Role */}
              <Field label="Job Title / Role *">
                <input
                  value={form.role}
                  onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                  placeholder="e.g. Senior Product Designer"
                  className={inputCls}
                />
              </Field>

              {/* Type */}
              <Field label="Employment Type">
                <div className="relative">
                  <select
                    value={form.type}
                    onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                    className={selectCls}
                  >
                    {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>
              </Field>

              {/* Industry */}
              <Field label="Industry">
                <input
                  value={form.industry}
                  onChange={(e) => setForm((p) => ({ ...p, industry: e.target.value }))}
                  placeholder="e.g. Fintech, Healthcare"
                  className={inputCls}
                />
              </Field>

              {/* Location */}
              <Field label="Location">
                <input
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  placeholder="e.g. City, Country · Remote"
                  className={inputCls}
                />
              </Field>

              {/* Start date */}
              <Field label="Start Date">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select
                      value={form.startMonth}
                      onChange={(e) => setForm((p) => ({ ...p, startMonth: e.target.value }))}
                      className={selectCls}
                    >
                      <option value="">Month</option>
                      {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
                  </div>
                  <div className="relative flex-1">
                    <select
                      value={form.startYear}
                      onChange={(e) => setForm((p) => ({ ...p, startYear: e.target.value }))}
                      className={selectCls}
                    >
                      <option value="">Year</option>
                      {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
              </Field>

              {/* End date */}
              <Field label="End Date">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <select
                        value={form.endMonth}
                        disabled={form.current}
                        onChange={(e) => setForm((p) => ({ ...p, endMonth: e.target.value }))}
                        className={`${selectCls} disabled:opacity-30`}
                      >
                        <option value="">Month</option>
                        {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
                    </div>
                    <div className="relative flex-1">
                      <select
                        value={form.endYear}
                        disabled={form.current}
                        onChange={(e) => setForm((p) => ({ ...p, endYear: e.target.value }))}
                        className={`${selectCls} disabled:opacity-30`}
                      >
                        <option value="">Year</option>
                        {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-400">
                    <input
                      type="checkbox"
                      checked={form.current}
                      onChange={(e) => setForm((p) => ({ ...p, current: e.target.checked, endMonth: "", endYear: "" }))}
                      className="accent-[#2563EB]"
                    />
                    I currently work here
                  </label>
                </div>
              </Field>
            </div>

            {/* Description */}
            <div className="mt-4">
              <Field label="Description / Responsibilities">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Describe your responsibilities and the impact of your work…"
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </Field>
            </div>

            {/* Skills */}
            <div className="mt-4">
              <Field label="Skills Used">
                <div className="flex gap-2">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                    placeholder="Add a skill and press Enter"
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="rounded-lg bg-[#2563EB] px-3 py-2 text-sm text-white transition hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {form.skills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {form.skills.map((s) => (
                      <span key={s} className="flex items-center gap-1 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/30 px-3 py-1 text-xs text-[#2563EB]">
                        {s}
                        <button onClick={() => removeSkill(s)} className="hover:text-white">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </Field>
            </div>

            {/* Key Achievements */}
            <div className="mt-4">
              <Field label="Key Achievements (optional)">
                <div className="flex gap-2">
                  <input
                    value={achievementInput}
                    onChange={(e) => setAchievementInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addAchievement(); } }}
                    placeholder="e.g. Reduced load time by 40%, Led a team of 8…"
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={addAchievement}
                    className="rounded-lg bg-gray-800 px-3 py-2 text-sm text-white transition hover:bg-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {form.achievements.length > 0 && (
                  <ul className="mt-2 space-y-1.5">
                    {form.achievements.map((a) => (
                      <li key={a} className="flex items-start gap-2 text-xs text-gray-300">
                        <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#2563EB]" />
                        <span className="flex-1">{a}</span>
                        <button onClick={() => removeAchievement(a)} className="text-gray-600 hover:text-blue-400">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </Field>
            </div>

            {/* Form actions */}
            <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-5">
              <button
                onClick={cancel}
                className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-400 transition hover:text-white"
              >
                Cancel
              </button>
              <motion.button
                onClick={save}
                disabled={saving}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40"
              >
                {saving ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                {saving ? "Saving…" : editing === "new" ? "Add Position" : "Save Changes"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline */}
      {entries.length === 0 && editing === null ? (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-700 py-14 text-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#2563EB]/30 bg-[#2563EB]/10">
            <Briefcase className="h-6 w-6 text-[#2563EB]" />
          </div>
          <p className="text-sm font-medium text-gray-300">No employment history yet</p>
          <p className="text-xs text-gray-600">Add your work experience to strengthen your profile.</p>
          <button
            onClick={openNew}
            className="mt-2 rounded-lg bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            Add First Position
          </button>
        </motion.div>
      ) : (
        <div className="relative space-y-0">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-[#2563EB]/60 via-gray-700 to-transparent" />

          {entries.map((entry, idx) => {
            const open = expanded.has(entry.id);
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative pl-12 pb-6"
              >
                {/* Dot */}
                <div className="absolute left-0 top-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#2563EB]/50 bg-black shadow-[0_0_12px_rgba(37,99,235,0.3)]">
                  <span className="text-sm font-bold text-[#2563EB]">
                    {entry.company[0]?.toUpperCase() ?? "?"}
                  </span>
                </div>

                <div className="rounded-xl border border-gray-800 bg-black/60 p-4 transition hover:border-[#2563EB]/30 hover:bg-black/80">
                  {/* Entry header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-white">{entry.role}</h3>
                        <span className="rounded-full bg-[#2563EB]/15 px-2 py-0.5 text-[10px] font-semibold text-[#2563EB]">
                          {entry.type}
                        </span>
                        {entry.current && (
                          <span className="rounded-full bg-green-600/20 px-2 py-0.5 text-[10px] font-semibold text-green-400">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm font-medium text-gray-300">{entry.company}</p>
                      <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-gray-500">
                        {dateRange(entry) && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {dateRange(entry)}
                          </span>
                        )}
                        {entry.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {entry.location}
                          </span>
                        )}
                        {entry.industry && (
                          <span className="flex items-center gap-1">
                            <Tag className="h-3 w-3" /> {entry.industry}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-shrink-0 items-center gap-1.5">
                      <button
                        onClick={() => toggle(entry.id)}
                        className="rounded-lg p-1.5 text-gray-500 transition hover:bg-white/5 hover:text-white"
                      >
                        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => openEdit(entry)}
                        className="rounded-lg p-1.5 text-gray-500 transition hover:bg-white/5 hover:text-[#2563EB]"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => remove(entry.id)}
                        className="rounded-lg p-1.5 text-gray-500 transition hover:bg-blue-600/10 hover:text-blue-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expandable detail */}
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                          {entry.description && (
                            <p className="text-xs leading-relaxed text-gray-400">{entry.description}</p>
                          )}

                          {entry.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {entry.skills.map((s) => (
                                <span key={s} className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] text-gray-400">
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}

                          {entry.achievements.length > 0 && (
                            <ul className="space-y-1">
                              {entry.achievements.map((a) => (
                                <li key={a} className="flex items-start gap-2 text-xs text-gray-400">
                                  <Check className="mt-0.5 h-3 w-3 flex-shrink-0 text-[#2563EB]" />
                                  {a}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
