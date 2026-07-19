"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Clock, XCircle, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

type Status = "available" | "partially_available" | "unavailable";

interface Props {
  initial?: {
    openToWork?:         boolean;
    availabilityStatus?: Status;
    hoursPerWeek?:       number;
  };
}

const STATUS_CONFIG: Record<Status, { label: string; color: string; dot: string; icon: typeof Briefcase }> = {
  available:           { label: "Available",          color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", dot: "bg-emerald-400", icon: Briefcase },
  partially_available: { label: "Partially Available",color: "text-yellow-400  border-yellow-500/30  bg-yellow-500/10",  dot: "bg-yellow-400",  icon: Clock     },
  unavailable:         { label: "Unavailable",         color: "text-blue-400    border-blue-500/30     bg-blue-500/10",     dot: "bg-blue-400",     icon: XCircle   },
};

export default function AvailabilityToggle({ initial }: Props) {
  const [openToWork, setOpenToWork]     = useState(initial?.openToWork ?? false);
  const [status,     setStatus]         = useState<Status>(initial?.availabilityStatus ?? "available");
  const [hours,      setHours]          = useState(initial?.hoursPerWeek ?? 40);
  const [open,       setOpen]           = useState(false);
  const [saving,     setSaving]         = useState(false);

  const cfg = STATUS_CONFIG[status];

  async function save(patch: { openToWork: boolean; availabilityStatus: Status; hoursPerWeek: number }) {
    setSaving(true);
    try {
      const res = await fetch("/api/consultant/availability", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("Availability updated");
    } catch {
      toast.error("Failed to save availability");
    } finally {
      setSaving(false);
    }
  }

  function toggle() {
    const next = !openToWork;
    setOpenToWork(next);
    save({ openToWork: next, availabilityStatus: status, hoursPerWeek: hours });
  }

  return (
    <div className="relative">
      {/* Main toggle row */}
      <div className="flex items-center gap-3">
        {/* Open to work pill */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggle}
          disabled={saving}
          className={`relative flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
            openToWork
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
              : "border-white/10 bg-white/5 text-gray-500"
          }`}
        >
          <motion.span
            animate={{ backgroundColor: openToWork ? "#22c55e" : "#6b7280" }}
            className="h-1.5 w-1.5 rounded-full flex-shrink-0"
          />
          {openToWork ? "Open to Work" : "Not Available"}
          {saving && <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />}
        </motion.button>

        {/* Status selector trigger */}
        {openToWork && (
          <motion.button
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setOpen(o => !o)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${cfg.color}`}
          >
            <cfg.icon className="h-3 w-3" />
            {cfg.label}
            <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
          </motion.button>
        )}
      </div>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && openToWork && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{  opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 top-full mt-2 z-30 w-72 rounded-xl border border-white/10 bg-[#0d0d0d] p-4 shadow-2xl space-y-3"
          >
            {/* Status options */}
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-2">Status</p>
            {(Object.entries(STATUS_CONFIG) as [Status, typeof cfg][]).map(([key, c]) => (
              <button
                key={key}
                onClick={() => { setStatus(key); save({ openToWork, availabilityStatus: key, hoursPerWeek: hours }); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-xs font-medium transition-colors ${
                  status === key ? c.color : "border-white/5 bg-white/5 text-gray-400 hover:bg-white/8"
                }`}
              >
                <span className={`h-2 w-2 rounded-full flex-shrink-0 ${c.dot}`} />
                <c.icon className="h-3.5 w-3.5 flex-shrink-0" />
                {c.label}
              </button>
            ))}

            {/* Hours per week */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                Hours / week: <span className="text-white">{hours}h</span>
              </p>
              <input type="range" min={0} max={80} step={5} value={hours}
                onChange={e => setHours(Number(e.target.value))}
                onMouseUp={() => save({ openToWork, availabilityStatus: status, hoursPerWeek: hours })}
                className="w-full accent-[#2563EB]"
              />
              <div className="flex justify-between text-[10px] text-gray-600 mt-0.5">
                <span>0h</span><span>40h</span><span>80h</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
