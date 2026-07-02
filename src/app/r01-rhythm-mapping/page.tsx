"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R01Page() {
  const config = MODULE_REGISTRY["R01"] ?? buildFallbackConfig("R01", "R-Series — Rhythm Intelligence", "Rhythm Mapping Engine");
  return (
    <DashboardTierGate pillar="R01 — Rhythm Mapping Engine" backHref="/rhythm-intelligence" backLabel="Rhythm Intelligence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
