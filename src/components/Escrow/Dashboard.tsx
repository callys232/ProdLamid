"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import EscrowPanel from "./escrowPanel";
import TransactionHistory from "./transactionHistory";
import LedgerHistory from "./legerHistory";
import EscrowDisputePanel from "./disputePanel";
import ToastStack from "./toastStack";
import { useToast } from "./useToast";
import { toast } from "react-hot-toast";

import type { EscrowTransaction, LedgerEntry, Project, Milestone } from "@/types/project";
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

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [walletTransactions, setWalletTransactions] = useState<any[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const activeProject = useMemo(() =>
    projects.find(p => (p._id || p.id) === selectedProjectId) || (projects.length > 0 ? projects[0] : null)
    , [projects, selectedProjectId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projRes, walletRes] = await Promise.all([
        axios.get("/api/projects"),
        axios.get(`/api/transactions?userId=${currentUserId}`)
      ]);

      setProjects(projRes.data.data || []);
      setWalletTransactions(walletRes.data.data || []);

      // If we have projects, fetch escrow data for the active one
      const targetProj = (projRes.data.data && projRes.data.data.length > 0) ? projRes.data.data[0] : null;
      if (targetProj) {
        setSelectedProjectId(targetProj._id || targetProj.id);
        const [ledgerRes] = await Promise.all([
          axios.get(`/api/ledger?projectId=${targetProj._id || targetProj.id}&userId=${currentUserId}`)
        ]);
        setLedger(ledgerRes.data.data || []);
      }

      // Fetch user's actual profile to get wallet balance
      const meRes = await axios.get("/api/auth/me");
      if (meRes.data.data?.wallet) {
        setBalance(meRes.data.data.wallet.balance);
      }
    } catch (err) {
      console.error("Failed to fetch escrow data:", err);
      toast.error("Failed to load financial data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUserId]);

  const handleProjectChange = async (projId: string) => {
    setSelectedProjectId(projId);
    try {
      setActionLoading(true);
      const ledgerRes = await axios.get(`/api/ledger?projectId=${projId}&userId=${currentUserId}`);
      setLedger(ledgerRes.data.data || []);
    } catch (err) {
      toast.error("Failed to load project ledger");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 font-medium">Loading your financial dashboard...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-[#1a0d0d] border border-gray-800 rounded-xl p-12 text-center space-y-4">
        <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto text-3xl">🗂️</div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white">No active projects found</h3>
          <p className="text-gray-400 max-w-sm mx-auto">You don't have any projects with active escrow accounts yet.</p>
        </div>
      </div>
    );
  }

  // Role detection
  const isClient = activeProject?.ownerId === currentUserId;
  const isFreelancer = activeProject?.teamId === currentUserId ||
    (typeof activeProject?.teamId === "object" && (activeProject.teamId as any)?._id === currentUserId);
  const isAdmin = activeProject?.adminIds?.includes(currentUserId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* HEADER & SELECTOR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#1a0d0d] border border-gray-800 p-6 rounded-xl">
        <div>
          <h2 className="text-2xl font-bold text-white">Financial Dashboard</h2>
          <p className="text-gray-400 text-sm">Manage your wallet and project-specific escrows</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Active Project:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => handleProjectChange(e.target.value)}
            className="w-full md:w-64 bg-gray-900 text-white border border-gray-800 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-red-600 transition"
          >
            {projects.map(p => (
              <option key={p._id || p.id} value={p._id || p.id}>{p.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: ESCROW ACTIONS */}
        <div className="lg:col-span-2 space-y-8">
          <EscrowPanel
            balance={balance}
            fundedTotal={activeProject?.milestones?.filter((m: Milestone) => m.status === 'funded').reduce((acc: number, m: Milestone) => acc + (m.amount || 0), 0)}
            releasedTotal={activeProject?.milestones?.filter((m: Milestone) => m.status === 'released' || m.status === 'completed').reduce((acc: number, m: Milestone) => acc + (m.amount || 0), 0)}
            onFund={isClient ? () => push({ message: "Funding flow would start here", variant: "info" }) : undefined}
            onRelease={isAdmin ? () => push({ message: "Admin release flow would start here", variant: "info" }) : undefined}
            onRefund={isClient ? () => push({ message: "Refund flow would start here", variant: "info" }) : undefined}
          />

          <LedgerHistory entries={ledger} />
        </div>

        {/* RIGHT COLUMN: WALLET & STATUS */}
        <div className="space-y-8">
          <div className="bg-[#1a0d0d] border border-gray-800 rounded-xl p-6 space-y-6">
            <h3 className="font-semibold text-lg text-white">Wallet Info</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-900 rounded-lg border border-gray-800">
                <span className="text-gray-400">Available Balance</span>
                <span className="text-xl font-bold text-white">USD {balance.toLocaleString()}</span>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Role</p>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${isClient ? 'bg-blue-500' : isFreelancer ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-white capitalize font-medium">{isClient ? 'Client' : isFreelancer ? 'Freelancer' : isAdmin ? 'Admin' : 'Participant'}</span>
                </div>
              </div>

              {isFreelancer && (
                <button
                  className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition"
                  onClick={() => push({ message: "Request for release sent to client", variant: "success" })}
                >
                  Request Release
                </button>
              )}
            </div>
          </div>

          <TransactionHistory transactions={walletTransactions} />
        </div>
      </div>

      <ToastStack toasts={toasts} onDismiss={remove} />
    </motion.div>
  );
}
