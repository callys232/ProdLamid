"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q43Page() {
  const config = MODULE_REGISTRY["Q43"] ?? buildFallbackConfig("Q43", "Q-Series — Decision Intelligence", "Risk Visibility Monitor Engine");
  return (
    <DashboardTierGate pillar="Risk Visibility Monitor" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
