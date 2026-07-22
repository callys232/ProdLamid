"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R01Page() {
  const config = MODULE_REGISTRY["R01"] ?? buildFallbackConfig("R01", "R-Series — Cadence Intelligence", "Cadence Mapping Engine");
  return (
    <DashboardTierGate pillar="R01 — Cadence Mapping Engine" backHref="/rhythm-intelligence" backLabel="Cadence Intelligence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
