"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R18Page() {
  const config = MODULE_REGISTRY["R18"] ?? buildFallbackConfig("R18", "R-Series — Cadence Intelligence", "Cultural Cadence Fit Engine");
  return (
    <DashboardTierGate pillar="Cultural Cadence Fit Engine" backHref="/r17-core-cadence-drivers" backLabel="Core Cadence Drivers">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
