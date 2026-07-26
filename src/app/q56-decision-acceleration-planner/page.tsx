"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q56Page() {
  const config = MODULE_REGISTRY["Q56"] ?? buildFallbackConfig("Q56", "Q-Series — Decision Intelligence", "Decision Acceleration Planner Engine");
  return (
    <DashboardTierGate pillar="Decision Acceleration Planner Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
