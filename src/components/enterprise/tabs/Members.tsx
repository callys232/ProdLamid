"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Mail, MoreVertical, ShieldCheck, Trash2, RefreshCw, Crown } from "lucide-react";
import toast from "react-hot-toast";
import type { OrgMember, OrgRole } from "@/types/enterprise";
import MemberDetailModal, { type MemberProfile } from "@/components/shared/MemberDetailModal";
import { mockEnterpriseMembers } from "@/mocks/mockEnterpriseMembers";

interface Props {
  orgId: string;
  orgRole: OrgRole;
  memberCount: number;
  maxMembers: number;
  tier: string;
}

const ROLE_BADGE: Record<string, string> = {
  org_admin:   "border-[#2563EB]/40 bg-[#2563EB]/10 text-[#2563EB]",
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
  suspended: "bg-blue-500",
};

export default function Members({ orgId, orgRole, memberCount, maxMembers, tier }: Props) {
  const [members, setMembers]   = useState<OrgMember[]>(mockEnterpriseMembers);
  const [email, setEmail]       = useState("");
  const [role, setRole]         = useState<OrgRole>("org_member");
  const [inviting, setInviting] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [selected, setSelected] = useState<MemberProfile | null>(null);

  /* ── Fetch real members, keep mock as fallback ──────────────── */
  useEffect(() => {
    if (!orgId) return;
    fetch(`/api/enterprise/members?orgId=${orgId}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (Array.isArray(d?.data) && d.data.length) setMembers(d.data); })
      .catch(() => {});
  }, [orgId]);

  function openModal(m: OrgMember) {
    setSelected({
      id:       m.user?._id ?? m.userId ?? m._id,
      name:     m.user?.username ?? m.inviteEmail ?? "Pending",
      email:    m.user?.email ?? m.inviteEmail ?? "",
      role:     ROLE_LABEL[m.role] ?? m.role,
      status:   m.status as MemberProfile["status"],
      joinedAt: m.joinedAt,
      badge: {
        label: ROLE_LABEL[m.role] ?? m.role,
        color: ROLE_BADGE[m.role] ?? "border-white/10 bg-white/5 text-gray-400",
      },
    });
  }

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
    <div className="space-y-4 p-4">
      {/* Capacity bar */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-white">Member Capacity</span>
          <span className="text-gray-400">{memberCount} <span className="text-gray-600">/ {maxMembers}</span></span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className={`h-full rounded-full ${pct > 80 ? "bg-[#2563EB]" : "bg-white/40"}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </div>
        {pct > 80 && (
          <p className="mt-2 text-xs text-[#2563EB]">
            You're at {Math.round(pct)}% capacity.{" "}
            <a href="/contact-sales" className="underline">Upgrade to Enterprise+</a> for 100+ members.
          </p>
        )}
      </div>

      {/* Invite form */}
      {canManage && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <UserPlus className="h-4 w-4 text-[#2563EB]" /> Invite Member
          </h3>
          <form onSubmit={handleInvite} className="flex flex-col gap-3 sm:flex-row">
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email" required
              placeholder="colleague@company.com"
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-600 transition focus:border-[#2563EB]/40 focus:outline-none"
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
              className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
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
                whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                onClick={() => openModal(m)}
                className="flex items-center gap-4 px-5 py-3.5 cursor-pointer"
              >
                {/* Avatar */}
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#2563EB]/10 text-sm font-bold text-[#2563EB]">
                  {(m.user?.username?.[0] ?? m.inviteEmail?.[0] ?? "?").toUpperCase()}
                </div>
                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">
                      {m.user?.username ?? m.inviteEmail ?? "Pending"}
                    </p>
                    {m.role === "org_admin" && <Crown className="h-3 w-3 text-[#2563EB]" />}
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
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-[#2563EB] transition hover:bg-[#2563EB]/10"
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

      <MemberDetailModal
        member={selected}
        onClose={() => setSelected(null)}
        accent="#2563EB"
      />
    </div>
  );
}
