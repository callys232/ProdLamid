"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import EscrowTable from "./escrowTable";
import { EscrowTransaction } from "@/types/project";
import Link from "next/link";

export default function Dashboard() {
  const [transactions, setTransactions] = useState<EscrowTransaction[]>([]);

  useEffect(() => {
    axios.get("/api/transactions").then((res) => {
      setTransactions(Array.isArray(res.data) ? res.data : res.data.data || []);
    });
  }, []);

  return (
    <div className="p-6 space-y-10">
      {/* Section: Transactions */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">
          Escrow Transactions
        </h2>
        <EscrowTable transactions={transactions} />
      </section>

      {/* Section: Button */}
      <section>
        <Link
          href="/escrow"
          className="inline-block px-4 py-2 bg-[#c21219] text-white rounded-md hover:bg-red-700"
        >
          Project Escrow
        </Link>
      </section>
    </div>
  );
}
