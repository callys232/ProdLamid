"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R19Page() {
  const config = MODULE_REGISTRY["R19"] ?? buildFallbackConfig("R19", "R-Series — Cadence Intelligence", "Cadence Impact Area Engine");
  return (
    <DashboardTierGate pillar="Cadence Impact Area" backHref="/r18-cultural-cadence-fit" backLabel="Cultural Cadence Fit">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
