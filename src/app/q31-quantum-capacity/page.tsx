"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q31Page() {
  const config = MODULE_REGISTRY["Q31"] ?? buildFallbackConfig("Q31", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Capacity Engine");
  return (
    <DashboardTierGate pillar="Q31 — Quantum Decision Capacity Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
