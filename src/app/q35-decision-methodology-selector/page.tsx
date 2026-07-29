"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q35Page() {
  const config = MODULE_REGISTRY["Q35"] ?? buildFallbackConfig("Q35", "Q-Series — Decision Intelligence", "Decision Methodology Selector Engine");
  return (
    <DashboardTierGate pillar="Decision Methodology Selector" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
