"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q29Page() {
  const config = MODULE_REGISTRY["Q29"] ?? buildFallbackConfig("Q29", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Role Engine");
  return (
    <DashboardTierGate pillar="Q29 — Quantum Decision Role Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
