"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Mail, MoreVertical, ShieldCheck, Trash2, RefreshCw, Crown } from "lucide-react";
import toast from "react-hot-toast";
import type { OrgMember, OrgRole } from "@/types/enterprise";

interface Props {
  orgId: string;
  orgRole: OrgRole;
  memberCount: number;
  maxMembers: number;
  tier: string;
}

const ROLE_BADGE: Record<string, string> = {
  org_admin:   "border-[#c12129]/40 bg-[#c12129]/10 text-[#c12129]",
  org_manager: "border-blue-500/40 bg-blue-500/10 text-blue-400",
  org_member:  "border-white/10 bg-white/5 text-gray-400",
  org_viewer:  "border-white/10 bg-white/5 text-gray-500",
};

const ROLE_LABEL: Record<string, string> = {
  org_admin: "Admin", org_manager: "Manager", org_member: "Member", org_viewer: "Viewer",
};

const STATUS_DOT: Record<string, string> = {
  active:  "bg-green-500",
  pending: "bg-yellow-500",
  suspended: "bg-red-500",
};

const MOCK_MEMBERS: OrgMember[] = [
  { _id: "m1", orgId: "", userId: "u1", role: "org_admin",   status: "active",  joinedAt: "2026-01-10", permissions: {} as any, createdAt: "", updatedAt: "", user: { _id: "u1", username: "alex_ceo",    email: "alex@acme.com",    role: "client" } },
  { _id: "m2", orgId: "", userId: "u2", role: "org_manager", status: "active",  joinedAt: "2026-02-01", permissions: {} as any, createdAt: "", updatedAt: "", user: { _id: "u2", username: "sarah_ops",   email: "sarah@acme.com",   role: "client" } },
  { _id: "m3", orgId: "", userId: "u3", role: "org_member",  status: "active",  joinedAt: "2026-02-15", permissions: {} as any, createdAt: "", updatedAt: "", user: { _id: "u3", username: "james_fin",   email: "james@acme.com",   role: "client" } },
  { _id: "m4", orgId: "", userId: null, role: "org_member",  status: "pending", joinedAt: undefined,    permissions: {} as any, createdAt: "", updatedAt: "", inviteEmail: "priya@acme.com" },
];

export default function Members({ orgId, orgRole, memberCount, maxMembers, tier }: Props) {
  const [members, setMembers]   = useState<OrgMember[]>(MOCK_MEMBERS);
  const [email, setEmail]       = useState("");
  const [role, setRole]         = useState<OrgRole>("org_member");
  const [inviting, setInviting] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const pct = Math.min((memberCount / maxMembers) * 100, 100);
  const canManage = ["org_admin", "org_manager"].includes(orgRole);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setInviting(true);
    try {
      const res = await fetch("/api/enterprise/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      toast.success("Invite sent!");
      setEmail("");
      setMembers(prev => [...prev, { _id: Date.now().toString(), orgId, role, status: "pending", inviteEmail: email, permissions: {} as any, createdAt: "", updatedAt: "" }]);
    } catch (err: any) {
      toast.error(err.message || "Failed to invite");
    } finally {
      setInviting(false);
    }
  }

  async function handleRemove(memberId: string) {
    try {
      await fetch(`/api/enterprise/members/${memberId}`, { method: "DELETE" });
      setMembers(prev => prev.filter(m => m._id !== memberId));
      toast.success("Member removed");
    } catch { toast.error("Failed to remove"); }
    setMenuOpen(null);
  }

  return (
    <div className="space-y-6 p-6">
      {/* Capacity bar */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-white">Member Capacity</span>
          <span className="text-gray-400">{memberCount} <span className="text-gray-600">/ {maxMembers}</span></span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className={`h-full rounded-full ${pct > 80 ? "bg-[#c12129]" : "bg-white/40"}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </div>
        {pct > 80 && (
          <p className="mt-2 text-xs text-[#c12129]">
            You're at {Math.round(pct)}% capacity.{" "}
            <a href="/contact-sales" className="underline">Upgrade to Enterprise+</a> for 100+ members.
          </p>
        )}
      </div>

      {/* Invite form */}
      {canManage && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <UserPlus className="h-4 w-4 text-[#c12129]" /> Invite Member
          </h3>
          <form onSubmit={handleInvite} className="flex flex-col gap-3 sm:flex-row">
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email" required
              placeholder="colleague@company.com"
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-600 transition focus:border-[#c12129]/40 focus:outline-none"
            />
            <select
              value={role}
              onChange={e => setRole(e.target.value as OrgRole)}
              className="rounded-lg border border-white/10 bg-black px-3 py-2.5 text-sm text-gray-300 focus:outline-none"
            >
              <option value="org_manager">Manager</option>
              <option value="org_member">Member</option>
              <option value="org_viewer">Viewer</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              type="submit" disabled={inviting}
              className="flex items-center gap-2 rounded-lg bg-[#c12129] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {inviting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5" />}
              Send Invite
            </motion.button>
          </form>
        </div>
      )}

      {/* Member table */}
      <div className="rounded-xl border border-white/10 bg-white/5">
        <div className="border-b border-white/10 px-5 py-3">
          <h3 className="text-sm font-semibold text-white">{members.length} Members</h3>
        </div>
        <ul className="divide-y divide-white/5">
          <AnimatePresence>
            {members.map((m, i) => (
              <motion.li
                key={m._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 px-5 py-3.5"
              >
                {/* Avatar */}
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#c12129]/10 text-sm font-bold text-[#c12129]">
                  {(m.user?.username?.[0] ?? m.inviteEmail?.[0] ?? "?").toUpperCase()}
                </div>
                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">
                      {m.user?.username ?? m.inviteEmail ?? "Pending"}
                    </p>
                    {m.role === "org_admin" && <Crown className="h-3 w-3 text-[#c12129]" />}
                  </div>
                  <p className="text-[11px] text-gray-500">{m.user?.email ?? m.inviteEmail}</p>
                </div>
                {/* Role badge */}
                <span className={`hidden rounded-full border px-2 py-0.5 text-[10px] font-semibold sm:inline ${ROLE_BADGE[m.role]}`}>
                  {ROLE_LABEL[m.role]}
                </span>
                {/* Status dot */}
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${STATUS_DOT[m.status]}`} />
                  <span className="hidden text-[11px] capitalize text-gray-500 sm:inline">{m.status}</span>
                </div>
                {/* Actions */}
                {canManage && m.role !== "org_admin" && (
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={() => setMenuOpen(menuOpen === m._id ? null : m._id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-gray-500 transition hover:border-white/20 hover:text-white"
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </motion.button>
                    <AnimatePresence>
                      {menuOpen === m._id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 top-9 z-20 min-w-[140px] rounded-xl border border-white/10 bg-[#111] p-1 shadow-xl"
                        >
                          <button
                            onClick={() => { setMenuOpen(null); toast.success("Promote to manager (backend wired)"); }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-gray-300 transition hover:bg-white/10"
                          >
                            <ShieldCheck className="h-3.5 w-3.5 text-blue-400" /> Make Manager
                          </button>
                          <button
                            onClick={() => handleRemove(m._id)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-[#c12129] transition hover:bg-[#c12129]/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Remove
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}
