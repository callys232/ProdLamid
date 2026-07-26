"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q06Page() {
  const config = MODULE_REGISTRY["Q06"] ?? buildFallbackConfig("Q06", "Q-Series — Decision Intelligence", "Conflicting Priorities Detector Engine");
  return (
    <DashboardTierGate pillar="Q06 — Conflicting Priorities Detector Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
