"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R02Page() {
  const config = MODULE_REGISTRY["R02"] ?? buildFallbackConfig("R02", "R-Series — Cadence Intelligence", "Pace of Execution Engine");
  return (
    <DashboardTierGate pillar="Pace of Execution" backHref="/r01-cadence-mapping" backLabel="Cadence Mapping">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
