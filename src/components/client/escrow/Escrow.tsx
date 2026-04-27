"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import EscrowSummaryCard from "./summaryCard";
import ProjectRow from "./projectRow";
import TransactionFeed, { ActionType } from "./transactionFeed";
import ActionModal from "./actionModal";

import { fetchEscrowSummary, fetchEscrowTransactions, fetchProjects } from "@/lib/escrowService";
import { Project } from "@/types/project";
import type { EscrowTransaction } from "@/types/escrow";
import { ClientProfile } from "@/types/client";

const CURRENCIES = ["USD", "NGN", "EUR"];

/* ── Maps each action to the right API endpoint ────────────────── */
async function callEscrowAction(
  type: ActionType,
  tx: EscrowTransaction | null | undefined,
  payload: { notes?: string; approver?: string }
): Promise<{ ok: boolean; newStatus: string }> {
  const escrowId = tx?.projectId ?? tx?.id;
  if (!escrowId) throw new Error("No project ID on transaction");

  const routes: Record<ActionType, string> = {
    fund:    "/api/escrow/fund",
    release: "/api/escrow/release",
    refund:  "/api/escrow/release",  // refund reuses release route; adjust if you add a dedicated one
    dispute: "/api/escrow/dispute",
  };

  const statusMap: Record<ActionType, string> = {
    fund:    "funded",
    release: "released",
    refund:  "refunded",
    dispute: "disputed",
  };

  const body: Record<string, any> = { escrowId };
  if (type === "dispute") body.reason = payload.notes ?? "No reason provided";
  if (type === "release" && payload.approver) body.approver = payload.approver;

  const res = await fetch(routes[type], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `${type} failed`);
  }

  return { ok: true, newStatus: statusMap[type] };
}

/* ── Sends a system message to the project workspace chat ──────── */
async function notifyWorkspace(
  projectId: string,
  message: string
) {
  try {
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ escrowId: projectId, recipient: "consultant", message }),
    });
  } catch {
    // Non-critical — workspace will reflect changes on next load regardless
  }
}

const WORKSPACE_MESSAGES: Record<ActionType, (amount?: number, currency?: string) => string> = {
  fund:    (a, c) => `Milestone has been funded${a ? ` (${c ?? "$"}${a.toLocaleString()})` : ""}. Work can now begin.`,
  release: (a, c) => `Funds released${a ? ` (${c ?? "$"}${a.toLocaleString()})` : ""}. Contract is now closed.`,
  refund:  (a, c) => `A refund of ${a ? `${c ?? "$"}${a.toLocaleString()}` : "funds"} has been issued.`,
  dispute: ()     => "A dispute has been raised. The mediation team will review within 24 hours.",
};

