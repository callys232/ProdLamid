"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q54Page() {
  const config = MODULE_REGISTRY["Q54"] ?? buildFallbackConfig("Q54", "Q-Series — Decision Intelligence", "Decision Momentum Tracker Engine");
  return (
    <DashboardTierGate pillar="Decision Momentum Tracker Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
