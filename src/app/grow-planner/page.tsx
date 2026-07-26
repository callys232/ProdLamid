"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function GrowPlannerPage() {
  const config = MODULE_REGISTRY["G07"] ?? buildFallbackConfig("G07", "LAMID GROW — Growth Intelligence", "Growth Planner Engine");
  return (
    <DashboardTierGate pillar="G07 — Growth Planner Engine" backHref="/grow-digital-maturity" backLabel="Digital Maturity Model">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
