"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function CoreOperatingRhythmPage() {
  const config = MODULE_REGISTRY["C05"] ?? buildFallbackConfig("C05", "LAMID CORE — Consulting Intelligence", "Operating Rhythm Engine");
  return (
    <DashboardTierGate pillar="C05 — Operating Rhythm Engine" backHref="/core-transformation" backLabel="Transformation Planner">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
