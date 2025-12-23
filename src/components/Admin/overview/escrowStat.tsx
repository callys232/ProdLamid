"use client";
import React from "react";
import { EscrowTransaction } from "@/types/client";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface Props {
  transactions?: EscrowTransaction[];
}

const mockTransactions: EscrowTransaction[] = [
  {
    id: "1",
    projectId: "p1",
    amount: 500,
    currency: "USD",
    status: "funded",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "2",
    projectId: "p2",
    amount: 1200,
    currency: "USD",
    status: "pending",
    createdAt: "",
    updatedAt: "",
  },
];

export default function EscrowStats({
  transactions = mockTransactions,
}: Props) {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);

  const statusData = [
    {
      name: "Funded",
      value: transactions.filter((t) => t.status === "funded").length,
    },
    {
      name: "Pending",
      value: transactions.filter((t) => t.status === "pending").length,
    },
    {
      name: "Released",
      value: transactions.filter((t) => t.status === "released").length,
    },
  ];

  const COLORS = ["#c21229", "#ff6666", "#010101"];

  const amountData = transactions.map((t) => ({
    project: t.projectId,
    amount: t.amount,
  }));

  return (
    <div className="bg-[#0f0f0f]/70 backdrop-blur-md border border-[#1f1f1f] rounded-lg p-6 shadow-lg hover:shadow-red-500/30 transition-transform hover:scale-105">
      <h3 className="text-lg font-semibold text-white mb-2">
        💰 Escrow Overview
      </h3>
      <p className="text-xl font-bold text-[#c21229] mb-4">
        Total Volume: ${total}
      </p>

      {/* Pie Chart for Status */}
      <div className="h-40">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              outerRadius={60}
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart for Amounts */}
      <div className="h-40 mt-4">
        <ResponsiveContainer>
          <BarChart data={amountData}>
            <XAxis dataKey="project" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Bar dataKey="amount" fill="#c21229" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
