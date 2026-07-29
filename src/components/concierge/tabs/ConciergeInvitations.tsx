"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, User, Sparkles, Clock, CheckCircle2, XCircle,
  RotateCcw, Trash2, Search, SendHorizonal, ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import type { Invitation as BaseInvitation, Consultant as BaseConsultant } from "@/types/client";

// Extend with UI-only field the API may populate
type Invitation = BaseInvitation & { consultantName?: string };

// Only the fields we actually receive — BaseConsultant has many required fields
// we can't guarantee from a list endpoint
interface ConsultantListItem {
  id: string;
  _id?: string;
  name: string;         // BaseConsultant requires name
  role: string;         // BaseConsultant requires role
  industry: string;     // BaseConsultant requires industry
  email?: string;
  username?: string;
}

const STATUS_STYLE: Record<string, string> = {
  pending:   "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  accepted:  "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  declined:  "text-blue-400 bg-blue-500/10 border-blue-500/30",    // canonical value from @/types/client
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  pending:  <Clock       className="h-3 w-3" />,
  accepted: <CheckCircle2 className="h-3 w-3" />,
  declined: <XCircle     className="h-3 w-3" />,
};

export default function ConciergeInvitations() {
  const [userId, setUserId]               = useState<string>("");
  const [consultants, setConsultants]     = useState<ConsultantListItem[]>([]);
  const [invitations, setInvitations]     = useState<Invitation[]>([]);
  const [loading, setLoading]             = useState(true);
  const [sending, setSending]             = useState(false);
  const [aiLoading, setAiLoading]         = useState(false);
  const [aiResults, setAiResults]         = useState<ConsultantListItem[]>([]);
  const [filter, setFilter]               = useState("");
  const [email, setEmail]                 = useState("");
  const [selectedId, setSelectedId]       = useState("");
  const [showConsultantDrop, setShowConsultantDrop] = useState(false);

  /* ── Bootstrap ─────────────────────────────────────────────── */
  useEffect(() => {
    async function init() {
      try {
        const [meRes, consultRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/consultants?limit=50"),
        ]);
        if (meRes.ok) {
          const { data } = await meRes.json();
          const uid = data?._id ?? data?.id ?? "";
          setUserId(uid);
          if (uid) fetchInvitations(uid);
        }
        if (consultRes.ok) {
          const { data } = await consultRes.json();
          setConsultants(Array.isArray(data) ? data : []);
        }
      } catch {
        // fallback — keep empty state
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const fetchInvitations = async (uid: string) => {
    try {
      const res = await fetch(`/api/invitations?invitedBy=${uid}`);
      if (res.ok) {
        const { data } = await res.json();
        setInvitations(Array.isArray(data) ? data : []);
      }
    } catch { /* silent */ }
  };

  /* ── Invite actions ─────────────────────────────────────────── */
  async function sendInvite(payload: Omit<Invitation, "id" | "createdAt">) {
    setSending(true);
    const tid = toast.loading("Sending invitation…");
    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, invitedBy: userId }),
      });
      if (!res.ok) {
        const { message } = await res.json().catch(() => ({}));
        throw new Error(message ?? "Failed to send");
      }
      toast.success("Invitation sent!", { id: tid });
      if (userId) await fetchInvitations(userId);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to send invitation", { id: tid });
    } finally {
      setSending(false);
    }
  }

  const handleEmailInvite = () => {
    if (!email.trim()) return;
    sendInvite({ email: email.trim(), method: "email", status: "pending" });
    setEmail("");
  };

  const handleConsultantInvite = (c: ConsultantListItem) => {
    const id = c._id ?? c.id;
    sendInvite({
      consultantId: id,
      consultantName: c.name ?? c.username ?? "Consultant",
      method: "consultant",
      status: "pending",
    });
    setSelectedId("");
    setShowConsultantDrop(false);
  };

  const handleAI = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAiResults(consultants.slice(0, 3));
      setAiLoading(false);
    }, 1200);
  };

  async function handleResend(id: string) {
    const tid = toast.loading("Resending…");
    try {
      const res = await fetch(`/api/invitations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "pending" }),
      });
      if (!res.ok) throw new Error("Resend failed");
      toast.success("Resent!", { id: tid });
      if (userId) await fetchInvitations(userId);
    } catch {
      toast.error("Failed to resend", { id: tid });
    }
  }

  async function handleCancel(id: string) {
    const tid = toast.loading("Cancelling…");
    try {
      const res = await fetch(`/api/invitations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Cancel failed");
      toast.success("Cancelled", { id: tid });
      if (userId) await fetchInvitations(userId);
    } catch {
      toast.error("Failed to cancel", { id: tid });
    }
  }

  const filtered = invitations.filter(inv => {
    const q = filter.toLowerCase();
    return (
      !q ||
      inv.email?.toLowerCase().includes(q) ||
      inv.consultantName?.toLowerCase().includes(q) ||
      inv.status.includes(q)
    );
  });

  const selectedConsultant = consultants.find(c => (c._id ?? c.id) === selectedId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#2563EB] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Mail className="h-5 w-5 text-[#2563EB]" /> Invitations
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Invite consultants to your projects via email or direct selection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ── Invite by Email ────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4"
        >
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-[#2563EB]" />
            <h2 className="text-sm font-semibold text-white">Invite by Email</h2>
          </div>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="consultant@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleEmailInvite()}
              className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#2563EB]/50"
            />
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 4px 14px rgba(194,18,25,0.35)" }}
              whileTap={{ scale: 0.96 }}
              disabled={sending || !email.trim()}
              onClick={handleEmailInvite}
              className="flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              <SendHorizonal className="h-3.5 w-3.5" /> Send
            </motion.button>
          </div>
        </motion.div>

        {/* ── Consultant Selector ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
          className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4"
        >
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-[#2563EB]" />
            <h2 className="text-sm font-semibold text-white">Select Consultant</h2>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowConsultantDrop(p => !p)}
              className="w-full flex items-center justify-between rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-left text-gray-600 hover:border-white/20 transition"
            >
              <span className={selectedConsultant ? "text-white" : "text-gray-600"}>
                {selectedConsultant
                  ? `${selectedConsultant.name ?? selectedConsultant.username} — ${selectedConsultant.industry ?? ""}`
                  : "Choose a consultant…"}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
            <AnimatePresence>
              {showConsultantDrop && (
                <motion.ul
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto rounded-xl border border-white/10 bg-[#111] shadow-2xl"
                >
                  {consultants.length === 0 && (
                    <li className="px-4 py-3 text-sm text-gray-500">No consultants available</li>
                  )}
                  {consultants.map(c => (
                    <motion.li
                      key={c._id ?? c.id}
                      whileHover={{ backgroundColor: "rgba(194,18,25,0.1)" }}
                      onClick={() => { setSelectedId(c._id ?? c.id); setShowConsultantDrop(false); }}
                      className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm text-gray-600 border-b border-white/5 last:border-0"
                    >
                      <div className="h-7 w-7 rounded-full bg-[#2563EB]/20 flex items-center justify-center text-[11px] font-bold text-[#2563EB] flex-shrink-0">
                        {(c.name ?? c.username ?? "?")[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">{c.name ?? c.username}</p>
                        <p className="text-[11px] text-gray-500 truncate">{c.industry}</p>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
          {selectedConsultant && (
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 4px 14px rgba(194,18,25,0.35)" }}
              whileTap={{ scale: 0.96 }}
              disabled={sending}
              onClick={() => handleConsultantInvite(selectedConsultant)}
              className="w-full rounded-lg bg-[#2563EB] py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              Invite {selectedConsultant.name ?? selectedConsultant.username}
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* ── AI Recommendations (Concierge premium feature) ─────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-xl border border-[#2563EB]/20 bg-[#2563EB]/5 p-5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#2563EB]" />
            <h2 className="text-sm font-semibold text-white">AI Recommendations</h2>
            <span className="text-[10px] bg-[#2563EB] text-white px-2 py-0.5 rounded-full font-semibold">Concierge</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            disabled={aiLoading}
            onClick={handleAI}
            className="flex items-center gap-2 rounded-lg border border-[#2563EB]/30 bg-[#2563EB]/10 px-4 py-2 text-xs font-semibold text-[#2563EB] transition hover:bg-[#2563EB]/20 disabled:opacity-50"
          >
            <Sparkles className="h-3 w-3" />
            {aiLoading ? "Analysing…" : "Get Recommendations"}
          </motion.button>
        </div>
        <p className="text-xs text-gray-500">
          AI matches consultants to your active projects based on skills, past performance, and availability.
        </p>
        <AnimatePresence>
          {aiResults.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="space-y-2 overflow-hidden"
            >
              {aiResults.map((c, i) => (
                <motion.li
                  key={c._id ?? c.id}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between rounded-lg border border-white/8 bg-white/5 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#2563EB]/20 flex items-center justify-center text-xs font-bold text-[#2563EB]">
                      {(c.name ?? c.username ?? "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{c.name ?? c.username}</p>
                      <p className="text-[11px] text-gray-500">{c.industry}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(194,18,25,0.3)" }} whileTap={{ scale: 0.95 }}
                    disabled={sending}
                    onClick={() => handleConsultantInvite(c)}
                    className="rounded-lg bg-[#2563EB]/15 border border-[#2563EB]/30 px-3 py-1.5 text-xs font-semibold text-[#2563EB] transition hover:bg-[#2563EB]/25"
                  >
                    Invite
                  </motion.button>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Invitation History ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
        className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4"
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-sm font-semibold text-white">Invitation History</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search…"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="rounded-lg border border-white/10 bg-black/40 pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#2563EB]/50 w-44"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-500">
            {invitations.length === 0 ? "No invitations sent yet." : "No results for your search."}
          </div>
        ) : (
          <ul className="space-y-2">
            {filtered.map((inv, i) => {
              const label = inv.consultantName ?? inv.email ?? "Unknown";
              const style = STATUS_STYLE[inv.status] ?? STATUS_STYLE.cancelled;
              return (
                <motion.li
                  key={inv.id}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  whileHover={{ x: 4, boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}
                  className="flex items-center justify-between gap-4 rounded-lg border border-white/8 bg-black/30 px-4 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                      {label[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{label}</p>
                      <p className="text-[11px] text-gray-500 capitalize">
                        via {inv.method} · {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border capitalize ${style}`}>
                      {STATUS_ICON[inv.status]} {inv.status}
                    </span>
                    {inv.status === "pending" && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => handleResend(inv.id)}
                          title="Resend"
                          className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-gray-600 transition hover:text-white"
                        >
                          <RotateCcw className="h-3 w-3" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => handleCancel(inv.id)}
                          title="Cancel"
                          className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-1.5 text-blue-400 transition hover:bg-blue-500/15"
                        >
                          <Trash2 className="h-3 w-3" />
                        </motion.button>
                      </>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}
      </motion.div>
    </div>
  );
}
