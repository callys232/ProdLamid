"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

import { Project, Milestone } from "@/types/project";
import { ClientProfile, TeamMember } from "@/types/client";
import { mockClients } from "@/mocks/mockClient";

import { MilestoneItem } from "./MilestoneItem";
import { MemberItem } from "./Member";
import { AlertItem } from "./Alert";

/* -------------------- ANIMATION VARIANTS -------------------- */
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const completedVariant = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
};

const pendingVariant = {
  hidden: { opacity: 0, x: 10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },


};

/* -------------------- MAP STATUS TO ALERT TYPE -------------------- */
function statusToAlertType(
  status: string
): "success" | "overdue" | "upcoming" | "payment" {
  switch (status) {
    case "completed":
      return "success";
    case "cancelled":
      return "overdue";
    case "in_progress":
      return "payment";
    default:
      return "upcoming";
  }
}

export default function Teams({ user }: { user: any }) {
  const [teams, setTeams] = useState<any[]>(user?.profile?.teams || []);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [showManageMembersModal, setShowManageMembersModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");

  /* -------------------- INITIAL LOAD -------------------- */
  useEffect(() => {
    if (user?.profile?.teams?.length > 0) {
      setTeams(user.profile.teams);
      setSelectedTeam(user.profile.teams[0]);
    } else {
      // Fallback: fetch teams if not in user prop (though it should be)
      loadUserTeams();
    }
  }, [user]);

  const loadUserTeams = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/teams?ownerId=${user?._id}`);
      if (res.ok) {
        const { data } = await res.json();
        setTeams(data);
        if (data.length > 0) setSelectedTeam(data[0]);
      }
    } catch (err) {
      console.error("Failed to load teams:", err);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- LOAD PROJECTS FOR SELECTED TEAM -------------------- */
  useEffect(() => {
    if (!selectedTeam) return;

    async function loadTeamData() {
      try {
        setLoading(true);
        // Fetch projects where teamId matches selectedTeam._id
        const res = await fetch(`/api/projects?teamId=${selectedTeam._id}`);

        if (res.ok) {
          const { data } = await res.json();

          const backendProjects: Project[] = (data ?? []).map(
            (p: any) => ({ ...p, id: p._id || p.id })
          );

          setProjects(backendProjects);
          // Set team members from the selectedTeam object (populated by profileService)
          const backendMembers: TeamMember[] = (selectedTeam.members ?? []).map((m: any) => ({
            id: m.user?._id,
            name: m.user?.username || "Unknown",
            role: m.role || "Member",
            email: m.user?.email
          }));

          setTeamMembers(backendMembers);

          if (backendProjects.length) {
            setActiveProject(backendProjects[0]);
          } else {
            setActiveProject(null);
          }

          setLoading(false);
          return;
        }

        throw new Error("Backend not ok");
      } catch (err) {
        console.warn("⚠ Team projects fetch failed.");
        setError("Unable to fetch team projects.");
        setProjects([]);
        setTeamMembers([]);
        setActiveProject(null);
      } finally {
        setLoading(false);
      }
    }

    loadTeamData();
  }, [selectedTeam]);

  /* -------------------- FILTERED PROJECTS -------------------- */
  const filteredProjects = useMemo(
    () =>
      projects.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      ),
    [projects, search]
  );

  /* -------------------- LOADING STATES -------------------- */
  if (loading) {
    return <div className="p-6 text-gray-400">Loading team data…</div>;
  }

  if (!activeProject) {
    return (
      <div className="p-6 text-gray-400">No projects found for your team.</div>
    );
  }

  /* -------------------- COMPUTE MILESTONE STATS -------------------- */
  const milestoneStats = activeProject.milestones
    ? {
      total: activeProject.milestones.length,
      completed: activeProject.milestones.filter(
        (m) => m.status === "completed"
      ).length,
      pending: activeProject.milestones.filter(
        (m) => m.status === "pending" || m.status === "in_progress"
      ).length,
      overdue: activeProject.milestones.filter((m) => {
        if (!m.dueDate) return false;
        return new Date(m.dueDate) < new Date() && m.status !== "completed";
      }).length,
    }
    : { total: 0, completed: 0, pending: 0, overdue: 0 };

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return;
    try {
      setLoading(true);
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTeamName, ownerId: user._id })
      });
      if (res.ok) {
        const { data } = await res.json();
        setTeams(prev => [...prev, data]);
        setSelectedTeam(data);
        setNewTeamName("");
        setShowCreateModal(false);
        toast.success("Team created successfully!");
      }
    } catch (err) {
      toast.error("Failed to create team");
    } finally {
      setLoading(false);
    }
  };
  const handleAddMember = async () => {
    if (!inviteEmail.trim() || !selectedTeam) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/teams/${selectedTeam._id}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
        }),
      });

      if (res.ok) {
        toast.success("Invitation sent!");
        setInviteEmail("");
        setInviteRole("member");
      } else {
        toast.error("Failed to send invite");
      }
    } catch (err) {
      toast.error("Error inviting member");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!selectedTeam) return;

    try {
      setLoading(true);
      const res = await fetch(
        `/api/teams/${selectedTeam._id}/members/${memberId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        toast.success("Member removed");
        setTeamMembers((prev) =>
          prev.filter((m) => m.id !== memberId)
        );
      } else {
        toast.error("Failed to remove member");
      }
    } catch (err) {
      toast.error("Error removing member");
    } finally {
      setLoading(false);
    }
  };


  /* -------------------- UI -------------------- */
  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center bg-gray-900 border border-gray-700 rounded-xl p-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-white">Select Team:</h2>
          <select
            value={selectedTeam?._id || ""}
            onChange={(e) => setSelectedTeam(teams.find(t => t._id === e.target.value))}
            className="bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-1 outline-none focus:ring-2 focus:ring-red-500"
          >
            {teams.length === 0 && <option value="">No Teams Found</option>}
            {teams.map(t => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          + Create Team
        </button>
      </div>

      <motion.div
        className="flex flex-col md:flex-row gap-6 w-full"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* LEFT SIDEBAR — PROJECT LIST */}
        <motion.aside
          variants={item}
          className="w-full md:w-64 bg-gray-900 border border-gray-700 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Team Projects</h2>

          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-4 rounded-md border bg-gray-800 text-white px-3 py-2"
          />

          <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
            {filteredProjects.map((proj) => (
              <li key={proj.id}>
                <button
                  onClick={() => setActiveProject(proj)}
                  className={`w-full text-left px-3 py-2 rounded-md ${activeProject?.id === proj.id
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                >
                  📁 {proj.title}
                </button>
              </li>
            ))}
          </ul>
        </motion.aside>

        {/* MAIN PANEL */}
        <motion.main
          variants={item}
          className="flex-1 bg-gray-900 border border-gray-700 rounded-xl p-8 space-y-8"
        >
          {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

          <header className="flex items-center gap-4">
            {activeProject.image && (
              <img
                src={activeProject.image}
                alt={activeProject.title}
                className="w-16 h-16 rounded-lg object-cover border-2 border-red-500"
              />
            )}

            <div>
              <h2 className="text-3xl font-bold text-white">
                {activeProject.title}
              </h2>
              <p className="text-sm text-gray-400">
                {activeProject.organization}
              </p>
            </div>
          </header>

          {/* META */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm text-gray-300">
            {activeProject.category && (
              <div>Category: {activeProject.category}</div>
            )}
            {activeProject.tech && <div>Tech: {activeProject.tech}</div>}
            {activeProject.location && (
              <div>Location: {activeProject.location}</div>
            )}
            {activeProject.budget && <div>Budget: {activeProject.budget}</div>}
            {activeProject.priority && (
              <div>Priority: {activeProject.priority}</div>
            )}
            {activeProject.status && <div>Status: {activeProject.status}</div>}
            {activeProject.deadline && (
              <div>Deadline: {activeProject.deadline}</div>
            )}
          </div>

          {/* MILESTONES */}
          {activeProject.milestones && (
            <section>
              <h3 className="text-lg font-semibold text-white mb-3">
                Milestones
              </h3>
              <motion.ul variants={container} initial="hidden" animate="visible">
                {activeProject.milestones.map((ms: Milestone, idx) => (
                  <motion.li
                    key={ms.id || idx}
                    variants={
                      ms.status === "completed"
                        ? completedVariant
                        : pendingVariant
                    }
                  >
                    <MilestoneItem
                      milestone={ms} // ✅ unified type from types/project
                      accomplished={ms.status === "completed"}
                      stats={milestoneStats} // ✅ global stats passed in
                    />
                  </motion.li>
                ))}
              </motion.ul>
            </section>
          )}

          {/* TEAM MEMBERS */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">
              Team Members
            </h3>

            <ul className="space-y-2">
              {teamMembers.map((m: TeamMember) => (
                <MemberItem key={m.id} name={m.name} role={m.role} />
              ))}
            </ul>
          </section>
        </motion.main>

        {/* ALERTS */}
        <motion.aside
          variants={item}
          className="w-full md:w-72 bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-6"
        >
          <h3 className="text-lg font-semibold text-white">Alerts</h3>

          <ul className="space-y-3">
            {activeProject.milestones?.map((ms: Milestone, idx) => (
              <AlertItem
                key={ms.id || idx}
                message={
                  ms.status === "completed"
                    ? `${ms.title ?? "Milestone"} has been completed 🎉`
                    : ms.status === "cancelled"
                      ? `${ms.title ?? "Milestone"} was cancelled ⚠️`
                      : `${ms.title ?? "Milestone"} is upcoming ⏳`
                }
                type={statusToAlertType(ms.status ?? "upcoming")}
              />
            ))}
          </ul>
        </motion.aside>
      </motion.div>

      {/* CREATE TEAM MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0B0F19] p-6 rounded-xl w-full max-w-md space-y-4 border border-gray-800 shadow-2xl"
          >
            <h3 className="font-semibold text-xl text-white text-center">Create New Team</h3>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Team Name</label>
              <input
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Enter team name..."
                className="w-full bg-gray-900 text-white border border-gray-800 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCreateTeam}
                disabled={loading || !newTeamName.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold transition disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create"}
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-md transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* MANAGE MEMBERS MODAL */}
      {showManageMembersModal && selectedTeam && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0B0F19] p-6 rounded-xl w-full max-w-lg space-y-6 border border-gray-800 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-xl text-white">Manage Team Members</h3>
              <button onClick={() => setShowManageMembersModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Current Members</h4>
              <ul className="space-y-3">
                {selectedTeam.members?.map((m: any) => (
                  <li key={m.user?._id} className="flex items-center justify-between bg-gray-900 p-3 rounded-lg border border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-xs uppercase">
                        {m.user?.username?.slice(0, 2) || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{m.user?.username || m.user?.email}</p>
                        <p className="text-xs text-gray-500 capitalize">{m.role}</p>
                      </div>
                    </div>
                    {m.user?._id !== user._id && (
                      <button
                        onClick={() => handleRemoveMember(m.user?._id)}
                        className="text-xs text-red-500 hover:text-red-400 font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-800">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Invite New Member</h4>
              <div className="flex flex-col gap-3">
                <input
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Collaborator's email..."
                  className="w-full bg-gray-900 text-white border border-gray-800 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-red-500"
                />
                <div className="flex gap-3">
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="flex-1 bg-gray-900 text-white border border-gray-800 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <button
                    onClick={handleAddMember}
                    disabled={loading || !inviteEmail.trim()}
                    className="flex-[2] bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold transition disabled:opacity-50"
                  >
                    Send Invite
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
