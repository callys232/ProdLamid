"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Mail, Shield, Crown, UserPlus, ChevronRight,
  X, Send, CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import MemberDetailModal, { type MemberProfile } from "@/components/shared/MemberDetailModal";

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: i * 0.06 },
});

/* ── PM contact target ───────────────────────────────────────────── */
const PM = {
  id:    "lamid-pm-001",
  name:  "Dr. Amaka Okafor",
  email: "a.okafor@lamidconsulting.com",
};

const ROLES = ["Client Lead", "Technical Lead", "Project Analyst", "Communications Lead", "Finance Lead", "Other"];

const MEMBERS: (MemberProfile & { type: string })[] = [
  {
    id: PM.id,
    name: PM.name,
    role: "Dedicated PM",
    email: PM.email,
    status: "active",
    type: "pm",
    joinedAt: "2026-01-05",
    skills: ["Programme Management", "Stakeholder Engagement", "M&E", "Risk Management"],
    badge: { label: "Dedicated PM", color: "text-[#c21219] bg-[#c21219]/10 border-[#c21219]/30" },
  },
  {
    id: "lamid-analyst-001",
    name: "Chidi Eze",
    role: "Project Analyst",
    email: "c.eze@lamidconsulting.com",
    status: "active",
    type: "internal",
    joinedAt: "2026-01-10",
    skills: ["Data Analysis", "Reporting", "Power BI", "Financial Modelling"],
    badge: { label: "Lamid Team", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  },
  {
    id: "client-lead-001",
    name: "Fatima Al-Hassan",
    role: "Client Lead",
    email: "fatima@gov.test",
    status: "active",
    type: "client",
    joinedAt: "2026-01-15",
    skills: ["Leadership", "Policy", "Budget Oversight"],
    badge: { label: "Your Team", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  },
  {
    id: "client-tech-001",
    name: "Emmanuel Nwachukwu",
    role: "Technical Lead",
    email: "e.nwachukwu@gov.test",
    status: "active",
    type: "client",
    joinedAt: "2026-02-01",
    skills: ["Systems Architecture", "API Integration", "DevOps", "Cloud Infrastructure"],
    badge: { label: "Your Team", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  },
];

const TYPE_ICON: Record<string, any> = {
  pm:       Crown,
  internal: Shield,
  client:   Users,
};

export default function ConciergeTeams() {
  const [selected, setSelected]     = useState<MemberProfile | null>(null);
  const [showInvite, setShowInvite] = useState(false);

  /* ── Invite-via-PM form state ──────────────────────────────────── */
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [role, setRole]     = useState(ROLES[0]);
  const [msg, setMsg]       = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent]     = useState(false);

  function resetForm() {
    setName(""); setEmail(""); setRole(ROLES[0]); setMsg(""); setSent(false);
  }

  function closeInvite() {
    setShowInvite(false);
    setTimeout(resetForm, 300);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    const tid = toast.loading("Sending request to your PM…");
    try {
      const body = {
        email:         email.trim(),
        method:        "email" as const,
        status:        "pending" as const,
        invitedBy:     PM.id,
        notes:         `Invited by concierge client via PM request. Role: ${role}. ${msg ? `Message: ${msg}` : ""}`.trim(),
      };
      const res = await fetch("/api/invitations", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });
      if (!res.ok) {
        const { message } = await res.json().catch(() => ({}));
        throw new Error(message ?? "Request failed");
      }
      toast.success(`Request sent to ${PM.name}!`, { id: tid });
      setSent(true);
    } catch (err: any) {
      toast.error(err.message ?? "Failed to send — please try again", { id: tid });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <div className="space-y-6 max-w-3xl">
        <motion.div {...fadeUp(0)}>
          <h2 className="text-lg font-bold text-white mb-1">Programme Team</h2>
          <p className="text-xs text-gray-400">
            Your dedicated team across Lamid and your organisation.{" "}
            <span className="text-gray-600">Click any member to view their profile, projects and milestones.</span>
          </p>
        </motion.div>

        {/* Members */}
        <div className="space-y-3">
          {MEMBERS.map((m, i) => {
            const Icon = TYPE_ICON[m.type] ?? Users;
            return (
              <motion.button
                key={m.email}
                {...fadeUp(i + 1)}
                onClick={() => setSelected(m)}
                whileHover={{ scale: 1.01, y: -2, boxShadow: "0 8px 28px rgba(0,0,0,0.4)", borderColor: "rgba(194,18,25,0.35)" }}
                whileTap={{ scale: 0.985 }}
                transition={{ duration: 0.18 }}
                className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c21219]/15 border border-[#c21219]/25 text-sm font-bold text-[#c21219] flex-shrink-0">
                    {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">{m.name}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Mail className="h-3 w-3" />{m.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {m.badge && (
                    <span className={`hidden sm:flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full border ${m.badge.color}`}>
                      <Icon className="h-3 w-3" />{m.badge.label}
                    </span>
                  )}
                  <span className="hidden sm:block text-xs text-gray-500">{m.role}</span>
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Invite CTA */}
        <motion.div
          {...fadeUp(MEMBERS.length + 1)}
          className="rounded-xl border border-dashed border-white/15 bg-white/5 px-5 py-6 text-center"
        >
          <UserPlus className="h-6 w-6 text-gray-500 mx-auto mb-2" />
          <p className="text-sm text-gray-400 mb-1">Need to add a team member?</p>
          <p className="text-xs text-gray-600 mb-4">
            Your dedicated PM ({PM.name}) will handle the invitation on your behalf.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 6px 20px rgba(194,18,25,0.35)" }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.15 }}
            onClick={() => setShowInvite(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c21219] hover:bg-red-700 text-white text-sm font-semibold transition"
          >
            <UserPlus className="h-4 w-4" /> Contact your PM to invite
          </motion.button>
        </motion.div>
      </div>

      {/* ── Member detail modal ─────────────────────────────────────── */}
      <MemberDetailModal
        member={selected}
        onClose={() => setSelected(null)}
        accent="#c21219"
      />

      {/* ── Invite-via-PM modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {showInvite && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            onClick={closeInvite}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 16 }}
              transition={{ duration: 0.22, ease: [0.33, 1, 0.68, 1] }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d1117] shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#c21219]/15 border border-[#c21219]/25">
                    <UserPlus className="h-4 w-4 text-[#c21219]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Request Team Invite</h3>
                    <p className="text-[11px] text-gray-500">via {PM.name}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  onClick={closeInvite}
                  className="rounded-xl border border-white/10 bg-white/5 p-2 text-gray-400 hover:text-white transition"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>

              {/* Body */}
              <div className="px-6 py-5">
                {sent ? (
                  /* ── Success state ─────────────────────────────── */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4 py-6 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30"
                    >
                      <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                    </motion.div>
                    <div>
                      <p className="text-base font-bold text-white">Request Sent!</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {PM.name} will reach out to <span className="text-white font-medium">{email}</span> shortly.
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      onClick={closeInvite}
                      className="mt-2 px-6 py-2 rounded-xl bg-[#c21219] text-sm font-semibold text-white hover:bg-red-700 transition"
                    >
                      Done
                    </motion.button>
                  </motion.div>
                ) : (
                  /* ── Form state ────────────────────────────────── */
                  <form onSubmit={handleSend} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Ada Lovelace"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c21219]/50 transition"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">
                        Email Address <span className="text-[#c21219]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="member@organisation.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c21219]/50 transition"
                      />
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">Intended Role</label>
                      <select
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-[#c21219]/50 transition"
                      >
                        {ROLES.map(r => (
                          <option key={r} value={r} className="bg-[#0d1117]">{r}</option>
                        ))}
                      </select>
                    </div>

                    {/* Message to PM */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">Message to PM <span className="text-gray-600">(optional)</span></label>
                      <textarea
                        rows={3}
                        placeholder="Any context you'd like your PM to know before reaching out…"
                        value={msg}
                        onChange={e => setMsg(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c21219]/50 transition resize-none"
                      />
                    </div>

                    {/* PM note */}
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      Your PM <span className="text-gray-400">{PM.name}</span> will send the invitation and handle onboarding on your behalf.
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-1">
                      <button
                        type="button"
                        onClick={closeInvite}
                        className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
                      >
                        Cancel
                      </button>
                      <motion.button
                        type="submit"
                        disabled={sending || !email.trim()}
                        whileHover={{ scale: 1.04, boxShadow: "0 4px 16px rgba(194,18,25,0.35)" }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-2 rounded-xl bg-[#c21219] px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-50"
                      >
                        {sending ? (
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : (
                          <Send className="h-3.5 w-3.5" />
                        )}
                        {sending ? "Sending…" : "Send to PM"}
                      </motion.button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
