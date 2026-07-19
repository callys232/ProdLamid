"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldX, ExternalLink, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import Pagination from "@/components/ui/Pagination";

interface KycUser {
  _id:          string;
  username:     string;
  email:        string;
  kycStatus:    string;
  kycDocuments: string[];
  createdAt:    string;
}

const STATUS_STYLE: Record<string, string> = {
  pending:  "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  approved: "border-green-500/30 bg-green-500/10 text-green-400",
  rejected: "border-blue-500/30 bg-blue-500/10 text-blue-400",
};

export default function KycQueue() {
  const [users,    setUsers]    = useState<KycUser[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("pending");
  const [page,     setPage]     = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 20 });
  const [acting,   setActing]   = useState<string | null>(null);

  async function fetchQueue() {
    setLoading(true);
    try {
      const res  = await fetch(`/api/admin/kyc?status=${filter}&page=${page}`);
      const data = await res.json();
      setUsers(data.data ?? []);
      setPagination(data.pagination ?? { total: 0, pages: 1, limit: 20 });
    } catch { toast.error("Failed to load KYC queue"); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchQueue(); }, [filter, page]);

  async function handleDecision(userId: string, status: "approved" | "rejected") {
    setActing(userId);
    try {
      const res = await fetch("/api/admin/kyc", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ userId, status }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`KYC ${status}`);
      setUsers(p => p.filter(u => u._id !== userId));
    } catch { toast.error("Action failed"); }
    finally { setActing(null); }
  }

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white">KYC Review Queue</h2>
        <div className="flex gap-2">
          {(["pending","approved","rejected"] as const).map(s => (
            <motion.button key={s} whileTap={{ scale: 0.95 }}
              onClick={() => { setFilter(s); setPage(1); }}
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition ${
                filter === s ? "bg-[#2563EB] text-white" : "border border-white/10 text-gray-400 hover:text-white"
              }`}>
              {s}
            </motion.button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-16 animate-pulse rounded-xl bg-white/5" />)}
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 py-14 text-center">
          <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-gray-600" />
          <p className="text-sm text-gray-500">No {filter} KYC submissions</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <AnimatePresence>
            {users.map((u, i) => (
              <motion.div key={u._id}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.04 }}
                className="flex flex-col gap-3 border-b border-white/5 px-5 py-4 last:border-0 sm:flex-row sm:items-center"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white">{u.username}</p>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${STATUS_STYLE[u.kycStatus]}`}>
                      {u.kycStatus}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{u.email} · {new Date(u.createdAt).toLocaleDateString()}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {u.kycDocuments.map((url, idx) => (
                      <a key={idx} href={url} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 rounded border border-white/10 px-2 py-0.5 text-[11px] text-gray-400 hover:text-white transition">
                        <ExternalLink className="h-3 w-3" /> Doc {idx + 1}
                      </a>
                    ))}
                  </div>
                </div>

                {u.kycStatus === "pending" && (
                  <div className="flex gap-2 flex-shrink-0">
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      disabled={acting === u._id}
                      onClick={() => handleDecision(u._id, "approved")}
                      className="flex items-center gap-1.5 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-xs font-semibold text-green-400 hover:bg-green-500/20 disabled:opacity-50">
                      {acting === u._id ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                      Approve
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      disabled={acting === u._id}
                      onClick={() => handleDecision(u._id, "rejected")}
                      className="flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-400 hover:bg-blue-500/20 disabled:opacity-50">
                      <ShieldX className="h-3.5 w-3.5" /> Reject
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Pagination
        page={page} pages={pagination.pages}
        total={pagination.total} limit={pagination.limit}
        onChange={setPage}
      />
    </div>
  );
}
