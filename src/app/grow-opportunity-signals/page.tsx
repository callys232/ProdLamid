"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function GrowOpportunitySignalsPage() {
  const config = MODULE_REGISTRY["G02"] ?? buildFallbackConfig("G02", "LAMID GROW — Growth Intelligence", "Opportunity Signals Engine");
  return (
    <DashboardTierGate pillar="Opportunity Signals Engine" backHref="/grow-dashboard" backLabel="GROW Dashboard">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
