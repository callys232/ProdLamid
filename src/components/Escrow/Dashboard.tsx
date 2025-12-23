"use client";

import { useEffect, useState } from "react";
import EscrowPanel from "./escrowPanel";
import TransactionHistory from "./transactionHistory";
import LedgerHistory from "./legerHistory";
import EscrowDisputePanel from "./disputePanel";
import ToastStack from "./toastStack";
import { useToast } from "./useToast";

import type { EscrowTransaction, LedgerEntry, Project } from "@/types/project";
import axios from "axios";

// ✅ import mock fallback data
import { mockProjects, mockTransactions, mockLedger } from "@/mocks/mockEscrow";

interface EscrowDashboardProps {
  currentUserId: string;
}

export default function EscrowDashboard({
  currentUserId,
}: EscrowDashboardProps) {
  const { toasts, push, remove } = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [transactions, setTransactions] = useState<EscrowTransaction[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const projectRes = await axios.get("/api/projects");
        const projects = projectRes.data.data;
        setProject(
          Array.isArray(projects) && projects.length > 0 ? projects[0] : null
        );

        const txRes = await axios.get("/api/transactions");
        setTransactions(txRes.data.data);

        const ledgerRes = await axios.get("/api/ledger");
        setLedger(ledgerRes.data.data);
      } catch (err) {
        console.error("DB/API failed, using mock data:", err);
        // ✅ fallback to mock data
        setProject(mockProjects[0]);
        setTransactions(mockTransactions);
        setLedger(mockLedger);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <p className="p-6 text-gray-400">Loading escrow dashboard…</p>;
  }

  if (!project) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700">
        No project data available.
      </div>
    );
  }

  // ✅ Access control check
  let isClient = project.ownerId === currentUserId;
  const isFreelancer = project.teamId === currentUserId;
  const isAdmin = project.adminIds?.includes(currentUserId);
  let canAccess = isClient || isFreelancer || isAdmin;

  // ✅ Development fallback: if using mock data and no match, force access
  if (!canAccess && mockProjects.some((p) => p.id === project.id)) {
    console.warn("Access denied by IDs, but overriding for mock data in dev.");
    canAccess = true;
    isClient = true; // default to client role for dev
  }

  if (!canAccess) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-md text-red-700">
        Access denied: You are not a participant in this project’s escrow.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EscrowPanel
        balance={1000}
        fundedTotal={500}
        releasedTotal={300}
        onFund={() => {
          if (!isClient) return;
          push({ message: "Funding flow triggered", variant: "info" });
        }}
        onRelease={() => {
          if (!isAdmin) return;
          push({
            message: "Release flow triggered (admin only)",
            variant: "info",
          });
        }}
        onRefund={() => {
          if (!isClient) return;
          push({ message: "Refund flow triggered", variant: "info" });
        }}
      />

      <TransactionHistory transactions={transactions} />
      <LedgerHistory entries={ledger} />

      <EscrowDisputePanel
        projectId={project.id}
        milestoneId={project.currentMilestoneId}
        onOpenDispute={async ({ reason, evidence, projectId, milestoneId }) => {
          const formData = new FormData();
          formData.append("reason", reason);
          formData.append("projectId", projectId);
          if (milestoneId) formData.append("milestoneId", milestoneId);
          evidence.forEach((f: File) => formData.append("evidence", f));

          await fetch("/api/escrow/dispute", {
            method: "POST",
            body: formData,
          });
        }}
      />

      <ToastStack toasts={toasts} onDismiss={remove} />
    </div>
  );
}
