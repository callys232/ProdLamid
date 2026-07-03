"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q74Page() {
  const config = MODULE_REGISTRY["Q74"] ?? buildFallbackConfig("Q74", "Q-Series — Quantum Decision Intelligence", "Quantum Duration Engine");
  return (
    <DashboardTierGate pillar="Q74 — Quantum Duration Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
