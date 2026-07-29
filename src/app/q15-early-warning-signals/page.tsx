"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q15Page() {
  const config = MODULE_REGISTRY["Q15"] ?? buildFallbackConfig("Q15", "Q-Series — Decision Intelligence", "Early Warning Signals Engine");
  return (
    <DashboardTierGate pillar="Early Warning Signals" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
