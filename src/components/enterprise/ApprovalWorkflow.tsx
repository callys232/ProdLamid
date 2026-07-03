"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, XCircle, Clock, Settings2, History,
  AlertTriangle, ChevronDown, ChevronUp, Save, Loader2,
} from "lucide-react";

/* ── Types ──────────────────────────────────────────────────── */
interface ApprovalItem {
  id:          string;
  projectName: string;
  amount:      number;
  requestor:   string;
  date:        string;
  description: string;
  status:      "pending" | "approved" | "rejected";
}

interface Props {
  orgId:    string;
  userId:   string;
  userRole: string;
}

/* ── Helpers ────────────────────────────────────────────────── */
const STORAGE_KEY_THRESHOLD = "lamid_approval_threshold";
const STORAGE_KEY_HISTORY   = "lamid_approval_history";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);

const fadeUp = (i = 0) => ({
  initial:    { opacity: 0, y: 12 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.28, delay: i * 0.06, ease: [0.33, 1, 0.68, 1] as const },
});

const card = "rounded-2xl border border-gray-800 bg-gray-900 p-5";

/* Mock pending items — real API would supply these */
const MOCK_PENDING: ApprovalItem[] = [
  {
    id:          "apr-001",
    projectName: "ERP System Integration",
    amount:      780000,
    requestor:   "Chukwuemeka Eze",
    date:        "2026-07-01",
    description: "Phase 2 escrow funding for backend development milestone",
    status:      "pending",
  },
  {
    id:          "apr-002",
    projectName: "Data Warehouse Build",
    amount:      1200000,
    requestor:   "Sarah Okonkwo",
    date:        "2026-06-30",
    description: "Full project escrow deposit — 3 milestones bundled",
    status:      "pending",
  },
  {
    id:          "apr-003",
    projectName: "Marketing Analytics Platform",
    amount:      550000,
    requestor:   "James Adeyemi",
    date:        "2026-06-28",
    description: "Milestone 1 of 4 — Discovery & strategy phase",
    status:      "pending",
  },
];

