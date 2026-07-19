"use client";

import { useRef, useState } from "react";
import { Plus, Trash2, ChevronDown, Search, Users } from "lucide-react";
import Tooltip from "./tooltip";
import { useFieldRecommendation } from "@/hooks/useField";

/* ── Role catalogue ───────────────────────────────────────────── */
const ROLE_CATEGORIES: { label: string; color: string; bg: string; roles: string[] }[] = [
  {
    label: "Engineering",
    color: "text-blue-400",
    bg: "bg-blue-500/15 border-blue-500/30",
    roles: [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Mobile Developer",
      "DevOps Engineer",
      "Data Engineer",
      "ML / AI Engineer",
      "Blockchain Developer",
      "QA Engineer",
      "Security Engineer",
    ],
  },
  {
    label: "Design",
    color: "text-purple-400",
    bg: "bg-purple-500/15 border-purple-500/30",
    roles: [
      "UI Designer",
      "UX Designer",
      "Product Designer",
      "Motion Designer",
      "Brand / Graphic Designer",
      "3D / Visual Artist",
    ],
  },
  {
    label: "Management",
    color: "text-orange-400",
    bg: "bg-orange-500/15 border-orange-500/30",
    roles: [
      "Project Manager",
      "Product Manager",
      "Scrum Master",
      "Tech Lead",
      "Delivery Manager",
    ],
  },
  {
    label: "Data & Analytics",
    color: "text-cyan-400",
    bg: "bg-cyan-500/15 border-cyan-500/30",
    roles: [
      "Data Scientist",
      "Data Analyst",
      "Business Intelligence Analyst",
      "Research Analyst",
    ],
  },
  {
    label: "Finance",
    color: "text-green-400",
    bg: "bg-green-500/15 border-green-500/30",
    roles: [
      "Financial Analyst",
      "Fractional CFO",
      "Accountant",
      "Auditor",
      "Investment Analyst",
    ],
  },
  {
    label: "Marketing",
    color: "text-pink-400",
    bg: "bg-pink-500/15 border-pink-500/30",
    roles: [
      "Marketing Manager",
      "Content Writer",
      "SEO Specialist",
      "Growth Hacker",
      "Social Media Manager",
    ],
  },
  {
    label: "Consulting",
    color: "text-yellow-400",
    bg: "bg-yellow-500/15 border-yellow-500/30",
    roles: [
      "Strategy Consultant",
      "Business Analyst",
      "Management Consultant",
      "Operations Consultant",
    ],
  },
  {
    label: "Legal",
    color: "text-blue-400",
    bg: "bg-blue-500/15 border-blue-500/30",
    roles: [
      "Legal Counsel",
      "Compliance Officer",
      "Contract Lawyer",
    ],
  },
];

const ALL_ROLES = ROLE_CATEGORIES.flatMap((c) => c.roles.map((r) => ({ role: r, ...c })));

function getCategoryFor(roleName: string) {
  return ROLE_CATEGORIES.find((c) => c.roles.includes(roleName));
}

