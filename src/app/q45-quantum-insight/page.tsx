"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q45Page() {
  const config = MODULE_REGISTRY["Q45"] ?? buildFallbackConfig("Q45", "Q-Series — Decision Intelligence", "Strategic Insight Generator Engine");
  return (
    <DashboardTierGate pillar="Q45 — Strategic Insight Generator Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
