"use client";

import { useState } from "react";
import { Project } from "@/types/project";
import { ClientProfile } from "@/types/client";
import { Milestone, MilestoneStatus } from "@/types/project"; // ✅ shared types
import { motion, AnimatePresence } from "framer-motion";

interface Escrow {
  id: string;
  projectId: string;
  amount: number;
  status:
    | "pending"
    | "funded"
    | "released"
    | "cancelled"
    | "disputed"
    | "completed";
  createdAt: string;
  releaseDate?: string;
  notes?: string;
  milestones?: Milestone[];
}

interface ClientEscrowProps {
  client: ClientProfile;
  projects: Project[];
  initialEscrows?: Escrow[];
}

export default function ClientEscrow({
  client,
  projects,
  initialEscrows = [],
}: ClientEscrowProps) {
  const [escrows, setEscrows] = useState<Escrow[]>(initialEscrows);
  const [filterProject, setFilterProject] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newEscrow, setNewEscrow] = useState<Omit<Escrow, "id" | "createdAt">>({
    projectId: "",
    amount: 0,
    status: "pending",
    releaseDate: "",
    notes: "",
    milestones: [],
  });

  // Add new escrow
  const addEscrow = () => {
    if (!newEscrow.projectId || newEscrow.amount <= 0) return;
    const escrow: Escrow = {
      ...newEscrow,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setEscrows((prev) => [escrow, ...prev]);
    setNewEscrow({
      projectId: "",
      amount: 0,
      status: "pending",
      releaseDate: "",
      notes: "",
      milestones: [],
    });
    setShowModal(false);
  };

  const filteredEscrows = escrows.filter(
    (e) => !filterProject || e.projectId === filterProject
  );

  const calculateMilestoneProgress = (milestones?: Milestone[]) => {
    if (!milestones || milestones.length === 0) return 0;
    const completed = milestones.filter((m) => m.status === "completed").length;
    return Math.round((completed / milestones.length) * 100);
  };

  return (
    <div className="w-full p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Client Escrow</h1>
      <p className="text-gray-400">
        Manage escrow accounts for{" "}
        <span className="font-semibold">{client.companyname}</span> projects.
      </p>

      {/* Filter + Add Escrow */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <select
          aria-label="Filter by Project"
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
        >
          <option value="">All Projects</option>
          {projects.map((p) => (
            // ✅ support _id or id
            <option key={p._id || p.id} value={p._id || p.id}>
              {p.title}
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-white"
        >
          Add Escrow
        </button>
      </div>

      {/* Escrow List */}
      <div className="space-y-3">
        {filteredEscrows.length > 0 ? (
          filteredEscrows.map((e) => {
            const projectTitle =
              projects.find((p) => (p._id || p.id) === e.projectId)?.title ||
              "Unknown";
            const progress = calculateMilestoneProgress(e.milestones);
            return (
              <div
                key={e.id}
                className="bg-gray-800 rounded-md p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2"
              >
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-white font-semibold">
                    {projectTitle}
                  </p>
                  <p className="text-xs text-gray-400">
                    Amount: ${e.amount.toLocaleString()} | Status:{" "}
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        e.status === "pending"
                          ? "bg-yellow-600"
                          : e.status === "released"
                          ? "bg-green-600"
                          : e.status === "funded"
                          ? "bg-blue-600"
                          : e.status === "completed"
                          ? "bg-green-700"
                          : e.status === "disputed"
                          ? "bg-orange-600"
                          : "bg-red-600"
                      } text-white`}
                    >
                      {e.status}
                    </span>
                  </p>

                  {e.releaseDate && (
                    <p className="text-xs text-gray-400">
                      Release Date:{" "}
                      {new Date(e.releaseDate).toLocaleDateString()}
                    </p>
                  )}

                  {e.notes && (
                    <p className="text-xs text-gray-400">Notes: {e.notes}</p>
                  )}

                  {e.milestones && e.milestones.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-400 mb-1">
                        Milestone Progress: {progress}%
                      </p>
                      <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-red-600 h-2 transition-all"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-500">
            No escrows found for selected project.
          </p>
        )}
      </div>

      {/* Add/Edit Escrow Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 rounded-md p-6 w-full max-w-md space-y-4"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <h2 className="text-xl font-bold text-white">Add Escrow</h2>

              <select
                aria-label="Projectid"
                value={newEscrow.projectId}
                onChange={(e) =>
                  setNewEscrow({ ...newEscrow, projectId: e.target.value })
                }
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
              >
                <option value="">-- Select Project --</option>
                {projects.map((p) => (
                  <option key={p._id || p.id} value={p._id || p.id}>
                    {p.title}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Amount"
                value={newEscrow.amount}
                onChange={(e) =>
                  setNewEscrow({ ...newEscrow, amount: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
              />

              <input
                type="date"
                placeholder="Release Date"
                value={newEscrow.releaseDate}
                onChange={(e) =>
                  setNewEscrow({ ...newEscrow, releaseDate: e.target.value })
                }
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
              />

              <textarea
                placeholder="Notes"
                value={newEscrow.notes}
                onChange={(e) =>
                  setNewEscrow({ ...newEscrow, notes: e.target.value })
                }
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
              />

              <select
                aria-label="status"
                value={newEscrow.status}
                onChange={(e) =>
                  setNewEscrow({
                    ...newEscrow,
                    status: e.target.value as Escrow["status"],
                  })
                }
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
              >
                <option value="pending">Pending</option>
                <option value="funded">Funded</option>
                <option value="released">Released</option>
                <option value="completed">Completed</option>
                <option value="disputed">Disputed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Milestones */}
              <textarea
                placeholder="Add milestones separated by comma"
                value={
                  newEscrow.milestones?.map((m) => m.title).join(",") || ""
                }
                onChange={(e) => {
                  const titles = e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean);
                  setNewEscrow({
                    ...newEscrow,
                    milestones: titles.map((t) => ({
                      title: t,
                      status: "pending" as MilestoneStatus,
                    })),
                  });
                }}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={addEscrow}
                  className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-white"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
