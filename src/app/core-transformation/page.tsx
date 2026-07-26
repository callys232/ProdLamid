"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function CoreTransformationPage() {
  const config = MODULE_REGISTRY["C04"] ?? buildFallbackConfig("C04", "LAMID CORE — Consulting Intelligence", "Transformation Planner");
  return (
    <DashboardTierGate pillar="Transformation Planner" backHref="/core-diagnostic" backLabel="Diagnostic Engine">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
