"use client";

import React, { useEffect, useMemo, useState } from "react";
import EscrowSummaryCard from "./summaryCard";
import ProjectRow from "./projectRow";
import TransactionFeed from "./transactionFeed";
import ActionModal from "./actionModal";

import { fetchEscrowSummary, fetchEscrowTransactions, fetchProjects } from "@/lib/escrowService";
import { Project } from "@/types/project";
import type { EscrowTransaction } from "@/types/escrow";
import { ClientProfile } from "@/types/client";

type ActionType = "release" | "refund" | "dispute";

const CURRENCIES = ["USD", "NGN", "EUR"];

export default function EscrowTab({
  client,
  projects: initialProjects = [],
  initialEscrows = []
}: {
  client?: ClientProfile;
  projects?: Project[];
  initialEscrows?: EscrowTransaction[];
}) {
  const safeClient = client ?? undefined;
  const [currency, setCurrency] = useState<string>(CURRENCIES[0]);
  const [summary, setSummary] = useState<any>(null);
  const [transactions, setTransactions] = useState<EscrowTransaction[]>(initialEscrows);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [query, setQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
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
    transactions.forEach((t) => {
      if (!t.projectId) return;
      if (t.currency !== currency) return;
      const prev = map.get(t.projectId) ?? 0;
      const delta = t.status === "released" ? 0 : t.amount;
      map.set(t.projectId, prev + delta);
    });
    return map;
  }, [transactions, currency]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects?.filter((p) => {
      if (!q) return true;
      return (p.title ?? "").toLowerCase().includes(q) || (p.id ?? "").toLowerCase().includes(q);
    });
  }, [projects, query]);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-red-700 shadow-lg space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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

        <div className="lg:col-span-2 bg-gray-850 border border-gray-700 rounded-lg p-4">
          <div className="flex gap-3 items-center">
            <input
              aria-label="Search projects"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects or ID..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button
              type="button"
              onClick={() => (window.location.href = "/projectEscrow")}
              className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white text-sm"
            >
              View Ongoing / Pending Projects
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {filtered.map((p) => (
              <ProjectRow
                key={p.id}
                project={p}
                heldAmount={holdsByProject.get(p.id) ?? 0}
                currency={currency}
                onOpen={() => setSelectedProject(p)}
                onAction={(type: ActionType, tx?: EscrowTransaction | null) => setActionModal({ type, tx: tx ?? null })}
              />
            ))}
            {filtered.length === 0 && <div className="text-gray-400 text-sm">No projects match your search.</div>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TransactionFeed
            transactions={transactions.filter((t) => t.currency === currency)}
            onAction={(type: ActionType, tx: EscrowTransaction) => setActionModal({ type, tx })}
          />
        </div>

        <aside className="bg-gray-850 border border-gray-700 rounded-lg p-4">
          <h4 className="text-sm text-gray-300 font-medium mb-3">Demo Actions & Quick Links</h4>

          <div className="space-y-2">
            <button onClick={() => setActionModal({ type: "release" })} className="w-full px-3 py-2 rounded-md bg-green-600 hover:bg-green-500 text-white text-sm">Release Demo Funds</button>
            <button onClick={() => setActionModal({ type: "refund" })} className="w-full px-3 py-2 rounded-md bg-yellow-700 hover:bg-yellow-600 text-white text-sm">Refund Demo Funds</button>
            <button onClick={() => setActionModal({ type: "dispute" })} className="w-full px-3 py-2 rounded-md bg-red-700 hover:bg-red-600 text-white text-sm">Raise Demo Dispute</button>
            <a href="/escrow/export" className={`block mt-3 text-xs ${safeClient?.isPremium ? "text-red-400" : "text-gray-500"}`}>Export (Premium)</a>
          </div>
        </aside>
      </div>

      {actionModal.type && (
        <ActionModal
          type={actionModal.type}
          tx={actionModal.tx ?? undefined}
          onClose={() => setActionModal({ type: null })}
          onConfirm={(payload: { notes?: string; approver?: string }) => {
            console.log("Action confirmed", actionModal.type, payload);
            setActionModal({ type: null });
          }}
          isPremium={safeClient?.isPremium ?? false}
        />
      )}
    </div>
  );
}
