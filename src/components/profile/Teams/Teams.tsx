"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

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

export default function Teams() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* -------------------- LOAD TEAM + PROJECTS -------------------- */
  useEffect(() => {
    async function loadTeamData() {
      try {
        const res = await fetch("/api/teams/t1");

        if (res.ok) {
          const { data } = await res.json();

          const backendProjects: Project[] = (data.projects ?? []).map(
            (p: Project) => ({ ...p, id: p._id || p.id })
          );

          const backendMembers: TeamMember[] = data.teamMembers ?? [];

          setProjects(backendProjects);
          setTeamMembers(backendMembers);

          if (backendProjects.length) {
            setActiveProject(backendProjects[0]);
          }

          setLoading(false);
          return;
        }

        throw new Error("Backend not ok");
      } catch (err) {
        console.warn("⚠ Backend failed → using fallback mock data.");
        setError("Unable to fetch team data. Showing fallback.");

        const fallbackClient: ClientProfile = mockClients[0];

        const fallbackProjects = (fallbackClient.projects ?? [])
          .filter((p) => p.teamId === "team1")
          .map((p) => ({ ...p, id: p._id || p.id }));

        setProjects(fallbackProjects);
        setTeamMembers(fallbackClient.teamMembers ?? []);

        if (fallbackProjects.length) {
          setActiveProject(fallbackProjects[0]);
        }
      } finally {
        setLoading(false);
      }
    }

    loadTeamData();
  }, []);

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

  /* -------------------- UI -------------------- */
  return (
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
                className={`w-full text-left px-3 py-2 rounded-md ${
                  activeProject?.id === proj.id
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
  );
}
