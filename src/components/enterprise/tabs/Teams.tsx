"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Plus, Search, Trash2, UserMinus, X, FolderOpen, ChevronRight,
} from "lucide-react";
import MemberDetailModal, { type MemberProfile } from "@/components/shared/MemberDetailModal";
import toast from "react-hot-toast";
import type { Team } from "@/types/client";
import {
  getClientTeams, createTeam, addTeamMember, removeTeamMember, deleteTeam,
} from "@/lib/api/teamsApi";

interface Props {
  orgId?: string;
}

const ROLES = ["manager", "member", "viewer"];

export default function EnterpriseTeams({ orgId }: Props) {
  const [teams, setTeams]             = useState<Team[]>([]);
  const [activeTeam, setActiveTeam]   = useState<Team | null>(null);
  const [userId, setUserId]           = useState("");
  const [search, setSearch]           = useState("");
  const [loading, setLoading]         = useState(true);
  const [busy, setBusy]               = useState(false);

  const [showCreate, setShowCreate]   = useState(false);
  const [showAdd, setShowAdd]         = useState(false);
  const [selected, setSelected]       = useState<MemberProfile | null>(null);
  const [newName, setNewName]         = useState("");
  const [newEmail, setNewEmail]       = useState("");
  const [newRole, setNewRole]         = useState("member");

  /* ── Bootstrap ──────────────────────────────────────────────── */
  useEffect(() => {
    async function init() {
      try {
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
          const { data } = await meRes.json();
          const uid = data?._id ?? data?.id ?? "";
          setUserId(uid);
          if (uid) refresh(uid);
        }
      } catch {
        setLoading(false);
      }
    }
    init();
  }, []);

  const refresh = async (uid = userId) => {
    try {
      const data = await getClientTeams(uid);
      const list: Team[] = Array.isArray(data) ? data : [];
      setTeams(list);
      if (activeTeam) {
        const updated = list.find(t => (t._id ?? t.id ?? "") === (activeTeam._id ?? activeTeam.id));
        setActiveTeam(updated ?? list[0] ?? null);
      } else {
        setActiveTeam(list[0] ?? null);
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  /* ── Handlers ───────────────────────────────────────────────── */
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setBusy(true);
    const tid = toast.loading("Creating team…");
    try {
      await createTeam({ name: newName.trim(), ownerId: userId });
      toast.success("Team created!", { id: tid });
      setNewName("");
      setShowCreate(false);
      await refresh();
    } catch {
      toast.error("Failed to create team", { id: tid });
    } finally {
      setBusy(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTeam || !newEmail.trim()) return;
    setBusy(true);
    const tid = toast.loading("Adding member…");
    try {
      await addTeamMember(activeTeam._id ?? activeTeam.id ?? "", newEmail.trim());
      toast.success("Member added!", { id: tid });
      setNewEmail("");
      setShowAdd(false);
      await refresh();
    } catch {
      toast.error("User not found or already in team", { id: tid });
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    if (!activeTeam) return;
    setBusy(true);
    const tid = toast.loading("Removing member…");
    try {
      await removeTeamMember(activeTeam._id ?? activeTeam.id ?? "", memberId);
      toast.success("Member removed", { id: tid });
      await refresh();
    } catch {
      toast.error("Failed to remove member", { id: tid });
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!activeTeam) return;
    if (!confirm(`Delete "${activeTeam.name}"? This cannot be undone.`)) return;
    setBusy(true);
    const tid = toast.loading("Deleting team…");
    try {
      await deleteTeam(activeTeam._id ?? activeTeam.id ?? "");
      toast.success("Team deleted", { id: tid });
      setActiveTeam(null);
      await refresh();
    } catch {
      toast.error("Failed to delete team", { id: tid });
    } finally {
      setBusy(false);
    }
  };

  const filtered = teams.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] p-6">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#c12129] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 min-h-[500px]">

      {/* ── Team sidebar ────────────────────────────────────── */}
      <aside className="w-full lg:w-56 flex-shrink-0 flex flex-col gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
          <input
            type="text"
            placeholder="Search teams…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-8 pr-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c12129]/50"
          />
        </div>

        {/* Team list */}
        <nav className="flex-1 space-y-1">
          {filtered.length === 0 && (
            <p className="text-sm text-gray-500 px-1">No teams yet.</p>
          )}
          {filtered.map(team => {
            const tid = team._id ?? team.id ?? "";
            const atid = activeTeam?._id ?? activeTeam?.id ?? "";
            const active = tid === atid;
            return (
              <motion.button
                key={tid}
                whileHover={{ x: active ? 0 : 3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTeam(team)}
                className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-[#c12129]/15 border border-[#c12129]/30 text-white"
                    : "border border-transparent text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="truncate font-medium">{team.name}</span>
                <span className={`text-[10px] rounded-full px-1.5 py-0.5 ${active ? "bg-[#c12129]/20 text-[#c12129]" : "bg-white/5 text-gray-500"}`}>
                  {team.members?.length ?? 0}
                </span>
              </motion.button>
            );
          })}
        </nav>

        {/* Create team button */}
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: "0 4px 14px rgba(193,33,41,0.3)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowCreate(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#c12129] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          <Plus className="h-4 w-4" /> Create Team
        </motion.button>
      </aside>

      {/* ── Team detail panel ───────────────────────────────── */}
      <main className="flex-1 rounded-xl border border-white/10 bg-white/5">
        {!activeTeam ? (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 text-gray-500">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <Users className="h-6 w-6" />
            </div>
            <p className="text-sm">Select or create a team to manage members.</p>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => setShowCreate(true)}
              className="mt-2 flex items-center gap-1.5 rounded-lg border border-[#c12129]/30 bg-[#c12129]/10 px-4 py-2 text-sm font-medium text-[#c12129] hover:bg-[#c12129]/20"
            >
              <Plus className="h-4 w-4" /> New Team
            </motion.button>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Team header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">{activeTeam.name}</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {activeTeam.members?.length ?? 0} member{(activeTeam.members?.length ?? 0) !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 14px rgba(193,33,41,0.25)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAdd(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-[#c12129]/30 bg-[#c12129]/10 px-3 py-1.5 text-xs font-semibold text-[#c12129] transition hover:bg-[#c12129]/20"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Member
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  disabled={busy}
                  className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/15 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </motion.button>
              </div>
            </div>

            {/* Members table */}
            {(!activeTeam.members || activeTeam.members.length === 0) ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-gray-500">
                <FolderOpen className="h-8 w-8" />
                <p className="text-sm">No members yet — add one to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-white/8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8 text-[11px] uppercase tracking-widest text-gray-500">
                      <th className="px-4 py-3 text-left font-medium">Member</th>
                      <th className="px-4 py-3 text-left font-medium">Role</th>
                      <th className="px-4 py-3 text-left font-medium">Joined</th>
                      <th className="px-4 py-3 text-right font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {activeTeam.members.map((m, i) => {
                      const uid = m.user?._id ?? m.user?.id ?? String(i);
                      return (
                        <motion.tr
                          key={uid}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                          onClick={() => setSelected({
                            id:      uid,
                            name:    m.user?.username ?? "Unknown",
                            email:   m.user?.email ?? "—",
                            role:    m.role ?? "member",
                            joinedAt: m.addedAt,
                            badge: {
                              label: m.role ?? "member",
                              color: "text-gray-400 border-gray-500/20 bg-gray-500/10",
                            },
                          })}
                          className="text-gray-300 cursor-pointer"
                        >
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-[#c12129]/15 border border-[#c12129]/20 flex items-center justify-center text-xs font-bold text-[#c12129] flex-shrink-0">
                                {(m.user?.username ?? "?")[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-white">{m.user?.username ?? "Unknown"}</p>
                                <p className="text-[11px] text-gray-500">{m.user?.email ?? "—"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 capitalize text-gray-400">{m.role ?? "member"}</td>
                          <td className="px-4 py-3.5 text-[11px] text-gray-500">
                            {m.addedAt ? new Date(m.addedAt).toLocaleDateString() : "—"}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
                              <motion.button
                                whileHover={{ scale: 1.1, color: "#ef4444" }} whileTap={{ scale: 0.9 }}
                                onClick={e => { e.stopPropagation(); handleRemove(uid); }}
                                disabled={busy}
                                className="flex items-center gap-1 text-xs text-gray-500 transition disabled:opacity-50"
                              >
                                <UserMinus className="h-3.5 w-3.5" /> Remove
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Create Team Modal ──────────────────────────────── */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d1117] p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-white">Create New Team</h3>
                <button onClick={() => setShowCreate(false)} className="text-gray-500 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Team Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="e.g., Product Engineering"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c12129]/50"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-1">
                  <button type="button" onClick={() => setShowCreate(false)} className="text-sm text-gray-400 hover:text-white px-3 py-2">Cancel</button>
                  <motion.button
                    type="submit" disabled={busy || !newName.trim()}
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    className="rounded-xl bg-[#c12129] px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                  >
                    {busy ? "Creating…" : "Create Team"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Add Member Modal ──────────────────────────────── */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowAdd(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d1117] p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-white">Add Team Member</h3>
                <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    placeholder="user@company.com"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c12129]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Role</label>
                  <select
                    value={newRole}
                    onChange={e => setNewRole(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#c12129]/50"
                  >
                    {ROLES.map(r => <option key={r} value={r} className="capitalize bg-[#0d1117]">{r}</option>)}
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-1">
                  <button type="button" onClick={() => setShowAdd(false)} className="text-sm text-gray-400 hover:text-white px-3 py-2">Cancel</button>
                  <motion.button
                    type="submit" disabled={busy || !newEmail.trim()}
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    className="rounded-xl bg-[#c12129] px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                  >
                    {busy ? "Adding…" : "Add Member"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Member detail modal ──────────────────────────── */}
      <MemberDetailModal
        member={selected}
        onClose={() => setSelected(null)}
        accent="#c12129"
      />
    </div>
  );
}