/* ── RolePicker ─────────────────────────────────────────────── */
function RolePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = search.trim()
    ? ALL_ROLES.filter((r) => r.role.toLowerCase().includes(search.toLowerCase()))
    : ALL_ROLES;

  const cat = getCategoryFor(value);

  return (
    <div ref={ref} className="relative min-w-0 flex-1">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-700 bg-black/60 px-3 py-2 text-left text-sm transition hover:border-[#2563EB]/50"
      >
        <span className={`truncate font-medium ${cat ? cat.color : "text-gray-400"}`}>
          {value || "Select role…"}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 flex-shrink-0 text-gray-500 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 w-64 rounded-xl border border-gray-700 bg-[#0f0f0f] shadow-2xl">
          {/* Search */}
          <div className="flex items-center gap-2 border-b border-gray-700 px-3 py-2">
            <Search className="h-3.5 w-3.5 text-gray-500" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search roles…"
              className="flex-1 bg-transparent text-xs text-white placeholder-gray-600 focus:outline-none"
            />
          </div>

          <div className="max-h-56 overflow-y-auto py-1">
            {search.trim() ? (
              filtered.length ? (
                filtered.map(({ role, color, bg }) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => { onChange(role); setOpen(false); setSearch(""); }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs transition hover:bg-white/5"
                  >
                    <span className={`truncate ${color}`}>{role}</span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-2 text-xs text-gray-600">No match — type to set custom</p>
              )
            ) : (
              ROLE_CATEGORIES.map((cat) => (
                <div key={cat.label}>
                  <p className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ${cat.color} opacity-70`}>
                    {cat.label}
                  </p>
                  {cat.roles.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => { onChange(r); setOpen(false); }}
                      className={`flex w-full items-center px-4 py-1.5 text-left text-xs transition hover:bg-white/5 ${r === value ? cat.color : "text-gray-300"}`}
                    >
                      {r}
                      {r === value && <span className="ml-auto text-[10px] opacity-60">✓</span>}
                    </button>
                  ))}
                </div>
              ))
            )}

            {/* Custom option */}
            {search.trim() && !filtered.find((r) => r.role.toLowerCase() === search.toLowerCase()) && (
              <button
                type="button"
                onClick={() => { onChange(search.trim()); setOpen(false); setSearch(""); }}
                className="flex w-full items-center gap-2 border-t border-gray-800 px-3 py-2 text-left text-xs text-gray-400 transition hover:bg-white/5 hover:text-white"
              >
                <Plus className="h-3 w-3" /> Use &ldquo;{search.trim()}&rdquo; as custom role
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── LaborInput ─────────────────────────────────────────────── */
interface LaborRow {
  _id: string;
  role: string;
  hourlyRate: number;
  hours: number;
}

export default function LaborInput() {
  const [roles, setRoles] = useState<LaborRow[]>([
    { _id: crypto.randomUUID(), role: "Frontend Developer", hourlyRate: 75, hours: 80 },
    { _id: crypto.randomUUID(), role: "Project Manager",    hourlyRate: 90, hours: 40 },
  ]);

  const [active, setActive] = useState<number | null>(null);

  const { data, loading } = useFieldRecommendation({
    enabled: active !== null,
    industry: "it",
    complexity: "medium",
    field: "hourlyRate",
    keyword: roles[active ?? 0]?.role,
  });

  function addRow() {
    setRoles((p) => [...p, { _id: crypto.randomUUID(), role: "", hourlyRate: 50, hours: 40 }]);
  }

  function removeRow(i: number) {
    setRoles((p) => p.filter((_, idx) => idx !== i));
  }

  function update<K extends keyof LaborRow>(i: number, key: K, val: LaborRow[K]) {
    setRoles((p) => p.map((r, idx) => idx === i ? { ...r, [key]: val } : r));
  }

  const total = roles.reduce((sum, r) => sum + r.hourlyRate * r.hours, 0);

  return (
    <div className="space-y-3">

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_100px_100px_32px] gap-3 px-4 pb-1">
        <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
          <Users className="h-3 w-3 text-[#2563EB]" /> Role
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-green-500 text-right">$/hr</span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-400 text-right">Hours</span>
        <span />
      </div>

      {/* Rows */}
      {roles.map((r, i) => {
        const cat    = getCategoryFor(r.role);
        const rowCost = r.hourlyRate * r.hours;
        const isActive = active === i;

        return (
          <div
            key={r._id}
            className={`relative grid grid-cols-[1fr_100px_100px_32px] items-center gap-3 rounded-xl border p-3 transition ${
              isActive
                ? "border-[#2563EB]/60 bg-[#2563EB]/5 shadow-[0_0_12px_rgba(37,99,235,0.15)]"
                : "border-gray-800 bg-black/40 hover:border-gray-700"
            }`}
          >
            {/* Role picker */}
            <RolePicker
              value={r.role}
              onChange={(v) => update(i, "role", v)}
            />

            {/* Hourly rate */}
            <div className="relative">
              <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-green-500">$</span>
              <input
                type="number"
                min={0}
                value={r.hourlyRate}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                onChange={(e) => update(i, "hourlyRate", Number(e.target.value))}
                className="w-full rounded-lg border border-gray-700 bg-black/60 py-2 pl-5 pr-2 text-right text-sm text-green-400 transition focus:border-green-600/50 focus:outline-none"
              />
            </div>

            {/* Hours */}
            <input
              type="number"
              min={0}
              value={r.hours}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              onChange={(e) => update(i, "hours", Number(e.target.value))}
              className="w-full rounded-lg border border-gray-700 bg-black/60 px-2 py-2 text-right text-sm text-blue-400 transition focus:border-blue-600/50 focus:outline-none"
            />

            {/* Remove */}
            <button
              type="button"
              onClick={() => removeRow(i)}
              disabled={roles.length === 1}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 transition hover:bg-blue-600/10 hover:text-blue-400 disabled:opacity-20"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>

            {/* Row subtotal */}
            {isActive && (
              <div className="col-span-4 -mt-1 flex items-center justify-between px-1 text-[10px]">
                <span className="text-gray-500">
                  {cat && <span className={`mr-1 font-semibold ${cat.color}`}>{cat.label}</span>}
                  {r.role || "Custom role"}
                </span>
                <span className="font-semibold text-[#2563EB]">
                  ${rowCost.toLocaleString()} subtotal
                </span>
              </div>
            )}

            {/* AI Tooltip */}
            <Tooltip
              visible={isActive}
              loading={loading}
              recommendation={data?.recommendation || `Typical rate for ${r.role}: $50–150/hr`}
              source={data?.source}
              confidence={data?.confidence}
            />
          </div>
        );
      })}

      {/* Add row + total */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-1.5 rounded-lg border border-dashed border-gray-700 px-3 py-2 text-xs text-gray-500 transition hover:border-[#2563EB]/50 hover:text-[#2563EB]"
        >
          <Plus className="h-3.5 w-3.5" /> Add Role
        </button>

        <div className="text-right">
          <p className="text-[10px] text-gray-500">Total Labour Cost</p>
          <p className="text-base font-bold text-[#2563EB]">${total.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
