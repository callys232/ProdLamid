"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import Tooltip from "./tooltip";
import { useFieldRecommendation } from "@/hooks/useField";

interface MaterialItem { _id: string; item: string; unitCost: number; quantity: number; category: string; }

const MATERIAL_CATEGORIES: { label: string; color: string; items: string[] }[] = [
  { label: "Software",  color: "text-cyan-400",   items: ["SaaS Licence","API Credits","SDK / Library","Cloud Credits","Domain & SSL","Analytics Subscription"] },
  { label: "Hardware",  color: "text-blue-400",   items: ["Server Node","Workstation","GPU Card","Network Switch","Storage Array","IoT Device","Peripheral Equipment"] },
  { label: "Raw Materials", color: "text-amber-400", items: ["Steel","Aluminium","Timber","Concrete","Fabric","Plastics","Composites"] },
  { label: "Office",    color: "text-purple-400", items: ["Furniture","Office Equipment","Supplies","Signage","PPE","Printed Materials"] },
  { label: "Services",  color: "text-green-400",  items: ["Training Material","Documentation","Certification Fee","Testing Kit","Research Report"] },
];

function ItemPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const cat = MATERIAL_CATEGORIES.find((c) => c.items.includes(value));
  return (
    <div className="relative flex-1">
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-700 bg-black/60 px-3 py-2 text-left text-sm transition hover:border-amber-500/50"
      >
        <span className={`truncate font-medium ${cat ? cat.color : "text-gray-400"}`}>{value || "Select item…"}</span>
        <ChevronDown className={`h-3.5 w-3.5 flex-shrink-0 text-gray-500 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 w-56 rounded-xl border border-gray-700 bg-[#0f0f0f] shadow-2xl">
          <div className="max-h-52 overflow-y-auto py-1">
            {MATERIAL_CATEGORIES.map((c) => (
              <div key={c.label}>
                <p className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ${c.color} opacity-60`}>{c.label}</p>
                {c.items.map((item) => (
                  <button key={item} type="button"
                    onClick={() => { onChange(item); setOpen(false); }}
                    className={`flex w-full items-center px-4 py-1.5 text-left text-xs transition hover:bg-white/5 ${item === value ? c.color : "text-gray-300"}`}
                  >
                    {item}{item === value && <span className="ml-auto opacity-60">✓</span>}
                  </button>
                ))}
              </div>
            ))}
            <button type="button"
              onClick={() => { onChange("Custom Item"); setOpen(false); }}
              className="flex w-full items-center gap-2 border-t border-gray-800 px-3 py-2 text-left text-xs text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              <Plus className="h-3 w-3" /> Custom item
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MaterialsInput() {
  const [items, setItems] = useState<MaterialItem[]>([
    { _id: crypto.randomUUID(), item: "SaaS Licence", unitCost: 100, quantity: 10, category: "Software" },
  ]);
  const [active, setActive] = useState<number | null>(null);

  const aiResults = items.map((m, i) =>
    useFieldRecommendation({ enabled: active === i, industry: "construction", complexity: "medium", field: "unitCost", keyword: m.item })
  );

  const update = (i: number, field: keyof MaterialItem, value: any) =>
    setItems((p) => p.map((m, idx) => idx === i ? { ...m, [field]: value } : m));

  const total = items.reduce((s, m) => s + m.unitCost * m.quantity, 0);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[1fr_100px_80px_32px] gap-3 px-3 pb-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-500">Item</span>
        <span className="text-right text-[10px] font-semibold uppercase tracking-widest text-green-500">Unit Cost</span>
        <span className="text-right text-[10px] font-semibold uppercase tracking-widest text-blue-400">Qty</span>
        <span />
      </div>

      {items.map((m, i) => {
        const ai = aiResults[i];
        const isActive = active === i;
        const cat = MATERIAL_CATEGORIES.find((c) => c.items.includes(m.item));
        return (
          <div key={m._id} className={`relative grid grid-cols-[1fr_100px_80px_32px] items-center gap-3 rounded-xl border p-3 transition ${
            isActive ? "border-amber-500/40 bg-amber-500/5" : "border-gray-800 bg-black/40 hover:border-gray-700"
          }`}>
            <ItemPicker value={m.item} onChange={(v) => update(i, "item", v)} />

            <div className="relative">
              <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-green-500">$</span>
              <input type="number" min={0} value={m.unitCost}
                onFocus={() => setActive(i)} onBlur={() => setActive(null)}
                onChange={(e) => update(i, "unitCost", Number(e.target.value))}
                className="w-full rounded-lg border border-gray-700 bg-black/60 py-2 pl-5 pr-2 text-right text-sm text-green-400 focus:border-green-600/50 focus:outline-none"
              />
            </div>

            <input type="number" min={0} value={m.quantity}
              onFocus={() => setActive(i)} onBlur={() => setActive(null)}
              onChange={(e) => update(i, "quantity", Number(e.target.value))}
              className="w-full rounded-lg border border-gray-700 bg-black/60 px-2 py-2 text-right text-sm text-blue-400 focus:border-blue-600/50 focus:outline-none"
            />

            <button type="button" onClick={() => setItems((p) => p.filter((_, idx) => idx !== i))}
              disabled={items.length === 1}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 transition hover:bg-red-600/10 hover:text-red-400 disabled:opacity-20"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>

            {isActive && (
              <div className="col-span-4 -mt-1 flex justify-between px-1 text-[10px]">
                <span className={cat?.color ?? "text-gray-500"}>{cat?.label ?? "Custom"} · {m.item}</span>
                <span className="font-semibold text-amber-400">${(m.unitCost * m.quantity).toLocaleString()} subtotal</span>
              </div>
            )}

            <Tooltip visible={isActive} loading={ai.loading}
              recommendation={ai.data?.recommendation || "Typical material pricing varies by market"}
              source={ai.data?.source || ""}
              confidence={ai.data?.confidence || 0.8}
            />
          </div>
        );
      })}

      <div className="flex items-center justify-between pt-1">
        <button type="button" onClick={() => setItems((p) => [...p, { _id: crypto.randomUUID(), item: "", unitCost: 0, quantity: 1, category: "" }])}
          className="flex items-center gap-1.5 rounded-lg border border-dashed border-gray-700 px-3 py-2 text-xs text-gray-500 transition hover:border-amber-500/50 hover:text-amber-400"
        >
          <Plus className="h-3.5 w-3.5" /> Add Item
        </button>
        <div className="text-right">
          <p className="text-[10px] text-gray-500">Total Materials</p>
          <p className="text-base font-bold text-amber-400">${total.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
