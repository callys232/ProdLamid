"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R05Page() {
  const config = MODULE_REGISTRY["R05"] ?? buildFallbackConfig("R05", "R-Series — Cadence Intelligence", "Workload Balance Monitor Engine");
  return (
    <DashboardTierGate pillar="Workload Balance Monitor Engine" backHref="/r04-cadence-stability-score" backLabel="Cadence Stability Score">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
