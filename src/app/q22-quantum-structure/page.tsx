"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q22Page() {
  const config = MODULE_REGISTRY["Q22"] ?? buildFallbackConfig("Q22", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Structure Engine");
  return (
    <DashboardTierGate pillar="Q22 — Quantum Decision Structure Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
