"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R01Page() {
  const config = MODULE_REGISTRY["R01"] ?? buildFallbackConfig("R01", "R-Series — Cadence Intelligence", "Cadence Mapping Engine");
  return (
    <DashboardTierGate pillar="Cadence Mapping" backHref="/cadence-intelligence" backLabel="Cadence Intelligence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
