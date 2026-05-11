"use client";

import { useState, useEffect } from "react";
import { ClientProfile, Consultant, Team } from "@/types/client";
import ConsultantForm from "./addTeam";
import { getClientTeams, createTeam, addTeamMember, removeTeamMember, deleteTeam } from "@/lib/api/teamsApi";

interface ClientTeamSettingsProps {
  client: ClientProfile;
  onUpdate?: () => void; // Notify parent to refresh if needed
}

export default function ClientTeamSettings({
  client,
  onUpdate,
}: ClientTeamSettingsProps) {
  const [teams, setTeams] = useState<Team[]>(client.teams || ([] as any));
  const [activeTeam, setActiveTeam] = useState<Team | null>(
    (client.teams && client.teams.length > 0) ? client.teams[0] : null
  );
  const [search, setSearch] = useState("");
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const refreshTeams = async () => {
    try {
      const data = await getClientTeams(client.id);
      setTeams(data);
      if (activeTeam) {
        const updated = data.find((t: any) => t._id === activeTeam._id);
        if (updated) setActiveTeam(updated);
      }
    } catch (err) {
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName) return;
    try {
      setLoading(true);
      await createTeam({ name: newTeamName, ownerId: client.id });
      setNewTeamName("");
      setShowTeamForm(false);
      await refreshTeams();
    } catch (err) {
      alert("Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTeam || !newMemberEmail) return;
    try {
      setLoading(true);
      await addTeamMember(activeTeam._id || activeTeam.id, newMemberEmail);
      setNewMemberEmail("");
      setShowMemberForm(false);
      await refreshTeams();
    } catch (err) {
      alert("Failed to add member. Make sure the user exists.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!activeTeam) return;
    try {
      setLoading(true);
      await removeTeamMember(activeTeam._id || activeTeam.id, userId);
      await refreshTeams();
    } catch (err) {
      alert("Failed to remove member");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm("Are you sure you want to delete this team?")) return;
    try {
      setLoading(true);
      await deleteTeam(teamId);
      setActiveTeam(null);
      await refreshTeams();
    } catch (err) {
      alert("Failed to delete team");
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = teams.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* LEFT SIDEBAR - Teams List */}
      <aside className="w-full lg:w-64 bg-gray-900 border border-gray-800 rounded-md p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-white">My Teams</h2>
          <input
            type="text"
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-4 rounded-md border border-gray-700 bg-gray-800 text-white px-3 py-2 text-sm"
          />
          <ul className="space-y-2">
            {filteredTeams.map((team) => (
              <li
                key={team._id || team.id}
                onClick={() => setActiveTeam(team)}
                className={`px-3 py-2 rounded-md cursor-pointer flex justify-between items-center text-sm ${activeTeam?._id === team._id || activeTeam?.id === team.id
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  }`}
              >
                <span className="truncate">{team.name}</span>
                <span className="text-xs opacity-60">({team.members?.length || 0})</span>
              </li>
            ))}
            {filteredTeams.length === 0 && (
              <li className="text-sm text-gray-400">No teams found</li>
            )}
          </ul>
        </div>
        <button
          onClick={() => setShowTeamForm(true)}
          className="mt-6 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm font-medium transition-colors"
        >
          + Create Team
        </button>
      </aside>

      {/* MIDDLE PANEL - Team Details & Members */}
      <main className="flex-1 bg-gray-900 border border-gray-800 rounded-md p-6">
        {activeTeam ? (
          <div className="space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{activeTeam.name}</h2>
                <p className="text-gray-400 text-sm">Owner: {client.name}</p>
              </div>
              <button
                onClick={() => handleDeleteTeam(activeTeam._id || activeTeam.id)}
                className="text-xs text-red-500 hover:text-red-400 font-medium"
              >
                Delete Team
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Team Members</h3>
                <button
                  onClick={() => setShowMemberForm(true)}
                  className="px-3 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-xs text-white"
                >
                  + Add Member
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-gray-400 border-b border-gray-800">
                    <tr>
                      <th className="pb-3 font-medium">User</th>
                      <th className="pb-3 font-medium">Role</th>
                      <th className="pb-3 font-medium">Joined</th>
                      <th className="pb-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {activeTeam.members && activeTeam.members.length > 0 ? (
                      activeTeam.members.map((member: any, idx: number) => (
                        <tr key={member.user?._id || idx} className="text-gray-300">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                                {member.user?.username?.charAt(0).toUpperCase() || "U"}
                              </div>
                              <div>
                                <p className="font-medium text-white">{member.user?.username || "Unknown"}</p>
                                <p className="text-xs text-gray-500">{member.user?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">{member.role || "member"}</td>
                          <td className="py-4 text-xs text-gray-500">
                            {member.addedAt ? new Date(member.addedAt).toLocaleDateString() : "—"}
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => handleRemoveMember(member.user?._id || member.user?.id)}
                              className="text-xs text-gray-500 hover:text-red-500"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-500 italic">
                          No members in this team yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <p>Select a team to manage members and settings.</p>
          </div>
        )}
      </main>

      {/* CREATE TEAM MODAL */}
      {showTeamForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white mb-4">Create New Team</h3>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Team Name</label>
                <input
                  type="text"
                  required
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm"
                  placeholder="e.g., Development Team"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTeamForm(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-medium text-white disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Team"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD MEMBER MODAL */}
      {showMemberForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white mb-4">Add Team Member</h3>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">User Email</label>
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm"
                  placeholder="user@example.com"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMemberForm(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-medium text-white disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
