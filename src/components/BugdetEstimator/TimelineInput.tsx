"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Tooltip from "./tooltip";
import { fetchRecommendation } from "../../utils/api";

type UrgencyLevel = "low" | "medium" | "high" | "";

interface TooltipData { recommendation: string; source: string; confidence: number; }
type FieldKey = "durationWeeks" | "milestones" | "urgencyLevel";

const URGENCY_OPTS: { value: UrgencyLevel; label: string; color: string; note: string }[] = [
  { value: "low",    label: "Low",    color: "text-green-400",  note: "Flexible schedule — no rush premium." },
  { value: "medium", label: "Medium", color: "text-yellow-400", note: "Standard pace — ~10% schedule buffer." },
  { value: "high",   label: "High",   color: "text-red-400",    note: "Rush delivery — expect +20–30% cost impact." },
];

const MILESTONE_PRESETS = [
  "Discovery, Design, Development, QA, Launch",
  "Research, Prototype, Build, Test, Deploy",
  "Planning, Design, MVP, Beta, Release",
  "Scoping, Sprint 1, Sprint 2, Sprint 3, Handover",
];

const inputCls = "w-full rounded-lg border border-gray-700 bg-black/60 px-3 py-2 text-sm text-white transition focus:border-purple-500/60 focus:outline-none";
const cardBase = (active: boolean) => `relative rounded-xl border p-4 transition ${active ? "border-purple-500/50 bg-purple-500/5" : "border-gray-800 bg-black/40 hover:border-gray-700"}`;

export default function TimelineInput() {
  const [timeline, setTimeline] = useState({ durationWeeks: 12, milestones: "Design, Development, Testing", urgencyLevel: "medium" as UrgencyLevel });
  const [activeField, setActiveField] = useState<FieldKey | null>(null);
  const [tooltips, setTooltips] = useState<Partial<Record<FieldKey, TooltipData>>>({});
  const [loading, setLoading] = useState<Partial<Record<FieldKey, boolean>>>({});

  const getRec = async (field: FieldKey) => {
    if (tooltips[field]) return;
    setLoading((p) => ({ ...p, [field]: true }));
    const data = await fetchRecommendation("it", "medium", field, String(timeline[field] ?? ""));
    setTooltips((p) => ({ ...p, [field]: data }));
    setLoading((p) => ({ ...p, [field]: false }));
  };

  const selectedUrgency = URGENCY_OPTS.find((o) => o.value === timeline.urgencyLevel);

  return (
    <div className="space-y-3">
      {/* Duration */}
      <div className={cardBase(activeField === "durationWeeks")}>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-purple-400">Duration (weeks)</label>
        <div className="mt-2 flex items-center gap-4">
          <input type="range" min={1} max={104} value={timeline.durationWeeks}
            onFocus={() => { setActiveField("durationWeeks"); getRec("durationWeeks"); }} onBlur={() => setActiveField(null)}
            onChange={(e) => setTimeline((p) => ({ ...p, durationWeeks: Number(e.target.value) }))}
            className="flex-1 accent-purple-500"
          />
          <span className="w-20 text-right text-sm font-bold text-purple-400">
            {timeline.durationWeeks} wks
            <span className="block text-[10px] font-normal text-gray-500">≈ {Math.round(timeline.durationWeeks / 4.3)} months</span>
          </span>
        </div>
        <Tooltip visible={activeField === "durationWeeks"} loading={loading.durationWeeks}
          recommendation={tooltips.durationWeeks?.recommendation || "Typical project duration: 10–16 weeks"}
          source={tooltips.durationWeeks?.source || ""} confidence={tooltips.durationWeeks?.confidence || 0.8} />
      </div>

      {/* Milestones */}
      <div className={cardBase(activeField === "milestones")}>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-blue-400">Milestones</label>
        <input type="text" value={timeline.milestones}
          onFocus={() => { setActiveField("milestones"); getRec("milestones"); }} onBlur={() => setActiveField(null)}
          onChange={(e) => setTimeline((p) => ({ ...p, milestones: e.target.value }))}
          placeholder="e.g. Design, Development, Testing"
          className={`${inputCls} mt-2`}
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {MILESTONE_PRESETS.map((preset) => (
            <button key={preset} type="button"
              onClick={() => setTimeline((p) => ({ ...p, milestones: preset }))}
              className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[10px] text-blue-400 transition hover:bg-blue-500/20"
            >
              {preset.split(",")[0]}…
            </button>
          ))}
        </div>
        <Tooltip visible={activeField === "milestones"} loading={loading.milestones}
          recommendation={tooltips.milestones?.recommendation || "Design → Dev → QA → Launch"}
          source={tooltips.milestones?.source || ""} confidence={tooltips.milestones?.confidence || 0.75} />
      </div>

      {/* Urgency */}
      <div className={cardBase(activeField === "urgencyLevel")}>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-yellow-400">Urgency Level</label>
        <div className="mt-2 flex gap-2">
          {URGENCY_OPTS.map((o) => (
            <button key={o.value} type="button"
              onFocus={() => { setActiveField("urgencyLevel"); getRec("urgencyLevel"); }} onBlur={() => setActiveField(null)}
              onClick={() => setTimeline((p) => ({ ...p, urgencyLevel: o.value }))}
              className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition ${
                timeline.urgencyLevel === o.value
                  ? `${o.color} border-current bg-current/10`
                  : "border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300"
              }`}
            >{o.label}</button>
          ))}
        </div>
        {selectedUrgency && <p className={`mt-2 text-xs ${selectedUrgency.color}`}>{selectedUrgency.note}</p>}
        <Tooltip visible={activeField === "urgencyLevel"} loading={loading.urgencyLevel}
          recommendation={tooltips.urgencyLevel?.recommendation || "High urgency adds 20–30% cost"}
          source={tooltips.urgencyLevel?.source || ""} confidence={tooltips.urgencyLevel?.confidence || 0.7} />
      </div>
    </div>
  );
}
