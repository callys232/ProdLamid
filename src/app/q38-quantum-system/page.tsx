"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q38Page() {
  const config = MODULE_REGISTRY["Q38"] ?? buildFallbackConfig("Q38", "Q-Series — Quantum Decision Intelligence", "Quantum Decision System Engine");
  return (
    <DashboardTierGate pillar="Q38 — Quantum Decision System Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
