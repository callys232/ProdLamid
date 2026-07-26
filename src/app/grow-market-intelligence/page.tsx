"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function GrowMarketIntelligencePage() {
  const config = MODULE_REGISTRY["G05"] ?? buildFallbackConfig("G05", "LAMID GROW — Growth Intelligence", "Market Intelligence Engine");
  return (
    <DashboardTierGate pillar="Market Intelligence Engine" backHref="/grow-modernisation" backLabel="Modernisation Readiness">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
