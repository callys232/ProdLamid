"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, ChevronDown, Search } from "lucide-react";
import Tooltip from "./tooltip";
import { fetchRecommendation } from "../../utils/api";

interface TechnologyItem { _id: string;
  tool: string;
  monthlyCost: number;
  durationMonths: number;
}

interface TooltipData {
  recommendation: string;
  source: string;
  confidence: number;
}

const TOOL_CATEGORIES: { label: string; color: string; tools: string[] }[] = [
  {
    label: "Cloud",
    color: "text-cyan-400",
    tools: ["AWS EC2", "AWS Lambda", "Google Cloud Run", "Azure VM", "DigitalOcean Droplet", "Vercel", "Heroku"],
  },
  {
    label: "Storage & DB",
    color: "text-blue-400",
    tools: ["AWS S3", "Google Cloud Storage", "PostgreSQL", "MongoDB Atlas", "Redis", "Supabase", "Firebase"],
  },
  {
    label: "Dev Tools",
    color: "text-purple-400",
    tools: ["GitHub", "GitLab", "Jira", "Linear", "Bitbucket", "CircleCI", "GitHub Actions"],
  },
  {
    label: "Design",
    color: "text-pink-400",
    tools: ["Figma", "Adobe XD", "Sketch", "Framer", "InVision", "Canva Pro"],
  },
  {
    label: "Monitoring",
    color: "text-orange-400",
    tools: ["Datadog", "Sentry", "New Relic", "PagerDuty", "Grafana Cloud"],
  },
  {
    label: "Communication",
    color: "text-green-400",
    tools: ["Slack", "Notion", "Confluence", "Loom", "Zoom Pro"],
  },
  {
    label: "Security",
    color: "text-blue-400",
    tools: ["Snyk", "SonarQube", "Auth0", "Cloudflare", "AWS WAF"],
  },
];

const ALL_TOOLS = TOOL_CATEGORIES.flatMap((c) => c.tools.map((t) => ({ tool: t, color: c.color, label: c.label })));

function ToolPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const filtered = search.trim()
    ? ALL_TOOLS.filter((t) => t.tool.toLowerCase().includes(search.toLowerCase()))
    : ALL_TOOLS;

  const cat = TOOL_CATEGORIES.find((c) => c.tools.includes(value));

  return (
    <div ref={ref} className="relative flex-1">
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-700 bg-black/60 px-3 py-2 text-left text-sm transition hover:border-cyan-500/50"
      >
        <span className={`truncate font-medium ${cat ? cat.color : "text-gray-400"}`}>{value || "Select tool…"}</span>
        <ChevronDown className={`h-3.5 w-3.5 flex-shrink-0 text-gray-500 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 w-56 rounded-xl border border-gray-700 bg-[#0f0f0f] shadow-2xl">
          <div className="flex items-center gap-2 border-b border-gray-700 px-3 py-2">
            <Search className="h-3.5 w-3.5 text-gray-500" />
            <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools…"
              className="flex-1 bg-transparent text-xs text-white placeholder-gray-600 focus:outline-none"
            />
          </div>
          <div className="max-h-52 overflow-y-auto py-1">
            {search.trim() ? (
              filtered.map(({ tool, color }) => (
                <button key={tool} type="button"
                  onClick={() => { onChange(tool); setOpen(false); setSearch(""); }}
                  className="flex w-full items-center px-3 py-1.5 text-left text-xs transition hover:bg-white/5"
                >
                  <span className={color}>{tool}</span>
                </button>
              ))
            ) : (
              TOOL_CATEGORIES.map((cat) => (
                <div key={cat.label}>
                  <p className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ${cat.color} opacity-60`}>{cat.label}</p>
                  {cat.tools.map((t) => (
                    <button key={t} type="button"
                      onClick={() => { onChange(t); setOpen(false); }}
                      className={`flex w-full items-center px-4 py-1.5 text-left text-xs transition hover:bg-white/5 ${t === value ? cat.color : "text-gray-300"}`}
                    >
                      {t}{t === value && <span className="ml-auto opacity-60">✓</span>}
                    </button>
                  ))}
                </div>
              ))
            )}
            {search.trim() && !filtered.find((t) => t.tool.toLowerCase() === search.toLowerCase()) && (
              <button type="button"
                onClick={() => { onChange(search.trim()); setOpen(false); setSearch(""); }}
                className="flex w-full items-center gap-2 border-t border-gray-800 px-3 py-2 text-left text-xs text-gray-400 transition hover:bg-white/5 hover:text-white"
              >
                <Plus className="h-3 w-3" /> Use &ldquo;{search.trim()}&rdquo;
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TechnologyInput() {
  const [tools, setTools] = useState<TechnologyItem[]>([
    { _id: crypto.randomUUID(), tool: "AWS EC2", monthlyCost: 200, durationMonths: 12 },
  ]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [tooltips, setTooltips] = useState<Record<number, TooltipData>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => { if (!containerRef.current?.contains(e.target as Node)) setActiveIndex(null); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const getRecommendation = async (index: number, tool: string) => {
    if (tooltips[index]) return;
    setLoading((p) => ({ ...p, [index]: true }));
    const data = await fetchRecommendation("it", "medium", "monthlyCost", tool || "cloud service");
    setTooltips((p) => ({ ...p, [index]: data }));
    setLoading((p) => ({ ...p, [index]: false }));
  };

  const activate = (i: number, tool: string) => { setActiveIndex(i); getRecommendation(i, tool); };

  const update = (i: number, field: keyof TechnologyItem, value: any) => {
    setTools((p) => p.map((t, idx) => idx === i ? { ...t, [field]: value } : t));
    if (field === "tool") setTooltips((p) => { const n = { ...p }; delete n[i]; return n; });
  };

  const total = tools.reduce((s, t) => s + t.monthlyCost * t.durationMonths, 0);

  return (
    <div ref={containerRef} className="space-y-3">
      {/* Headers */}
      <div className="grid grid-cols-[1fr_100px_100px_32px] gap-3 px-3 pb-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-cyan-500">Tool / Service</span>
        <span className="text-right text-[10px] font-semibold uppercase tracking-widest text-green-500">$/month</span>
        <span className="text-right text-[10px] font-semibold uppercase tracking-widest text-purple-400">Months</span>
        <span />
      </div>

      {tools.map((t, i) => {
        const isActive = activeIndex === i;
        const cat = TOOL_CATEGORIES.find((c) => c.tools.includes(t.tool));
        return (
          <div key={t._id} className={`relative grid grid-cols-[1fr_100px_100px_32px] items-center gap-3 rounded-xl border p-3 transition ${
            isActive ? "border-cyan-500/50 bg-cyan-500/5 shadow-[0_0_10px_rgba(6,182,212,0.1)]" : "border-gray-800 bg-black/40 hover:border-gray-700"
          }`}>
            <ToolPicker value={t.tool} onChange={(v) => { update(i, "tool", v); activate(i, v); }} />

            <div className="relative">
              <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-green-500">$</span>
              <input type="number" min={0} value={t.monthlyCost}
                onFocus={() => activate(i, t.tool)} onBlur={() => setActiveIndex(null)}
                onChange={(e) => update(i, "monthlyCost", Number(e.target.value))}
                className="w-full rounded-lg border border-gray-700 bg-black/60 py-2 pl-5 pr-2 text-right text-sm text-green-400 focus:border-green-600/50 focus:outline-none"
              />
            </div>

            <input type="number" min={0} value={t.durationMonths}
              onFocus={() => setActiveIndex(i)} onBlur={() => setActiveIndex(null)}
              onChange={(e) => update(i, "durationMonths", Number(e.target.value))}
              className="w-full rounded-lg border border-gray-700 bg-black/60 px-2 py-2 text-right text-sm text-purple-400 focus:border-purple-600/50 focus:outline-none"
            />

            <button type="button" onClick={() => setTools((p) => p.filter((_, idx) => idx !== i))}
              disabled={tools.length === 1}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 transition hover:bg-blue-600/10 hover:text-blue-400 disabled:opacity-20"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>

            {isActive && t.tool && (
              <div className="col-span-4 -mt-1 flex justify-between px-1 text-[10px]">
                <span className={cat?.color ?? "text-gray-500"}>{cat?.label ?? "Custom"} · {t.tool}</span>
                <span className="font-semibold text-cyan-400">${(t.monthlyCost * t.durationMonths).toLocaleString()} total</span>
              </div>
            )}

            <Tooltip visible={isActive} loading={loading[i]}
              recommendation={tooltips[i]?.recommendation || `Typical cost for ${t.tool || "cloud service"}: $150–300/month`}
              source={tooltips[i]?.source || ""}
              confidence={tooltips[i]?.confidence || 0.8}
            />
          </div>
        );
      })}

      <div className="flex items-center justify-between pt-1">
        <button type="button" onClick={() => setTools((p) => [...p, { _id: crypto.randomUUID(), tool: "", monthlyCost: 0, durationMonths: 12 }])}
          className="flex items-center gap-1.5 rounded-lg border border-dashed border-gray-700 px-3 py-2 text-xs text-gray-500 transition hover:border-cyan-500/50 hover:text-cyan-400"
        >
          <Plus className="h-3.5 w-3.5" /> Add Tool
        </button>
        <div className="text-right">
          <p className="text-[10px] text-gray-500">Total Tech Cost</p>
          <p className="text-base font-bold text-cyan-400">${total.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
