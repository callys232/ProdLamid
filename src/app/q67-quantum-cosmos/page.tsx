"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q67Page() {
  const config = MODULE_REGISTRY["Q67"] ?? buildFallbackConfig("Q67", "Q-Series — Quantum Decision Intelligence", "Quantum Cosmos Engine");
  return (
    <DashboardTierGate pillar="Q67 — Quantum Cosmos Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
