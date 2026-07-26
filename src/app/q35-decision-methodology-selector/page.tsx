"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q35Page() {
  const config = MODULE_REGISTRY["Q35"] ?? buildFallbackConfig("Q35", "Q-Series — Decision Intelligence", "Decision Methodology Selector Engine");
  return (
    <DashboardTierGate pillar="Q35 — Decision Methodology Selector Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
