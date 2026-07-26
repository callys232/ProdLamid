"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q68Page() {
  const config = MODULE_REGISTRY["Q68"] ?? buildFallbackConfig("Q68", "Q-Series — Decision Intelligence", "Long-Term Scenario Planner Engine");
  return (
    <DashboardTierGate pillar="Long-Term Scenario Planner Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
