"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q61Page() {
  const config = MODULE_REGISTRY["Q61"] ?? buildFallbackConfig("Q61", "Q-Series — Quantum Decision Intelligence", "Quantum Space Engine");
  return (
    <DashboardTierGate pillar="Q61 — Quantum Space Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
