import React from "react";
import { EscrowTransaction } from "@/types/project";

interface EscrowTableProps {
  transactions: EscrowTransaction[];
}

const EscrowTable: React.FC<EscrowTableProps> = ({ transactions }) => (
  <table className="w-full text-left text-sm text-gray-300">
    <thead>
      <tr>
        <th>Date</th>
        <th>Project ID</th>
        <th>Milestone</th>
        <th>Amount</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {transactions.map((tx) => (
        <tr key={tx.id}>
          <td>{tx.date ?? tx.createdAt}</td>
          <td>{tx.projectId}</td>
          <td>{tx.milestoneId ?? "-"}</td>
          <td>${tx.amount}</td>
          <td>{tx.status}</td>
          <td>
            <button className="text-blue-500 hover:underline">
              {tx.action ?? "View"}
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default EscrowTable;
