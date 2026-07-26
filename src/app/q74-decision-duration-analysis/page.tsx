"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q74Page() {
  const config = MODULE_REGISTRY["Q74"] ?? buildFallbackConfig("Q74", "Q-Series — Decision Intelligence", "Decision Duration Analysis Engine");
  return (
    <DashboardTierGate pillar="Decision Duration Analysis Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
