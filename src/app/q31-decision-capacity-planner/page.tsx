"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q31Page() {
  const config = MODULE_REGISTRY["Q31"] ?? buildFallbackConfig("Q31", "Q-Series — Decision Intelligence", "Decision Capacity Planner Engine");
  return (
    <DashboardTierGate pillar="Decision Capacity Planner" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
