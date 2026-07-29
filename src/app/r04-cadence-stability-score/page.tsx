"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R04Page() {
  const config = MODULE_REGISTRY["R04"] ?? buildFallbackConfig("R04", "R-Series — Cadence Intelligence", "Cadence Stability Score Engine");
  return (
    <DashboardTierGate pillar="Cadence Stability Score" backHref="/r03-cadence-drift-alert" backLabel="Cadence Drift Alert">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
