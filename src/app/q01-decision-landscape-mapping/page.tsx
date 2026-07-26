"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q01Page() {
  const config = MODULE_REGISTRY["Q01"] ?? buildFallbackConfig("Q01", "Q-Series — Decision Intelligence", "Decision Landscape Mapping Engine");
  return (
    <DashboardTierGate pillar="Q01 — Decision Landscape Mapping Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
