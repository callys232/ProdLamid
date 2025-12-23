"use client";
import { useEffect, useState } from "react";
import { EscrowTransaction, Milestone } from "@/types/project";
import { mockClients } from "@/mocks/mockClient";

export default function EscrowCard({ projectId }: { projectId: string }) {
  const [escrow, setEscrow] = useState<EscrowTransaction[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/projects/${projectId}/escrow`);
        if (res.ok) {
          const { data } = await res.json();
          setEscrow(data.escrow || []);
          setMilestones(data.milestones || []);
          return;
        }
        throw new Error("Backend not ok");
      } catch {
        const fallbackProject = mockClients[0].projects.find(
          (p) => p.id === projectId || p._id === projectId
        );
        setEscrow(fallbackProject?.escrow || []);
        setMilestones(fallbackProject?.milestones || []);
      }
    }
    fetchData();
  }, [projectId]);

  if (!escrow.length)
    return <div className="animate-pulse h-32 bg-gray-900 rounded-xl" />;

  return (
    <div
      className="bg-black border border-gray-700 rounded-xl p-6 shadow-lg 
                    transition transform hover:scale-[1.02] hover:bg-gray-900 
                    hover:border-[#c12129] relative group"
    >
      <h3 className="text-lg font-semibold text-white mb-3">
        Escrow Transactions
      </h3>
      <table className="w-full text-sm text-gray-300">
        <thead>
          <tr className="text-[#c12129]">
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Milestone</th>
          </tr>
        </thead>
        <tbody>
          {escrow.map((tx) => (
            <tr key={tx.id} className="hover:bg-gray-800 transition">
              <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
              <td>${tx.amount}</td>
              <td>{tx.status}</td>
              <td>
                {milestones.find((m) => m.id === tx.milestoneId)?.title || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
        <span className="bg-[#c12129] text-white text-xs px-2 py-1 rounded shadow-md">
          Payment and escrow details
        </span>
      </div>
    </div>
  );
}
