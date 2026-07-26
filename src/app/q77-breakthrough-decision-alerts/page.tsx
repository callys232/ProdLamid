"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q77Page() {
  const config = MODULE_REGISTRY["Q77"] ?? buildFallbackConfig("Q77", "Q-Series — Decision Intelligence", "Breakthrough Decision Alerts Engine");
  return (
    <DashboardTierGate pillar="Breakthrough Decision Alerts Engine" backHref="/intelligence-hub" backLabel="Intelligence Hub">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
