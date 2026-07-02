"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function GrowAdvisoryConsolePage() {
  const config = MODULE_REGISTRY["G08"] ?? buildFallbackConfig("G08", "LAMID GROW — Growth Intelligence", "Advisory Console Engine");
  return (
    <DashboardTierGate pillar="G08 — Advisory Console Engine" backHref="/grow-planner" backLabel="Growth Planner">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
