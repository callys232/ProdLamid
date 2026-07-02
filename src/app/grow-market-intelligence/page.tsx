"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function GrowMarketIntelligencePage() {
  const config = MODULE_REGISTRY["G05"] ?? buildFallbackConfig("G05", "LAMID GROW — Growth Intelligence", "Market Intelligence Engine");
  return (
    <DashboardTierGate pillar="G05 — Market Intelligence Engine" backHref="/grow-modernisation" backLabel="Modernisation Readiness">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
