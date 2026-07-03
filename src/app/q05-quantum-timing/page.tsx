"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q05Page() {
  const config = MODULE_REGISTRY["Q05"] ?? buildFallbackConfig("Q05", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Timing Engine");
  return (
    <DashboardTierGate pillar="Q05 — Quantum Decision Timing Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