/* ── Main Component ─────────────────────────────────────────── */
export default function ApprovalWorkflow({ orgId, userId, userRole }: Props) {
  const isManager = ["org_admin", "org_manager"].includes(userRole);

  /* Pending items */
  const [pending,    setPending]    = useState<ApprovalItem[]>([]);
  const [loadingId,  setLoadingId]  = useState<string | null>(null);

  /* Threshold settings */
  const [threshold,  setThreshold]  = useState<number>(500000);
  const [inputVal,   setInputVal]   = useState<string>("500000");
  const [saving,     setSaving]     = useState(false);
  const [savedMsg,   setSavedMsg]   = useState(false);

  /* History */
  const [history,    setHistory]    = useState<ApprovalItem[]>([]);
  const [histOpen,   setHistOpen]   = useState(false);

  /* Active section accordion on mobile */
  const [section,    setSection]    = useState<"pending" | "settings" | "history">("pending");

  /* Load from localStorage (temp until API exists) */
  useEffect(() => {
    const storedThreshold = localStorage.getItem(STORAGE_KEY_THRESHOLD);
    if (storedThreshold) {
      const val = Number(storedThreshold);
      setThreshold(val);
      setInputVal(String(val));
    }
    const storedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (storedHistory) {
      try { setHistory(JSON.parse(storedHistory)); } catch {}
    }
    /* In production: fetch from /api/enterprise/approvals */
    setPending(MOCK_PENDING);
  }, []);

  /* Approve / Reject */
  const handleDecision = useCallback(
    async (item: ApprovalItem, decision: "approved" | "rejected") => {
      setLoadingId(item.id);
      try {
        /* Real API call — endpoint may not exist yet, graceful fail */
        await fetch("/api/enterprise/approvals", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            approvalId: item.id,
            decision,
            orgId,
            userId,
          }),
        }).catch(() => null); /* swallow 404 */

        const resolved: ApprovalItem = { ...item, status: decision };
        setPending(prev => prev.filter(p => p.id !== item.id));
        setHistory(prev => {
          const next = [resolved, ...prev].slice(0, 50);
          localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(next));
          return next;
        });
      } finally {
        setLoadingId(null);
      }
    },
    [orgId, userId]
  );

  /* Save threshold */
  const saveThreshold = async () => {
    const val = Number(inputVal.replace(/[^0-9]/g, ""));
    if (isNaN(val) || val < 0) return;
    setSaving(true);
    setThreshold(val);
    localStorage.setItem(STORAGE_KEY_THRESHOLD, String(val));
    /* Real API call (graceful fail) */
    await fetch("/api/enterprise/settings", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approvalThreshold: val, orgId }),
    }).catch(() => null);
    setSaving(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div className="space-y-5 p-4 bg-gray-950 min-h-screen">

      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-purple-400" />
        <span className="text-xs font-semibold uppercase tracking-widest text-purple-400">
          Approval Workflow
        </span>
      </motion.div>

      {/* Threshold banner */}
      <motion.div {...fadeUp(1)}
        className="rounded-2xl border border-purple-500/20 bg-purple-500/5 px-5 py-4 flex items-center gap-3"
      >
        <AlertTriangle className="h-4 w-4 text-purple-400 flex-shrink-0" />
        <p className="text-sm text-gray-300">
          Spend requests above{" "}
          <span className="font-bold text-purple-400">{fmt(threshold)}</span>{" "}
          require manager approval before escrow is funded.
        </p>
      </motion.div>

      {/* ── Pending Approvals ─────────────────────────────────── */}
      <motion.div {...fadeUp(2)} className={card}>
        <button
          onClick={() => setSection(s => s === "pending" ? "history" : "pending")}
          className="w-full flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-400" />
            <h2 className="text-sm font-semibold text-white">Pending Approvals</h2>
            {pending.length > 0 && (
              <span className="rounded-full bg-yellow-500/20 border border-yellow-500/30 px-2 py-0.5 text-[10px] font-bold text-yellow-400">
                {pending.length}
              </span>
            )}
          </div>
        </button>

        {pending.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-600">
            <CheckCircle2 className="h-8 w-8 mb-2 text-gray-700" />
            <p className="text-sm">No pending approvals</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((item, i) => (
              <motion.div
                key={item.id}
                {...fadeUp(i + 1)}
                className="rounded-xl border border-gray-800 bg-gray-950 p-4"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white">{item.projectName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="text-[11px] text-gray-400">
                        By <span className="text-white">{item.requestor}</span>
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {new Date(item.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-lg font-bold text-white">{fmt(item.amount)}</p>
                    {item.amount > threshold && (
                      <span className="text-[10px] text-yellow-400">Above threshold</span>
                    )}
                  </div>
                </div>

                {isManager && (
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-800">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      disabled={loadingId === item.id}
                      onClick={() => handleDecision(item, "approved")}
                      className="flex items-center gap-1.5 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs font-semibold text-green-400 transition hover:bg-green-500/20 disabled:opacity-50"
                    >
                      {loadingId === item.id
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <CheckCircle2 className="h-3.5 w-3.5" />}
                      Approve
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      disabled={loadingId === item.id}
                      onClick={() => handleDecision(item, "rejected")}
                      className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Reject
                    </motion.button>
                  </div>
                )}

                {!isManager && (
                  <div className="mt-3 pt-3 border-t border-gray-800">
                    <span className="text-[11px] text-gray-500">
                      Awaiting manager approval
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* ── Approval Settings ─────────────────────────────────── */}
      {isManager && (
        <motion.div {...fadeUp(3)} className={card}>
          <div className="flex items-center gap-2 mb-4">
            <Settings2 className="h-4 w-4 text-purple-400" />
            <h2 className="text-sm font-semibold text-white">Approval Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">
                Approval Threshold (₦)
              </label>
              <p className="text-[11px] text-gray-600 mb-3">
                Any spend request above this amount will require manager approval before escrow is funded.
              </p>
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₦</span>
                  <input
                    type="text"
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="500000"
                    className="w-full rounded-xl border border-gray-700 bg-gray-950 pl-7 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={saveThreshold}
                  disabled={saving}
                  className="flex items-center gap-1.5 rounded-xl border border-[#C12129]/30 bg-[#C12129]/10 px-5 py-2.5 text-xs font-semibold text-[#C12129] transition hover:bg-[#C12129]/20 disabled:opacity-50"
                >
                  {saving
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <Save className="h-3.5 w-3.5" />}
                  {saving ? "Saving…" : "Save"}
                </motion.button>
              </div>
              <AnimatePresence>
                {savedMsg && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-2 text-[11px] text-green-400"
                  >
                    Threshold saved — {fmt(threshold)}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-950 p-4 space-y-2">
              <p className="text-xs font-semibold text-white">How approval works</p>
              <ul className="space-y-1.5 text-[11px] text-gray-500">
                <li className="flex items-start gap-1.5"><span className="text-purple-400 flex-shrink-0">1.</span> Member submits a project spend or escrow request</li>
                <li className="flex items-start gap-1.5"><span className="text-purple-400 flex-shrink-0">2.</span> If the amount exceeds the threshold, it enters the approval queue</li>
                <li className="flex items-start gap-1.5"><span className="text-purple-400 flex-shrink-0">3.</span> An org_admin or org_manager approves or rejects</li>
                <li className="flex items-start gap-1.5"><span className="text-purple-400 flex-shrink-0">4.</span> Approved requests proceed to escrow funding automatically</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Approval History ──────────────────────────────────── */}
      <motion.div {...fadeUp(4)} className={card}>
        <button
          onClick={() => setHistOpen(o => !o)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-white">Approval History</h2>
            {history.length > 0 && (
              <span className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] font-semibold text-gray-400">
                {history.length}
              </span>
            )}
          </div>
          {histOpen
            ? <ChevronUp className="h-4 w-4 text-gray-500" />
            : <ChevronDown className="h-4 w-4 text-gray-500" />}
        </button>

        <AnimatePresence initial={false}>
          {histOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-2">
                {history.length === 0 ? (
                  <p className="text-center text-sm text-gray-600 py-6">No approval history yet</p>
                ) : (
                  history.map((item, i) => (
                    <motion.div
                      key={`${item.id}-${i}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center justify-between gap-3 rounded-xl border border-gray-800 bg-gray-950 px-4 py-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-white truncate">{item.projectName}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {item.requestor} · {new Date(item.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                      <p className="text-xs font-semibold text-gray-300 flex-shrink-0">{fmt(item.amount)}</p>
                      <span className={`flex-shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold capitalize ${
                        item.status === "approved"
                          ? "border-green-500/30 bg-green-500/10 text-green-400"
                          : "border-red-500/30 bg-red-500/10 text-red-400"
                      }`}>
                        {item.status}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}
