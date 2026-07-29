"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q29Page() {
  const config = MODULE_REGISTRY["Q29"] ?? buildFallbackConfig("Q29", "Q-Series — Decision Intelligence", "Decision Role Assignment Engine");
  return (
    <DashboardTierGate pillar="Decision Role Assignment" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
