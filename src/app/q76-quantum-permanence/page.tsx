"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q76Page() {
  const config = MODULE_REGISTRY["Q76"] ?? buildFallbackConfig("Q76", "Q-Series — Quantum Decision Intelligence", "Quantum Permanence Engine");
  return (
    <DashboardTierGate pillar="Q76 — Quantum Permanence Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
