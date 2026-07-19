"use client";

import { useEffect, useState, useCallback } from "react";

/* ─────────────────────────── Types ─────────────────────────── */

interface Transaction {
  _id?: string;
  type: "credit" | "debit";
  amount: number;
  description?: string;
  reference: string;
  status?: "pending" | "failed" | "success";
  date?: string;
}

interface WalletData {
  _id: string;
  user: string;
  balance: number;
  transactions?: Transaction[];
  beneficiary?: {
    name: string;
    accountNumber: string;
    bank: string;
    accountType: string;
  }[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface Props {
  userId: string;
  role: "client" | "seller";
}

/* ─────────────────────────── Helpers ─────────────────────────── */

const NGN = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
});

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const USD_RATE = 1600; // approximate NGN → USD rate

function formatAmount(amount: number, currency: "NGN" | "USD"): string {
  if (currency === "USD") return USD.format(amount / USD_RATE);
  return NGN.format(amount);
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

/* ─────────────────────────── Status Badge ─────────────────────────── */

function StatusBadge({ status }: { status?: string }) {
  const map: Record<string, string> = {
    pending:   "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
    success:   "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    failed:    "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  };
  const cls = map[status ?? ""] ?? "bg-gray-700 text-gray-400";
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${cls}`}>
      {status ?? "unknown"}
    </span>
  );
}

/* ─────────────────────────── Transaction Icon ─────────────────────────── */

function TxIcon({ type }: { type: "credit" | "debit" }) {
  if (type === "credit") {
    return (
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15">
        <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </span>
    );
  }
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/15">
      <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </span>
  );
}

/* ─────────────────────────── Top-Up Modal ─────────────────────────── */

function TopUpModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num < 100) {
      setError("Minimum top-up is ₦100");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/wallet/topup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: num }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      // Redirect to Paystack checkout
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.message ?? "Top-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Top Up Wallet</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Amount (₦)</label>
            <input
              type="number"
              min="100"
              step="50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-sm"
              required
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-gray-900 border border-gray-700 rounded-xl">
            <svg className="h-4 w-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className="text-xs text-gray-400">Payment is processed securely via <span className="text-white font-medium">Paystack</span>.</p>
          </div>

          {error && <p className="text-sm text-blue-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-600 px-4 py-2.5 text-sm font-semibold text-gray-300 hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#a81c22] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing…" : "Proceed to Pay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────── Withdraw Modal ─────────────────────────── */

interface WithdrawModalProps {
  wallet: WalletData;
  currency: "NGN" | "USD";
  onClose: () => void;
  onSuccess: () => void;
}

function WithdrawModal({ wallet, currency, onClose, onSuccess }: WithdrawModalProps) {
  const firstBeneficiary = wallet.beneficiary?.[0];

  const [amount, setAmount] = useState("");
  const [name, setName] = useState(firstBeneficiary?.name ?? "");
  const [accountNumber, setAccountNumber] = useState(firstBeneficiary?.accountNumber ?? "");
  const [bankCode, setBankCode] = useState(firstBeneficiary?.bank ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const maxWithdraw = wallet.balance;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num <= 0) { setError("Enter a valid amount."); return; }
    if (num > maxWithdraw) { setError(`Insufficient balance. Available: ${formatAmount(maxWithdraw, currency)}`); return; }
    if (!name || !accountNumber || !bankCode) { setError("Please fill in all bank details."); return; }
    setError(null);
    setConfirming(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/wallet/withdraw", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount), name, account_number: accountNumber, bank_code: bankCode }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message ?? "Withdrawal failed. Please try again.");
      setConfirming(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Withdraw Funds</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!confirming ? (
          <form onSubmit={handleConfirm} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Amount (₦)</label>
              <input
                type="number"
                min="1"
                max={maxWithdraw}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Max: ${formatAmount(maxWithdraw, "NGN")}`}
                className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Account Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="10-digit account number"
                maxLength={10}
                className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Bank Code</label>
              <input
                type="text"
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
                placeholder="e.g. 044 (Access Bank)"
                className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-sm"
                required
              />
            </div>

            {error && <p className="text-sm text-blue-400">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-600 px-4 py-2.5 text-sm font-semibold text-gray-300 hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#a81c22] transition"
              >
                Review
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">Please confirm your withdrawal details before submitting.</p>

            <div className="space-y-2 p-4 bg-gray-900 border border-gray-700 rounded-xl text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Amount</span>
                <span className="text-white font-semibold">{formatAmount(Number(amount), "NGN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Account Name</span>
                <span className="text-white">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Account Number</span>
                <span className="text-white">{accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Bank Code</span>
                <span className="text-white">{bankCode}</span>
              </div>
            </div>

            {error && <p className="text-sm text-blue-400">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="flex-1 rounded-xl border border-gray-600 px-4 py-2.5 text-sm font-semibold text-gray-300 hover:bg-gray-700 transition"
              >
                Back
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className="flex-1 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#a81c22] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing…" : "Confirm Withdrawal"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── Main WalletPanel ─────────────────────────── */

export default function WalletPanel({ userId, role }: Props) {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [loadingTx, setLoadingTx] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<"NGN" | "USD">("NGN");
  const [showTopUp, setShowTopUp] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  /* ── Fetch wallet balance ── */
  const fetchWallet = useCallback(async () => {
    try {
      setLoadingWallet(true);
      setWalletError(null);
      const res = await fetch("/api/wallet", { credentials: "include" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setWallet(data.data);
    } catch (err: any) {
      setWalletError(err.message ?? "Failed to load wallet.");
    } finally {
      setLoadingWallet(false);
    }
  }, []);

  /* ── Fetch transactions ── */
  const fetchTransactions = useCallback(async (pg: number) => {
    try {
      setLoadingTx(true);
      setTxError(null);
      const res = await fetch(`/api/wallet/transactions?page=${pg}&limit=10`, { credentials: "include" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      if (pg === 1) {
        setTransactions(data.data);
      } else {
        setTransactions((prev) => [...prev, ...data.data]);
      }
      setPagination(data.pagination);
    } catch (err: any) {
      setTxError(err.message ?? "Failed to load transactions.");
    } finally {
      setLoadingTx(false);
    }
  }, []);

  useEffect(() => {
    fetchWallet();
    fetchTransactions(1);
  }, [fetchWallet, fetchTransactions]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTransactions(nextPage);
  };

  const handleActionSuccess = () => {
    fetchWallet();
    setPage(1);
    fetchTransactions(1);
  };

  /* ── Loading skeleton ── */
  if (loadingWallet) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-36 bg-gray-800 rounded-2xl" />
        <div className="flex gap-3">
          <div className="h-10 flex-1 bg-gray-800 rounded-xl" />
          <div className="h-10 flex-1 bg-gray-800 rounded-xl" />
          <div className="h-10 flex-1 bg-gray-800 rounded-xl" />
        </div>
        <div className="h-64 bg-gray-800 rounded-2xl" />
      </div>
    );
  }

  /* ── Wallet error state ── */
  if (walletError) {
    return (
      <div className="p-6">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center">
          <div className="flex h-14 w-14 mx-auto mb-4 items-center justify-center rounded-full bg-blue-500/10">
            <svg className="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-white font-semibold mb-1">Unable to Load Wallet</h3>
          <p className="text-sm text-gray-400 mb-4">{walletError}</p>
          <button
            onClick={fetchWallet}
            className="bg-[#2563EB] text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-[#a81c22] transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* ── No wallet yet (shouldn't happen since API auto-creates, but just in case) ── */
  if (!wallet) {
    return (
      <div className="p-6">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center">
          <div className="flex h-14 w-14 mx-auto mb-4 items-center justify-center rounded-full bg-[#2563EB]/10">
            <svg className="h-7 w-7 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18-3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6m18 0V6m0 0V5.25A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25V6" />
            </svg>
          </div>
          <h3 className="text-white font-semibold mb-1">Set Up Your Wallet</h3>
          <p className="text-sm text-gray-400 mb-4">
            Your LAMID wallet lets you receive payments, pay for services, and manage your funds — all in one place.
          </p>
          <button
            onClick={fetchWallet}
            className="bg-[#2563EB] text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-[#a81c22] transition"
          >
            Activate Wallet
          </button>
        </div>
      </div>
    );
  }

  const hasMore = pagination ? pagination.page < pagination.pages : false;

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-900 min-h-full">

      {/* ── Balance Card ── */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Available Balance</p>
            <p className="text-4xl font-bold text-white tracking-tight">
              {formatAmount(wallet.balance, currency)}
            </p>
          </div>

          {/* Currency toggle */}
          <div className="flex items-center gap-1 bg-gray-900 border border-gray-700 rounded-xl p-1">
            {(["NGN", "USD"] as const).map((cur) => (
              <button
                key={cur}
                onClick={() => setCurrency(cur)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  currency === cur
                    ? "bg-[#2563EB] text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {cur}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-balances row */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Pending</p>
            <p className="text-sm font-semibold text-yellow-400">
              {formatAmount(
                (wallet.transactions ?? [])
                  .filter((t) => t.status === "pending" && t.type === "credit")
                  .reduce((sum, t) => sum + t.amount, 0),
                currency
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Total Credited</p>
            <p className="text-sm font-semibold text-emerald-400">
              {formatAmount(
                (wallet.transactions ?? [])
                  .filter((t) => t.type === "credit" && t.status === "success")
                  .reduce((sum, t) => sum + t.amount, 0),
                currency
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setShowTopUp(true)}
          className="flex flex-col items-center gap-2 bg-gray-800 border border-gray-700 hover:border-[#2563EB]/50 rounded-2xl p-4 transition group"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB]/15 group-hover:bg-[#2563EB]/25 transition">
            <svg className="h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </span>
          <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition">Top Up</span>
        </button>

        <button
          onClick={() => setShowWithdraw(true)}
          disabled={wallet.balance <= 0}
          className="flex flex-col items-center gap-2 bg-gray-800 border border-gray-700 hover:border-emerald-500/40 rounded-2xl p-4 transition group disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 group-hover:bg-emerald-500/25 transition">
            <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </span>
          <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition">Withdraw</span>
        </button>

        {/* Send — grayed out (not yet available) */}
        <div className="flex flex-col items-center gap-2 bg-gray-800 border border-gray-700 rounded-2xl p-4 opacity-40 cursor-not-allowed">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/15">
            <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </span>
          <span className="text-xs font-semibold text-gray-400">Send</span>
        </div>
      </div>

      {/* ── Transaction History ── */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-white">Transaction History</h3>
          {pagination && (
            <span className="text-xs text-gray-500">{pagination.total} total</span>
          )}
        </div>

        {/* Error */}
        {txError && (
          <div className="text-center py-6">
            <p className="text-sm text-blue-400 mb-3">{txError}</p>
            <button
              onClick={() => fetchTransactions(1)}
              className="text-xs text-gray-400 hover:text-white underline transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!txError && transactions.length === 0 && !loadingTx && (
          <div className="text-center py-10">
            <div className="flex h-12 w-12 mx-auto mb-3 items-center justify-center rounded-full bg-gray-700">
              <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm text-gray-400">No transactions yet.</p>
            <p className="text-xs text-gray-500 mt-1">Top up your wallet to get started.</p>
          </div>
        )}

        {/* Transaction list */}
        {!txError && transactions.length > 0 && (
          <ul className="divide-y divide-gray-700/60 -mx-2">
            {transactions.map((tx, i) => (
              <li key={tx._id ?? tx.reference ?? i} className="flex items-center gap-4 px-2 py-3">
                <TxIcon type={tx.type} />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {tx.description || (tx.type === "credit" ? "Credit" : "Debit")}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{formatDate(tx.date)}</p>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-sm font-bold ${tx.type === "credit" ? "text-emerald-400" : "text-blue-400"}`}>
                    {tx.type === "credit" ? "+" : "−"}{formatAmount(tx.amount, currency)}
                  </span>
                  <StatusBadge status={tx.status} />
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Load more */}
        {!txError && hasMore && (
          <div className="mt-5 text-center">
            <button
              onClick={handleLoadMore}
              disabled={loadingTx}
              className="rounded-xl border border-gray-600 px-5 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-700 hover:text-white transition disabled:opacity-50"
            >
              {loadingTx ? "Loading…" : "Load More"}
            </button>
          </div>
        )}

        {/* Loading more spinner (below existing items) */}
        {loadingTx && transactions.length > 0 && (
          <div className="flex justify-center mt-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#2563EB] border-t-transparent" />
          </div>
        )}
      </div>

      {/* ── Beneficiaries (if any) ── */}
      {wallet.beneficiary && wallet.beneficiary.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white mb-4">Saved Bank Accounts</h3>
          <ul className="space-y-3">
            {wallet.beneficiary.map((b, i) => (
              <li key={i} className="flex items-center gap-3 p-3 bg-gray-900 border border-gray-700 rounded-xl">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 shrink-0">
                  <svg className="h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                  </svg>
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{b.name}</p>
                  <p className="text-xs text-gray-400">{b.bank} — {b.accountNumber}</p>
                </div>
                <span className="text-xs text-gray-500">{b.accountType}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Modals ── */}
      {showTopUp && (
        <TopUpModal
          onClose={() => setShowTopUp(false)}
          onSuccess={handleActionSuccess}
        />
      )}

      {showWithdraw && (
        <WithdrawModal
          wallet={wallet}
          currency={currency}
          onClose={() => setShowWithdraw(false)}
          onSuccess={handleActionSuccess}
        />
      )}
    </div>
  );
}
