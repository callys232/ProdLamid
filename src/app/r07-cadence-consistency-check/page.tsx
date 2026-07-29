"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R07Page() {
  const config = MODULE_REGISTRY["R07"] ?? buildFallbackConfig("R07", "R-Series — Cadence Intelligence", "Cadence Consistency Check Engine");
  return (
    <DashboardTierGate pillar="Cadence Consistency Check" backHref="/r06-cross-team-cadence-fit" backLabel="Cross-Team Cadence Fit">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
