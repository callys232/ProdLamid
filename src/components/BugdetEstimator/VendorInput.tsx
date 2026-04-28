"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import Tooltip from "./tooltip";
import { useFieldRecommendation } from "@/hooks/useField";

interface VendorItem { vendorName: string; serviceType: string; contractCost: number; }

const SERVICE_TYPES: { label: string; color: string; types: string[] }[] = [
  { label: "Engineering",  color: "text-blue-400",   types: ["Software Development","Hardware Supply","Infrastructure","Network Setup","IT Support"] },
  { label: "Design",       color: "text-pink-400",   types: ["UI/UX Design","Brand Identity","Motion Graphics","Photography","Video Production"] },
  { label: "Consulting",   color: "text-yellow-400", types: ["Strategy Consulting","Legal Advisory","Financial Advisory","HR Consulting","Marketing Consulting"] },
  { label: "Operations",   color: "text-orange-400", types: ["Logistics","Warehousing","Facility Management","Security","Cleaning"] },
  { label: "Construction", color: "text-amber-400",  types: ["Electrical","Plumbing","Civil Works","HVAC","Painting"] },
  { label: "Marketing",    color: "text-green-400",  types: ["PR & Comms","Content Creation","SEO","Social Media","Events"] },
];


function TypePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const cat = SERVICE_TYPES.find((c) => c.types.includes(value));
  return (
    <div className="relative w-40">
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-1 rounded-lg border border-gray-700 bg-black/60 px-2.5 py-2 text-left text-xs transition hover:border-yellow-500/50"
      >
        <span className={`truncate font-medium ${cat ? cat.color : "text-gray-400"}`}>{value || "Service type…"}</span>
        <ChevronDown className={`h-3 w-3 flex-shrink-0 text-gray-500 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 w-52 rounded-xl border border-gray-700 bg-[#0f0f0f] shadow-2xl">
          <div className="max-h-48 overflow-y-auto py-1">
            {SERVICE_TYPES.map((c) => (
              <div key={c.label}>
                <p className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ${c.color} opacity-60`}>{c.label}</p>
                {c.types.map((t) => (
                  <button key={t} type="button"
                    onClick={() => { onChange(t); setOpen(false); }}
                    className={`flex w-full items-center px-4 py-1.5 text-left text-xs transition hover:bg-white/5 ${t === value ? c.color : "text-gray-300"}`}
                  >
                    {t}{t === value && <span className="ml-auto opacity-60">✓</span>}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function VendorInput() {
  const [vendors, setVendors] = useState<VendorItem[]>([
    { vendorName: "Subcontractor A", serviceType: "Software Development", contractCost: 15000 },
  ]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { data, loading } = useFieldRecommendation({
    enabled: activeIndex !== null,
    industry: "construction",
    complexity: "medium",
    field: "contractCost",
    keyword: activeIndex !== null ? vendors[activeIndex]?.serviceType : undefined,
  });

  const update = (i: number, field: keyof VendorItem, value: any) =>
    setVendors((p) => p.map((v, idx) => idx === i ? { ...v, [field]: value } : v));

  const total = vendors.reduce((s, v) => s + v.contractCost, 0);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[1fr_140px_100px_32px] gap-3 px-3 pb-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-yellow-500">Vendor Name</span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-orange-400">Service Type</span>
        <span className="text-right text-[10px] font-semibold uppercase tracking-widest text-green-500">Contract $</span>
        <span />
      </div>

      {vendors.map((v, i) => {
        const isActive = activeIndex === i;
        return (
          <div key={i} className={`relative grid grid-cols-[1fr_140px_100px_32px] items-center gap-3 rounded-xl border p-3 transition ${
            isActive ? "border-yellow-500/40 bg-yellow-500/5" : "border-gray-800 bg-black/40 hover:border-gray-700"
          }`}>
            <input type="text" value={v.vendorName} placeholder="Vendor name"
              onFocus={() => setActiveIndex(i)} onBlur={() => setActiveIndex(null)}
              onChange={(e) => update(i, "vendorName", e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-black/60 px-3 py-2 text-sm text-yellow-300 placeholder-gray-600 focus:border-yellow-500/50 focus:outline-none"
            />
            <TypePicker value={v.serviceType} onChange={(val) => update(i, "serviceType", val)} />
            <div className="relative">
              <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-green-500">$</span>
              <input type="number" min={0} value={v.contractCost}
                onFocus={() => setActiveIndex(i)} onBlur={() => setActiveIndex(null)}
                onChange={(e) => update(i, "contractCost", Number(e.target.value))}
                className="w-full rounded-lg border border-gray-700 bg-black/60 py-2 pl-5 pr-2 text-right text-sm text-green-400 focus:border-green-600/50 focus:outline-none"
              />
            </div>
            <button type="button" onClick={() => setVendors((p) => p.filter((_, idx) => idx !== i))}
              disabled={vendors.length === 1}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 transition hover:bg-red-600/10 hover:text-red-400 disabled:opacity-20"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <Tooltip visible={isActive} loading={loading}
              recommendation={data?.recommendation || "Typical vendor contracts: $12k–18k"}
              source={data?.source || ""}
              confidence={data?.confidence || 0.75}
            />
          </div>
        );
      })}

      <div className="flex items-center justify-between pt-1">
        <button type="button" onClick={() => setVendors((p) => [...p, { vendorName: "", serviceType: "", contractCost: 0 }])}
          className="flex items-center gap-1.5 rounded-lg border border-dashed border-gray-700 px-3 py-2 text-xs text-gray-500 transition hover:border-yellow-500/50 hover:text-yellow-400"
        >
          <Plus className="h-3.5 w-3.5" /> Add Vendor
        </button>
        <div className="text-right">
          <p className="text-[10px] text-gray-500">Total Vendor Cost</p>
          <p className="text-base font-bold text-yellow-400">${total.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
