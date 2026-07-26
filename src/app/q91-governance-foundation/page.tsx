"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q91Page() {
  const config = MODULE_REGISTRY["Q91"] ?? buildFallbackConfig("Q91", "Q-Series — Decision Intelligence", "Governance Foundation Engine");
  return (
    <DashboardTierGate pillar="Governance Foundation Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
