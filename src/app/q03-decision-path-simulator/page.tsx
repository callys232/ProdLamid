"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q03Page() {
  const config = MODULE_REGISTRY["Q03"] ?? buildFallbackConfig("Q03", "Q-Series — Decision Intelligence", "Decision Path Simulator Engine");
  return (
    <DashboardTierGate pillar="Decision Path Simulator Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
