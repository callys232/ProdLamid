"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q80Page() {
  const config = MODULE_REGISTRY["Q80"] ?? buildFallbackConfig("Q80", "Q-Series — Quantum Decision Intelligence", "Quantum Evolution Engine");
  return (
    <DashboardTierGate pillar="Q80 — Quantum Evolution Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
