"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project, Milestone } from "@/types/project";
import {
  ClientProfile,
  EscrowTransaction,
  Invitation,
  Consultant,
} from "@/types/client";
import { Edit, PlusCircle, Search, CheckCircle, XCircle } from "lucide-react";

interface ClientOverviewProps {
  client: ClientProfile;
  isPremium?: boolean;
}

export default function ClientOverview({
  client,
  isPremium = false,
}: ClientOverviewProps) {
  const projects = client.projects || [];
  const consultants = client.consultants || [];

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [escrows, setEscrows] = useState<EscrowTransaction[]>(
    client.escrowTransactions || []
  );
  const [invitations, setInvitations] = useState<Invitation[]>(
    client.invitations || []
  );
  const [filterInvitations, setFilterInvitations] = useState("");

  const [escrowAmount, setEscrowAmount] = useState("");
  const [escrowDate, setEscrowDate] = useState("");
  const [escrowMilestone, setEscrowMilestone] = useState("");

  // ---- Derived Data ----
  const milestonesOfSelected: Milestone[] = useMemo(
    () => selectedProject?.milestones || [],
    [selectedProject]
  );

  const projectProgress = useMemo(() => {
    if (!milestonesOfSelected.length) return 0;
    const completedCount = milestonesOfSelected.filter(
      (m) => m.status === "completed"
    ).length;
    return Math.round((completedCount / milestonesOfSelected.length) * 100);
  }, [milestonesOfSelected]);

  const filteredInvitations = useMemo(() => {
    return invitations.filter((inv) => {
      const consultantName =
        inv.consultantId &&
        consultants.find((c) => c.id === inv.consultantId)?.name;
      const senderName =
        consultants.find((c) => c.id === inv.invitedBy)?.name || "You";

      const searchTarget = `${inv.status} ${
        consultantName || ""
      } ${senderName} ${inv.method}`.toLowerCase();
      return searchTarget.includes(filterInvitations.toLowerCase());
    });
  }, [invitations, filterInvitations, consultants]);

  // ---- Handlers ----
  const handleAddEscrow = () => {
    if (!selectedProject || !escrowAmount) return;

    const newEscrow: EscrowTransaction = {
      id: crypto.randomUUID(),
      projectId: selectedProject.id!,
      amount: Number(escrowAmount),
      currency: "USD",
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      milestoneId: escrowMilestone || undefined,
      releaseDate: escrowDate || undefined,
      notes: "",
      milestones: selectedProject.milestones || [],
    };

    setEscrows((prev) => [...prev, newEscrow]);
    setEscrowAmount("");
    setEscrowDate("");
    setEscrowMilestone("");
  };

  const handleInviteConsultant = (consultantId: string) => {
    if (!selectedProject || !consultantId) return;

    const newInvitation: Invitation = {
      id: crypto.randomUUID(),
      projectId: selectedProject.id!,
      invitedBy: client.id,
      consultantId,
      method: "consultant",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setInvitations((prev) => [...prev, newInvitation]);
  };

  const handleUpdateInvitationStatus = (
    invitationId: string,
    status: "accepted" | "rejected"
  ) => {
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === invitationId ? ({ ...inv, status } as Invitation) : inv
      )
    );
  };

  // ---- Animations ----
  const fadeSlide = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="w-full p-6 space-y-8 text-white bg-gradient-to-br from-black via-gray-950 to-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          {client.companyname || client.name}
        </h1>
        <button
          className="px-5 py-2 bg-red-600 rounded-lg hover:bg-red-700 flex items-center gap-2 shadow-md transition"
          aria-label="Edit client profile"
        >
          <Edit size={18} /> Edit Profile
        </button>
      </div>

      {/* Client Details */}
      <section className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 space-y-4 shadow-lg">
        <h2 className="text-xl font-semibold text-red-400">Client Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={client.name}
            readOnly
            placeholder="Contact Name"
            className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 w-full focus:ring-2 focus:ring-red-500"
            aria-label="Contact Name"
          />
          <input
            type="email"
            value={client.email}
            readOnly
            placeholder="Email"
            className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 w-full focus:ring-2 focus:ring-red-500"
            aria-label="Email"
          />
        </div>
      </section>

      {/* Projects */}
      <section className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 space-y-4 shadow-lg">
        <h2 className="text-xl font-semibold text-red-400">Projects</h2>
        <select
          aria-label="Select project"
          className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-red-500"
          value={selectedProject?.id || ""}
          onChange={(e) => {
            const selected =
              projects.find((p) => p.id === e.target.value) ?? null;
            setSelectedProject(selected);
          }}
        >
          <option value="">-- Select Project --</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>

        <AnimatePresence>
          {selectedProject && (
            <motion.div
              variants={fadeSlide}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-4 space-y-3"
            >
              <h3 className="font-semibold text-lg text-white">
                {selectedProject.title}
              </h3>
              <p className="text-gray-400">
                Category: {selectedProject.category}
              </p>
              <p className="text-gray-400">
                Tech: {selectedProject.tech || "N/A"}
              </p>
              <p className="text-gray-300">
                Progress:{" "}
                <span className="font-semibold text-red-400">
                  {projectProgress}%
                </span>
              </p>

              {/* Milestones */}
              <ul className="space-y-2 mt-2 overflow-x-auto">
                {milestonesOfSelected.map((m) => {
                  const progress =
                    m.progress ?? (m.status === "completed" ? 100 : 0);
                  return (
                    <li
                      key={m.id}
                      className="bg-gray-800 rounded-lg p-3 flex flex-col md:flex-row md:justify-between gap-2 shadow-sm"
                    >
                      <div>
                        <p className="font-medium">{m.title}</p>
                        <p className="text-xs text-gray-400">
                          Due:{" "}
                          {m.dueDate
                            ? new Date(m.dueDate).toLocaleDateString()
                            : "—"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 md:gap-4 flex-1">
                        <div className="w-full bg-gray-700 rounded h-2 overflow-hidden">
                          <div
                            className="h-2 bg-red-600 transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">
                          {m.status}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      {/* Escrow */}
      <section className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 space-y-4 shadow-lg">
        <h2 className="text-xl font-semibold text-red-400">Escrow</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            aria-label="Escrow Amount"
            value={escrowAmount}
            onChange={(e) => setEscrowAmount(e.target.value)}
            placeholder="Amount"
            className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 w-full focus:ring-2 focus:ring-red-500"
          />
          <input
            type="date"
            aria-label="Escrow Release Date"
            value={escrowDate}
            onChange={(e) => setEscrowDate(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 w-full focus:ring-2 focus:ring-red-500"
          />
          <select
            aria-label="Escrow Milestone"
            value={escrowMilestone}
            onChange={(e) => setEscrowMilestone(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 w-full focus:ring-2 focus:ring-red-500"
          >
            <option value="">-- Select Milestone --</option>
            {milestonesOfSelected.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddEscrow}
            className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 flex items-center gap-2 shadow-md transition"
          >
            <PlusCircle size={18} /> Add Escrow
          </button>
        </div>

        {/* Escrow List */}
        <ul className="space-y-2 mt-4">
          {escrows.map((escrow) => (
            <li
              key={escrow.id}
              className="bg-gray-800 rounded-lg p-4 flex flex-col md:flex-row md:justify-between gap-2 shadow-sm"
            >
              <div>
                <p className="font-semibold text-white">
                  ${escrow.amount} {escrow.currency}
                </p>
                <p className="text-xs text-gray-400">
                  Milestone:{" "}
                  {escrow.milestoneId
                    ? milestonesOfSelected.find(
                        (m) => m.id === escrow.milestoneId
                      )?.title
                    : "—"}
                </p>
              </div>
              <div className="text-xs text-gray-400">
                Status: {escrow.status} <br />
                Release:{" "}
                {escrow.releaseDate
                  ? new Date(escrow.releaseDate).toLocaleDateString()
                  : "—"}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Invitations */}
      <section className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 space-y-4 shadow-lg">
        <h2 className="text-xl font-semibold text-red-400">
          Consultant Invitations
        </h2>

        {/* Search Filter */}
        <div className="flex items-center gap-2">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            aria-label="Filter Invitations"
            value={filterInvitations}
            onChange={(e) => setFilterInvitations(e.target.value)}
            placeholder="Search invitations..."
            className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 w-full focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Invite Consultant */}
        <div className="flex gap-2 mt-2">
          <select
            aria-label="Select Consultant"
            className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 flex-1 focus:ring-2 focus:ring-red-500"
            onChange={(e) => handleInviteConsultant(e.target.value)}
          >
            <option value="">-- Invite Consultant --</option>
            {consultants.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Invitations List */}
        <ul className="space-y-2 mt-4">
          {filteredInvitations.length > 0 ? (
            filteredInvitations.map((inv) => {
              const consultantName =
                consultants.find((c) => c.id === inv.consultantId)?.name ||
                "Unknown";
              const senderName =
                consultants.find((c) => c.id === inv.invitedBy)?.name || "You";

              return (
                <li
                  key={inv.id}
                  className="bg-gray-800 rounded-lg p-4 flex flex-col md:flex-row md:justify-between gap-2 shadow-sm"
                >
                  <div>
                    <p className="font-semibold text-white">{consultantName}</p>
                    <p className="text-xs text-gray-400">
                      Invited by: {senderName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      Status: {inv.status}
                    </span>
                    {inv.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleUpdateInvitationStatus(inv.id, "accepted")
                          }
                          className="px-2 py-1 bg-green-600 rounded text-xs hover:bg-green-700 flex items-center gap-1"
                        >
                          <CheckCircle size={14} /> Accept
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateInvitationStatus(inv.id, "rejected")
                          }
                          className="px-2 py-1 bg-red-600 rounded text-xs hover:bg-red-700 flex items-center gap-1"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })
          ) : (
            <p className="text-gray-400 text-sm">No invitations found.</p>
          )}
        </ul>
      </section>
    </div>
  );
}
