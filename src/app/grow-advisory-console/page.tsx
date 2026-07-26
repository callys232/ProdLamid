"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function GrowAdvisoryConsolePage() {
  const config = MODULE_REGISTRY["G08"] ?? buildFallbackConfig("G08", "LAMID GROW — Growth Intelligence", "Advisory Console Engine");
  return (
    <DashboardTierGate pillar="Advisory Console Engine" backHref="/grow-planner" backLabel="Growth Planner">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
