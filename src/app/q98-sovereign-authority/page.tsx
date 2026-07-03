"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q98Page() {
  const config = MODULE_REGISTRY["Q98"] ?? buildFallbackConfig("Q98", "Q-Series — Quantum Decision Intelligence", "Sovereign Authority Engine");
  return (
    <DashboardTierGate pillar="Q98 — Sovereign Authority Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
