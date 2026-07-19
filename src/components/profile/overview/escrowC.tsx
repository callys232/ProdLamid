"use client";
import { useEffect, useState } from "react";
import { EscrowTransaction, Milestone } from "@/types/project";
import { mockClients } from "@/mocks/mockClient";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function EscrowCard({ projectId }: { projectId: string }) {
  const [escrow, setEscrow] = useState<EscrowTransaction[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/projects/${projectId}/escrow`);
        if (!res.ok) throw new Error("Backend not ok");

        const { data } = await res.json();
        setEscrow(data.escrow || []);
        setMilestones(data.milestones || []);
      } catch {
        const fallbackProject = mockClients[0].projects.find(
          (p) => p.id === projectId || p._id === projectId
        );
        setEscrow(fallbackProject?.escrow || []);
        setMilestones(fallbackProject?.milestones || []);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [projectId]);

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-900 rounded-xl" />;
  }

  if (!escrow.length) {
    return (
      <div className="bg-black border border-gray-700 rounded-xl p-6 shadow-lg">
        <p className="text-gray-400 text-sm">No escrow transactions available.</p>
      </div>
    );
  }

  // Headline metrics
  const fundedTotal = escrow
    .filter((tx) => tx.status === "funded")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const releasedTotal = escrow
    .filter((tx) => tx.status === "released")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const balance = fundedTotal - releasedTotal;

  // Status badge colors
  const statusColors: Record<string, string> = {
    funded: "bg-yellow-600",
    released: "bg-green-600",
    pending: "bg-gray-600",
    disputed: "bg-blue-600",
  };

  // Chart data
  const chartData = escrow.map((tx) => ({
    date: new Date(tx.createdAt).toLocaleDateString(),
    amount: tx.amount,
    status: tx.status,
  }));

  return (
    <div
      className="bg-black border border-gray-700 rounded-xl p-6 shadow-lg 
                 transition transform hover:scale-[1.02] hover:bg-gray-900 
                 hover:border-[#2563EB] relative group"
    >
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        Escrow Transactions
        {error && (
          <span className="text-xs text-blue-500">(fallback data)</span>
        )}
      </h3>

      {/* Headline metrics */}
      <div className="flex justify-between text-xs text-gray-400 mb-3">
        <span>Funded: <span className="text-white">${fundedTotal}</span></span>
        <span>Released: <span className="text-white">${releasedTotal}</span></span>
        <span>Balance: <span className="text-white">${balance}</span></span>
      </div>

      {/* Trend chart */}
      <div className="mb-4 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111",
                border: "1px solid #2563EB",
                color: "#fff",
              }}
              formatter={(value) => [`$${value}`, "Amount"]}
              labelFormatter={(label, payload) =>
                `${label} (${payload[0]?.payload?.status})`
              }
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#2563EB"
              strokeWidth={2}
              dot={{ r: 4, fill: "#2563EB" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Transaction table with hover popover */}
      <table className="w-full text-sm text-gray-300">
        <thead>
          <tr className="text-[#2563EB]">
            <th className="text-left">Date</th>
            <th className="text-right">Amount</th>
            <th className="text-center">Status</th>
            <th className="text-left">Milestone</th>
          </tr>
        </thead>
        <tbody>
          {escrow.map((tx) => (
            <tr
              key={tx.id}
              className="relative hover:bg-gray-800 hover:border hover:border-[#2563EB] transition group"
            >
              <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
              <td className="text-right">${tx.amount}</td>
              <td className="text-center">
                <span
                  className={`text-xs px-2 py-1 rounded text-white ${statusColors[tx.status] || "bg-gray-600"
                    }`}
                >
                  {tx.status}
                </span>
              </td>
              <td>
                {milestones.find((m) => m.id === tx.milestoneId)?.title || "—"}
              </td>

              {/* Hover popover */}
              <td className="absolute left-0 top-full mt-1 w-full opacity-0 group-hover:opacity-100 transition">
                <div className="bg-[#111] border border-[#2563EB] text-xs text-gray-300 rounded p-2 shadow-lg">
                  <p>Transaction ID: {tx.id}</p>
                  <p>Created: {new Date(tx.createdAt).toLocaleString()}</p>
                  <p>Amount: ${tx.amount}</p>
                  <p>Status: {tx.status}</p>
                  <p>
                    Milestone:{" "}
                    {milestones.find((m) => m.id === tx.milestoneId)?.title ||
                      "—"}
                  </p>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tooltip */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
        <span className="bg-[#2563EB] text-white text-xs px-2 py-1 rounded shadow-md">
          Payment and escrow details
        </span>
      </div>
    </div>
  );
}
