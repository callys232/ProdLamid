"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { RefreshCw, AlertTriangle, ShieldCheck, Undo2, Ban, Scale } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Escrow queue.
 *
 * Until now escrow was view-only in admin: a dispute could be raised but never
 * settled, and money held in dispute appeared in no total. This is the surface
 * that closes those out. Every action requires a written reason, which is stored
 * against the escrow.
 */

interface Party { _id?: string; username?: string; email?: string }

interface EscrowRow {
  _id:            string;
  amount:         number;
  status:         string;
  clientId?:      Party | string | null;
  consultantId?:  Party | string | null;
  disputeReason?: string;
  disputedAt?:    string;
  createdAt?:     string;
}

type Action = "release" | "refund" | "cancel";

const STATUS_STYLE: Record<string, string> = {
  disputed: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  funded:   "border-blue-500/30 bg-blue-500/10 text-blue-400",
  released: "border-green-500/30 bg-green-500/10 text-green-400",
  refunded: "border-purple-500/30 bg-purple-500/10 text-purple-300",
  canceled: "border-gray-500/30 bg-gray-500/10 text-gray-400",
  pending:  "border-gray-500/30 bg-gray-500/10 text-gray-400",
};

const FILTERS = ["disputed", "funded", "released", "refunded", "canceled", "all"] as const;

const ACTIONS: { key: Action; label: string; Icon: typeof ShieldCheck; tone: string }[] = [
  { key: "release", label: "Release to consultant", Icon: ShieldCheck, tone: "text-green-400 hover:bg-green-500/10" },
  { key: "refund",  label: "Refund the client",     Icon: Undo2,       tone: "text-purple-300 hover:bg-purple-500/10" },
  { key: "cancel",  label: "Cancel",                Icon: Ban,         tone: "text-gray-400 hover:bg-gray-500/10" },
];

const name = (p: EscrowRow["clientId"]) =>
  !p ? "—" : typeof p === "string" ? p : p.username || p.email || "—";

const money = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

export default function EscrowQueue() {
  const [rows, setRows]       = useState<EscrowRow[]>([]);
  const [byStatus, setByStatus] = useState<Record<string, { count: number; amount: number }>>({});
  const [held, setHeld]       = useState(0);
  const [filter, setFilter]   = useState<(typeof FILTERS)[number]>("disputed");
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [acting, setActing]   = useState<string | null>(null);

  const load = useCallback(async (status: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/escrow?status=${status}`, { credentials: "include" });
      if (res.status === 403) throw new Error("Administrator access required.");
      if (!res.ok) throw new Error("Could not load escrows.");
      const data = await res.json();
      setRows(data.escrows ?? []);
      setByStatus(data.byStatus ?? {});
      setHeld(data.heldInDispute ?? 0);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not load escrows.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(filter); }, [load, filter]);

  const act = async (escrowId: string, action: Action, isDispute: boolean) => {
    const reason = window.prompt(
      `Reason for this ${action}. It is stored against the escrow and cannot be edited.`,
    );
    if (reason === null) return;              // cancelled the prompt
    if (!reason.trim()) { toast.error("A reason is required."); return; }

    setActing(escrowId);
    try {
      const res = await fetch("/api/admin/escrow", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(
          isDispute
            ? { escrowId, action: "resolve", outcome: action === "release" ? "released" : action === "refund" ? "refunded" : "canceled", reason }
            : { escrowId, action, reason },
        ),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Action failed.");
      toast.success(data.message);
      load(filter);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setActing(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }} className="flex flex-col gap-6 p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white">Escrow</h2>
          <p className="text-xs text-gray-500">Settle disputes, release, refund or cancel. Every action is recorded.</p>
        </div>
        <button
          type="button" onClick={() => load(filter)} aria-label="Refresh"
          className="rounded-lg border border-[#1f1f1f] p-2 text-gray-400 transition hover:text-white"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Held in dispute — the figure the finance panel never showed */}
      {held > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/[0.06] p-4">
          <Scale className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" />
          <p className="text-xs text-yellow-200/90">
            <span className="font-bold">{money(held)}</span> is held in dispute — taken from clients and
            neither released nor returned. Each one needs an outcome.
          </p>
        </div>
      )}

      {/* Status filter with live counts */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const b = byStatus[f];
          return (
            <button
              key={f} type="button" onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                filter === f ? "bg-[#2563EB] text-white" : "border border-[#1f1f1f] text-gray-400 hover:text-white"
              }`}
            >
              {f}{b ? ` (${b.count})` : ""}
            </button>
          );
        })}
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
        </div>
      ) : loading ? (
        <p className="flex items-center gap-2 text-sm text-gray-400">
          <RefreshCw className="h-4 w-4 animate-spin" /> Loading…
        </p>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-[#1f1f1f] p-10 text-center">
          <p className="text-sm text-gray-500">
            {filter === "disputed" ? "No open disputes." : `No ${filter} escrows.`}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((r) => {
            const isDispute = r.status === "disputed";
            const busy = acting === r._id;
            return (
              <div key={r._id} className="rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] p-4">
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${STATUS_STYLE[r.status] ?? STATUS_STYLE.pending}`}>
                    {r.status}
                  </span>
                  <span className="text-lg font-bold tabular-nums text-white">{money(r.amount)}</span>
                  <span className="text-[11px] text-gray-500">
                    {name(r.clientId)} → {name(r.consultantId)}
                  </span>
                  <span className="ml-auto font-mono text-[10px] text-gray-600">{r._id}</span>
                </div>

                {r.disputeReason && (
                  <p className="mb-3 rounded-lg border border-[#1f1f1f] bg-[#111] p-3 text-xs text-gray-300">
                    <span className="font-semibold text-yellow-400">Dispute:</span> {r.disputeReason}
                    {r.disputedAt && (
                      <span className="ml-2 text-gray-600">
                        · {new Date(r.disputedAt).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                )}

                {/* Terminal states have nothing left to decide. */}
                {["released", "refunded", "canceled"].includes(r.status) ? (
                  <p className="text-[11px] text-gray-600">Settled — no further action available.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {ACTIONS.map((a) => (
                      <button
                        key={a.key}
                        type="button"
                        disabled={busy}
                        onClick={() => act(r._id, a.key, isDispute)}
                        className={`inline-flex items-center gap-1.5 rounded-lg border border-[#1f1f1f] px-3 py-1.5 text-xs font-semibold transition disabled:opacity-40 ${a.tone}`}
                      >
                        <a.Icon className="h-3.5 w-3.5" />
                        {isDispute && a.key !== "cancel" ? `Resolve — ${a.label.toLowerCase()}` : a.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