/* ── Component ──────────────────────────────────────────────────── */
export default function EscrowTab({
  client,
  projects: initialProjects = [],
  initialEscrows = [],
}: {
  client?: ClientProfile;
  projects?: Project[];
  initialEscrows?: EscrowTransaction[];
}) {
  const safeClient = client ?? undefined;
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [summary, setSummary] = useState<any>(null);
  const [transactions, setTransactions] = useState<EscrowTransaction[]>(initialEscrows);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [query, setQuery] = useState("");
  const [actionModal, setActionModal] = useState<{ type: ActionType | null; tx?: EscrowTransaction | null }>({ type: null });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [s, txs, prjs] = await Promise.all([
        fetchEscrowSummary(currency),
        fetchEscrowTransactions(currency),
        fetchProjects(),
      ]);
      if (!mounted) return;
      setSummary(s);
      setTransactions(txs);
      setProjects(prjs);
    })();
    return () => { mounted = false; };
  }, [currency]);

  const holdsByProject = useMemo(() => {
    const map = new Map<string, number>();
    if (!Array.isArray(transactions)) return map;
    transactions.forEach((t) => {
      if (!t.projectId || t.currency !== currency) return;
      map.set(t.projectId, (map.get(t.projectId) ?? 0) + (t.status === "released" ? 0 : t.amount));
    });
    return map;
  }, [transactions, currency]);

  const filteredTransactions = useMemo(
    () => (Array.isArray(transactions) ? transactions.filter((t) => t.currency === currency) : []),
    [transactions, currency]
  );

  const filtered = useMemo(() => {
    if (!Array.isArray(projects)) return [];
    const q = query.trim().toLowerCase();
    return projects.filter((p) => !q || (p.title ?? "").toLowerCase().includes(q) || (p.id ?? "").toLowerCase().includes(q));
  }, [projects, query]);

  /* ── Confirm handler — real API call + state update + workspace notify ── */
  async function handleConfirm(payload: { notes?: string; approver?: string }) {
    const { type, tx } = actionModal;
    if (!type) return;

    const tid = toast.loading(`Processing ${type}…`);

    try {
      const { newStatus } = await callEscrowAction(type, tx ?? null, payload);

      // Update transaction status locally
      if (tx?.id) {
        setTransactions((prev) =>
          prev.map((t) => t.id === tx.id ? { ...t, status: newStatus as EscrowTransaction["status"], notes: payload.notes ?? t.notes } : t)
        );
      }

      // Notify workspace chat
      const projectId = tx?.projectId ?? tx?.id;
      if (projectId) {
        const msg = WORKSPACE_MESSAGES[type](tx?.amount, tx?.currency);
        await notifyWorkspace(projectId, msg);
      }

      toast.success(
        type === "fund"    ? "Milestone funded — consultant notified." :
        type === "release" ? "Funds released — contract closed." :
        type === "refund"  ? "Refund issued." :
                             "Dispute filed — mediation team alerted.",
        { id: tid }
      );
    } catch (err: any) {
      toast.error(err.message ?? "Action failed. Please try again.", { id: tid });
    } finally {
      setActionModal({ type: null });
    }
  }

  return (
    <div className="space-y-6 rounded-2xl border border-red-700 bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-lg">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <EscrowSummaryCard
          summary={summary}
          currency={currency}
          currencies={CURRENCIES}
          onCurrencyChange={setCurrency}
          onExport={() => {
            if (!safeClient?.isPremium) return;
            console.log("Export requested", currency);
          }}
          isPremium={safeClient?.isPremium ?? false}
        />

        <div className="rounded-lg border border-gray-700 bg-gray-850 p-4 lg:col-span-2">
          <div className="flex gap-3 items-center">
            <input
              aria-label="Search projects"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects or ID…"
              className="flex-1 rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button
              type="button"
              onClick={() => (window.location.href = "/projectEscrow")}
              className="rounded-md bg-red-600 px-3 py-2 text-sm text-white transition hover:bg-red-500"
            >
              View Ongoing Projects
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {filtered.map((p) => (
              <ProjectRow
                key={p.id}
                project={p}
                heldAmount={holdsByProject.get(p.id) ?? 0}
                currency={currency}
                onOpen={() => {}}
                onAction={(type, tx) => setActionModal({ type, tx: tx ?? null })}
              />
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-gray-400">No projects match your search.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TransactionFeed
            transactions={filteredTransactions}
            onAction={(type, tx) => setActionModal({ type, tx })}
          />
        </div>

        <aside className="rounded-lg border border-gray-700 bg-gray-850 p-4">
          <h4 className="mb-3 text-sm font-medium text-gray-300">Quick Actions</h4>
          <div className="space-y-2">
            <button onClick={() => setActionModal({ type: "fund" })}    className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm text-white transition hover:bg-blue-700">Fund Demo</button>
            <button onClick={() => setActionModal({ type: "release" })} className="w-full rounded-md bg-green-600 px-3 py-2 text-sm text-white transition hover:bg-green-700">Release Demo</button>
            <button onClick={() => setActionModal({ type: "refund" })}  className="w-full rounded-md bg-yellow-700 px-3 py-2 text-sm text-white transition hover:bg-yellow-600">Refund Demo</button>
            <button onClick={() => setActionModal({ type: "dispute" })} className="w-full rounded-md bg-red-700 px-3 py-2 text-sm text-white transition hover:bg-red-800">Raise Dispute</button>
            <a
              href="/escrow/export"
              className={`mt-3 block text-xs ${safeClient?.isPremium ? "text-red-400 hover:text-red-300" : "cursor-not-allowed text-gray-500"}`}
            >
              Export (Premium)
            </a>
          </div>
        </aside>
      </div>

      {actionModal.type && (
        <ActionModal
          type={actionModal.type}
          tx={actionModal.tx ?? undefined}
          onClose={() => setActionModal({ type: null })}
          onConfirm={handleConfirm}
          isPremium={safeClient?.isPremium ?? false}
        />
      )}
    </div>
  );
}
