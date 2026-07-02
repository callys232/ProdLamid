"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function GrowPathwaysPage() {
  const config = MODULE_REGISTRY["G03"] ?? buildFallbackConfig("G03", "LAMID GROW — Growth Intelligence", "Growth Pathways Engine");
  return (
    <DashboardTierGate pillar="G03 — Growth Pathways Engine" backHref="/grow-opportunity-signals" backLabel="Opportunity Signals">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
