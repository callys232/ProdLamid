"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, CheckCircle2, XCircle, Loader2, Clock, Building2 } from "lucide-react";
import toast from "react-hot-toast";

interface ConciergeRequest {
  _id: string;
  name: string;
  email: string;
  username: string;
  conciergeRequest: {
    organisation: string;
    orgType: string;
    description: string;
    submittedAt: string;
    status: "pending" | "approved" | "rejected";
    notes?: string;
  };
}

export default function ConciergeRequests() {
  const [requests, setRequests] = useState<ConciergeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const fetch_ = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/concierge/request");
      const data = await res.json();
      setRequests(data.requests ?? []);
    } catch {
      toast.error("Failed to load concierge requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch_(); }, []);

  const act = async (userId: string, action: "approve" | "reject") => {
    setActing(userId);
    try {
      const res = await fetch("/api/concierge/request", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action, notes: notes[userId] ?? "" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(action === "approve" ? "Concierge access granted." : "Request rejected.");
      fetch_();
    } catch (e: any) {
      toast.error(e.message || "Action failed.");
    } finally {
      setActing(null);
    }
  };

  const pending  = requests.filter(r => r.conciergeRequest?.status === "pending");
  const resolved = requests.filter(r => r.conciergeRequest?.status !== "pending");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Star className="h-5 w-5 text-yellow-400" />
        <h2 className="text-lg font-bold text-white">Concierge Tier Requests</h2>
        {pending.length > 0 && (
          <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            {pending.length} pending
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 text-sm"><Loader2 className="h-4 w-4 animate-spin" />Loading…</div>
      ) : requests.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-sm text-gray-500">
          No concierge requests yet.
        </div>
      ) : (
        <>
          {/* Pending */}
          {pending.length > 0 && (
            <div className="space-y-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Pending Review</p>
              {pending.map((r, i) => (
                <motion.div key={r._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-white">{r.name || r.username}</p>
                      <p className="text-xs text-gray-400">{r.email}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Submitted: {new Date(r.conciergeRequest.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border text-yellow-400 bg-yellow-500/10 border-yellow-500/30">
                      <Clock className="h-3 w-3" />Pending
                    </span>
                  </div>

                  {/* Org details */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-black/30 border border-white/10 px-3 py-2.5">
                      <p className="text-[10px] text-gray-500 mb-0.5">Organisation</p>
                      <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <Building2 className="h-3 w-3 text-yellow-400" />{r.conciergeRequest.organisation}
                      </p>
                    </div>
                    <div className="rounded-lg bg-black/30 border border-white/10 px-3 py-2.5">
                      <p className="text-[10px] text-gray-500 mb-0.5">Type</p>
                      <p className="text-xs font-semibold text-white">{r.conciergeRequest.orgType || "—"}</p>
                    </div>
                  </div>

                  {r.conciergeRequest.description && (
                    <div className="rounded-lg bg-black/30 border border-white/10 px-4 py-3">
                      <p className="text-[10px] text-gray-500 mb-1">Description</p>
                      <p className="text-xs text-gray-200 leading-relaxed">{r.conciergeRequest.description}</p>
                    </div>
                  )}

                  {/* Admin notes */}
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Admin notes (optional)</label>
                    <textarea rows={2} value={notes[r._id] ?? ""} onChange={e => setNotes(n => ({ ...n, [r._id]: e.target.value }))}
                      placeholder="Internal notes or reason for decision…"
                      className="w-full rounded-xl bg-black border border-white/10 text-white text-xs px-3 py-2 focus:outline-none focus:border-yellow-500/50 resize-none placeholder-gray-600" />
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => act(r._id, "approve")} disabled={acting === r._id}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-semibold transition disabled:opacity-50">
                      {acting === r._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                      Approve & Grant Access
                    </button>
                    <button onClick={() => act(r._id, "reject")} disabled={acting === r._id}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/15 text-gray-300 hover:bg-white/10 text-xs font-semibold transition disabled:opacity-50">
                      <XCircle className="h-3.5 w-3.5" />Reject
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
              {resolved.map(r => (
                <div key={r._id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <div>
                    <p className="text-sm text-white">{r.name || r.username}</p>
                    <p className="text-xs text-gray-500">{r.conciergeRequest.organisation} · {r.email}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${
                    r.conciergeRequest.status === "approved"
                      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                      : "text-blue-400 bg-blue-500/10 border-blue-500/30"
                  }`}>{r.conciergeRequest.status}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
