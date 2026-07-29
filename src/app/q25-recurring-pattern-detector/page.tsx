"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q25Page() {
  const config = MODULE_REGISTRY["Q25"] ?? buildFallbackConfig("Q25", "Q-Series — Decision Intelligence", "Recurring Pattern Detector Engine");
  return (
    <DashboardTierGate pillar="Recurring Pattern Detector" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
