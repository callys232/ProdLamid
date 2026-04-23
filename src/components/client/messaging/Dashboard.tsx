"use client";

import { useEffect, useState } from "react";
import type { Escrow, Message } from "@/types/escrow";
import { mockEscrow } from "@/mocks/mocksEscrow";

import DashboardTabs from "./dashboardTabs";
import UploadCard from "./uploadCard";
import { EscrowCard } from "./escrowCard";
import MessageBar from "./messenger";

function normalizeEscrow(data: any): Escrow {
  if (!data || typeof data !== "object") return mockEscrow;

  return {
    ...data,
    messages: Array.isArray(data.messages) ? data.messages : [],
    projects: Array.isArray(data.projects) ? data.projects : [],
  };
}

export default function Dashboard() {
  const [escrow, setEscrow] = useState<Escrow | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");

  useEffect(() => {
    async function fetchEscrow() {
      try {
        const res = await fetch("/api/escrow");

        if (!res.ok) throw new Error("Bad response");

        const raw = await res.json();
        const normalized = normalizeEscrow(raw);

        setEscrow(normalized);
        setMessages(normalized.messages ?? []);
        setStatus("ready");
      } catch (err) {
        console.warn("Using mockEscrow:", err);

        const fallback = normalizeEscrow(mockEscrow);
        setEscrow(fallback);
        setMessages(fallback.messages ?? []);
        setStatus("fallback");
      }
    }

    fetchEscrow();
  }, []);

  if (status === "loading" || !escrow) {
    return (
      <p className="p-4 text-gray-400 text-sm">
        Loading escrow data...
      </p>
    );
  }



  return (
    <section className="min-h-screen flex flex-col bg-black text-white">

      {/* Main content (row layout inside column) */}
      <div className="flex flex-1 gap-10 p-10">

        {/* Left column */}
        <div className="flex-1 space-y-10">
          <DashboardTabs escrow={escrow} messages={messages} />
          <UploadCard />
        </div>

        {/* Right column */}
        <div className="w-[380px] max-w-[40%]">
          <EscrowCard escrow={escrow} />
        </div>
        {/* Message Bar — anchored to bottom of this component */}
        <div className="border-t border-white/10 bg-black">
          <MessageBar escrow={escrow} setMessages={setMessages} />
        </div>
      </div>



    </section>
  );
}