"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q07Page() {
  const config = MODULE_REGISTRY["Q07"] ?? buildFallbackConfig("Q07", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Coherence Engine");
  return (
    <DashboardTierGate pillar="Q07 — Quantum Decision Coherence Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
