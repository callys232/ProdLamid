"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R06Page() {
  const config = MODULE_REGISTRY["R06"] ?? buildFallbackConfig("R06", "R-Series — Cadence Intelligence", "Cross-Team Cadence Fit Engine");
  return (
    <DashboardTierGate pillar="Cross-Team Cadence Fit Engine" backHref="/r05-workload-balance-monitor" backLabel="Workload Balance Monitor">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
