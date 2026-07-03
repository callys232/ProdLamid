"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q75Page() {
  const config = MODULE_REGISTRY["Q75"] ?? buildFallbackConfig("Q75", "Q-Series — Quantum Decision Intelligence", "Quantum Cycle Engine");
  return (
    <DashboardTierGate pillar="Q75 — Quantum Cycle Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
