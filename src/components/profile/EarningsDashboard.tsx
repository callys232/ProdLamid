"use client";

import { useEffect, useState, useCallback } from "react";

interface Props {
  userId: string;
}

interface Transaction {
  _id?: string;
  type: "credit" | "debit";
  amount: number;
  description?: string;
  reference: string;
  status?: "pending" | "failed" | "success";
  date?: string;
  createdAt?: string;
}

interface WalletData {
  balance: number;
  transactions: Transaction[];
  beneficiary?: { name: string; accountNumber: string; bank: string; accountType: string }[];
}

interface Project {
  _id?: string;
  id?: string;
  title: string;
  status: string;
  ownerId?: string;
  consultants?: string[];
  budget?: number;
  createdAt?: string;
  updatedAt?: string;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function fmt(n: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);
}

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function getLast6MonthKeys() {
  const now = new Date();
  const keys: { key: string; label: string }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push({ key: getMonthKey(d), label: MONTHS[d.getMonth()] });
  }
  return keys;
}

export default function EarningsDashboard({ userId }: Props) {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Withdrawal state
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawMsg, setWithdrawMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [showCustom, setShowCustom] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [walletRes, projectsRes] = await Promise.all([
        fetch("/api/wallet/transactions?limit=50"),
        fetch("/api/projects?role=consultant"),
      ]);
      const walletJson = await walletRes.json();
      const projJson = await projectsRes.json();

      if (walletJson.success) {
        setWallet({ balance: walletJson.balance ?? 0, transactions: walletJson.data ?? [], beneficiary: [] });
      }
      if (projJson.success) {
        setProjects(projJson.data ?? []);
      }
    } catch (e: any) {
      setError("Failed to load earnings data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ---- Computed values ----
  const txns: Transaction[] = wallet?.transactions ?? [];
  const credits = txns.filter((t) => t.type === "credit" && t.status === "success");
  const totalEarned = credits.reduce((s, t) => s + t.amount, 0);

  const now = new Date();
  const thisMonthKey = getMonthKey(now);
  const thisMonth = credits
    .filter((t) => getMonthKey(new Date(t.date ?? t.createdAt ?? 0)) === thisMonthKey)
    .reduce((s, t) => s + t.amount, 0);

  const pending = txns
    .filter((t) => t.type === "credit" && t.status === "pending")
    .reduce((s, t) => s + t.amount, 0);

  const available = wallet?.balance ?? 0;

  // Bar chart — last 6 months
  const last6 = getLast6MonthKeys();
  const monthlyTotals = last6.map(({ key, label }) => {
    const total = credits
      .filter((t) => getMonthKey(new Date(t.date ?? t.createdAt ?? 0)) === key)
      .reduce((s, t) => s + t.amount, 0);
    return { label, total };
  });
  const maxBar = Math.max(...monthlyTotals.map((m) => m.total), 1);

  // Withdrawal handler
  async function handleWithdraw(amount: number) {
    if (!amount || amount <= 0) { setWithdrawMsg({ type: "err", text: "Enter a valid amount." }); return; }
    if (amount > available) { setWithdrawMsg({ type: "err", text: "Amount exceeds available balance." }); return; }
    setWithdrawing(true);
    setWithdrawMsg(null);
    try {
      const beneficiary = wallet?.beneficiary?.[0];
      const res = await fetch("/api/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          name: beneficiary?.name ?? "Account Holder",
          account_number: beneficiary?.accountNumber ?? "",
          bank_code: beneficiary?.bank ?? "",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setWithdrawMsg({ type: "ok", text: "Withdrawal initiated successfully." });
        fetchData();
        setWithdrawAmount("");
        setShowCustom(false);
      } else {
        setWithdrawMsg({ type: "err", text: json.message ?? "Withdrawal failed." });
      }
    } catch {
      setWithdrawMsg({ type: "err", text: "Network error. Please try again." });
    } finally {
      setWithdrawing(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-800 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-900/30 border border-red-700 rounded-2xl p-6 text-red-400">{error}</div>
      </div>
    );
  }

  const last20 = [...txns].slice(0, 20);
  const beneficiary = wallet?.beneficiary?.[0];

  return (
    <div className="space-y-6 p-1">
      {/* ── A. KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Earned", value: fmt(totalEarned), color: "text-emerald-400" },
          { label: "This Month", value: fmt(thisMonth), color: "text-emerald-400" },
          { label: "Pending Escrow", value: fmt(pending), color: "text-amber-400" },
          { label: "Available to Withdraw", value: fmt(available), color: "text-white" },
        ].map((card) => (
          <div key={card.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <p className="text-xs text-gray-400 mb-1">{card.label}</p>
            <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* ── B. Earnings Chart ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">Monthly Earnings (last 6 months)</h2>
        <div className="flex items-end gap-3 h-40">
          {monthlyTotals.map(({ label, total }) => {
            const heightPct = Math.round((total / maxBar) * 100);
            return (
              <div key={label} className="flex flex-col items-center flex-1 gap-1 group relative">
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap z-10">
                  {fmt(total)}
                </div>
                <div
                  className="w-full bg-[#C12129] rounded-t-md transition-all"
                  style={{ height: heightPct > 0 ? `${heightPct}%` : "4px", minHeight: "4px" }}
                />
                <span className="text-xs text-gray-400">{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── C. Top Projects by Earnings ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">Projects</h2>
        {projects.length === 0 ? (
          <p className="text-gray-500 text-sm">No projects found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b border-gray-800">
                  <th className="text-left pb-2 font-medium">Project</th>
                  <th className="text-left pb-2 font-medium">Status</th>
                  <th className="text-right pb-2 font-medium">Budget</th>
                </tr>
              </thead>
              <tbody>
                {projects.slice(0, 10).map((p) => (
                  <tr key={p._id ?? p.id} className="border-b border-gray-800/50 last:border-0">
                    <td className="py-3 text-white font-medium">{p.title}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        p.status === "completed" ? "bg-emerald-900/40 text-emerald-400" :
                        p.status === "open" ? "bg-amber-900/40 text-amber-400" :
                        "bg-gray-800 text-gray-400"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 text-right text-emerald-400 font-semibold">
                      {p.budget ? fmt(p.budget) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── D. Transaction Feed ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">Recent Transactions</h2>
        {last20.length === 0 ? (
          <p className="text-gray-500 text-sm">No transactions yet.</p>
        ) : (
          <div className="space-y-2">
            {last20.map((txn, i) => {
              const isCredit = txn.type === "credit";
              const isPending = txn.status === "pending";
              const isDebit = txn.type === "debit";
              const icon = isPending ? "⏳" : isDebit ? "⬆️" : "💰";
              const amountColor = isDebit ? "text-red-400" : isPending ? "text-amber-400" : "text-emerald-400";
              const sign = isDebit ? "-" : "+";
              const date = new Date(txn.date ?? txn.createdAt ?? Date.now());
              return (
                <div key={txn.reference ?? i} className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{icon}</span>
                    <div>
                      <p className="text-sm text-white">{txn.description ?? (isDebit ? "Withdrawal" : "Payment received")}</p>
                      <p className="text-xs text-gray-500">{date.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${amountColor}`}>{sign}{fmt(txn.amount)}</p>
                    {txn.status && (
                      <p className="text-xs text-gray-500 capitalize">{txn.status}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── E. Withdrawal Section ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">Withdrawal</h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Available Balance</p>
            <p className="text-2xl font-bold text-white">{fmt(available)}</p>
          </div>
          {beneficiary && (
            <div className="bg-gray-800 rounded-xl px-4 py-2 text-sm">
              <p className="text-gray-400 text-xs mb-0.5">Bank on file</p>
              <p className="text-white font-medium">{beneficiary.bank}</p>
              <p className="text-gray-400 text-xs">
                {"•".repeat(Math.max(0, (beneficiary.accountNumber?.length ?? 0) - 4))}
                {beneficiary.accountNumber?.slice(-4) ?? "****"}
              </p>
            </div>
          )}
        </div>

        {withdrawMsg && (
          <div className={`mb-4 px-4 py-2 rounded-xl text-sm font-medium ${
            withdrawMsg.type === "ok" ? "bg-emerald-900/30 text-emerald-400 border border-emerald-800" : "bg-red-900/30 text-red-400 border border-red-800"
          }`}>
            {withdrawMsg.text}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={withdrawing || available <= 0}
            onClick={() => handleWithdraw(available)}
            className="rounded-xl px-4 py-2 text-sm font-semibold bg-[#C12129] text-white hover:bg-red-700 disabled:opacity-50 transition"
          >
            {withdrawing ? "Processing…" : "Withdraw All"}
          </button>
          <button
            type="button"
            onClick={() => setShowCustom((v) => !v)}
            className="rounded-xl px-4 py-2 text-sm font-semibold border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white transition"
          >
            Custom Amount
          </button>
        </div>

        {showCustom && (
          <div className="mt-4 flex gap-3 items-center">
            <input
              type="number"
              min={1}
              max={available}
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C12129]"
            />
            <button
              type="button"
              disabled={withdrawing}
              onClick={() => handleWithdraw(Number(withdrawAmount))}
              className="rounded-xl px-4 py-2 text-sm font-semibold bg-[#C12129] text-white hover:bg-red-700 disabled:opacity-50 transition"
            >
              {withdrawing ? "…" : "Withdraw"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
