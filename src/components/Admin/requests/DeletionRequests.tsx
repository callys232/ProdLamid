"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, CheckCircle2, XCircle, Loader2, Clock, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

interface DeletionRequest {
  _id: string;
  name: string;
  email: string;
  username: string;
  deletionRequest: {
    reason: string;
    requestedAt: string;
    status: "pending" | "approved" | "rejected";
  };
}

const STATUS_CONFIG = {
  pending:  { color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30", icon: Clock },
  approved: { color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", icon: CheckCircle2 },
  rejected: { color: "text-red-400 bg-red-500/10 border-red-500/30", icon: XCircle },
};

export default function DeletionRequests() {
  const [requests, setRequests] = useState<DeletionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const fetch_ = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/deletion-requests");
      const data = await res.json();
      setRequests(data.requests ?? []);
    } catch {
      toast.error("Failed to load deletion requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch_(); }, []);

  const act = async (userId: string, action: "approve" | "reject") => {
    setActing(userId);
    try {
      const res = await fetch("/api/admin/deletion-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(action === "approve" ? "Account deleted." : "Request rejected.");
      fetch_();
    } catch (e: any) {
      toast.error(e.message || "Action failed.");
    } finally {
      setActing(null);
    }
  };

  const pending = requests.filter(r => r.deletionRequest?.status === "pending");
  const resolved = requests.filter(r => r.deletionRequest?.status !== "pending");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Trash2 className="h-5 w-5 text-red-400" />
        <h2 className="text-lg font-bold text-white">Account Deletion Requests</h2>
        {pending.length > 0 && (
          <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
            {pending.length} pending
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 text-sm"><Loader2 className="h-4 w-4 animate-spin" />Loading…</div>
      ) : requests.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-sm text-gray-500">
          No deletion requests yet.
        </div>
      ) : (
        <>
          {/* Pending */}
          {pending.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Pending Review</p>
              {pending.map((r, i) => (
                <motion.div key={r._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{r.name || r.username}</p>
                      <p className="text-xs text-gray-400">{r.email}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Requested: {new Date(r.deletionRequest.requestedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border text-yellow-400 bg-yellow-500/10 border-yellow-500/30">
                      <Clock className="h-3 w-3" />Pending
                    </span>
                  </div>

                  <div className="rounded-lg bg-black/30 border border-white/10 px-4 py-3 mb-4">
                    <p className="text-xs text-gray-400 mb-1">Reason</p>
                    <p className="text-sm text-gray-200">{r.deletionRequest.reason}</p>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => act(r._id, "approve")} disabled={acting === r._id}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-semibold transition disabled:opacity-50">
                      {acting === r._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      Delete Account
                    </button>
                    <button onClick={() => act(r._id, "reject")} disabled={acting === r._id}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/15 text-gray-300 hover:bg-white/10 text-xs font-semibold transition disabled:opacity-50">
                      <XCircle className="h-3.5 w-3.5" />Reject Request
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Resolved */}
          {resolved.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Resolved</p>
              {resolved.map((r) => {
                const cfg = STATUS_CONFIG[r.deletionRequest?.status] ?? STATUS_CONFIG.pending;
                const Icon = cfg.icon;
                return (
                  <div key={r._id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <div>
                      <p className="text-sm text-white">{r.name || r.username}</p>
                      <p className="text-xs text-gray-500">{r.email}</p>
                    </div>
                    <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border capitalize ${cfg.color}`}>
                      <Icon className="h-3 w-3" />{r.deletionRequest?.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
