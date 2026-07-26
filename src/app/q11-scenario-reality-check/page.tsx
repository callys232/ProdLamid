"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q11Page() {
  const config = MODULE_REGISTRY["Q11"] ?? buildFallbackConfig("Q11", "Q-Series — Decision Intelligence", "Scenario Reality Check Engine");
  return (
    <DashboardTierGate pillar="Q11 — Scenario Reality Check Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
