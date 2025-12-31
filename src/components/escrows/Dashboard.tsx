"use client";

import { useEffect, useState } from "react";
import type { Escrow, Message } from "@/types/escrow";
import { mockEscrow } from "@/mocks/mocksEscrow";

import DashboardTabs from "./dashboardTabs"; // ✅ default import
import UploadCard from "./uploadCard";
import { EscrowCard } from "./escrowCard";
import MessageBar from "./messenger";

export default function Dashboard() {
  const [escrow, setEscrow] = useState<Escrow | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    async function fetchEscrow() {
      try {
        const res = await fetch("/api/escrow");
        if (!res.ok) {
          console.warn("Escrow API returned non-OK, using mockEscrow");
          setEscrow(mockEscrow);
          setMessages(mockEscrow.messages ?? []);
          return;
        }
        const data: Escrow = await res.json();
        setEscrow(data);
        setMessages(data.messages ?? []);
      } catch (err) {
        console.error("Escrow API failed, using mockEscrow:", err);
        setEscrow(mockEscrow);
        setMessages(mockEscrow.messages ?? []);
      }
    }
    fetchEscrow();
  }, []);

  if (!escrow) {
    return <p className="p-4 text-gray-400 text-sm">Loading escrow data...</p>;
  }

  return (
    <section className="flex min-h-screen gap-10 bg-black p-10 text-white">
      {/* Left column */}
      <div className="flex-1 space-y-10">
        {/* ✅ only pass escrow now */}
        <DashboardTabs escrow={escrow} messages={messages} />
        <UploadCard />
        <UploadCard />
      </div>

      {/* Right column */}
      <EscrowCard escrow={escrow} />

      {/* Floating Messenger */}
      <div className="fixed bottom-0 inset-x-0 z-50">
        <MessageBar escrow={escrow} setMessages={setMessages} />
      </div>
    </section>
  );
}
