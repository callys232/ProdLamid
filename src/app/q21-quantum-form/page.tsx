"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q21Page() {
  const config = MODULE_REGISTRY["Q21"] ?? buildFallbackConfig("Q21", "Q-Series — Quantum Decision Intelligence", "Quantum Decision Form Engine");
  return (
    <DashboardTierGate pillar="Q21 — Quantum Decision Form Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
