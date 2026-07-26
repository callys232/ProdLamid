"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R08Page() {
  const config = MODULE_REGISTRY["R08"] ?? buildFallbackConfig("R08", "R-Series — Cadence Intelligence", "Cadence Integration Engine");
  return (
    <DashboardTierGate pillar="Cadence Integration Engine" backHref="/r07-cadence-consistency-check" backLabel="Cadence Consistency Check">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
