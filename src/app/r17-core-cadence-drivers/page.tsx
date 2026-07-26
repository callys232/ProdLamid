"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R17Page() {
  const config = MODULE_REGISTRY["R17"] ?? buildFallbackConfig("R17", "R-Series — Cadence Intelligence", "Core Cadence Drivers Engine");
  return (
    <DashboardTierGate pillar="Core Cadence Drivers Engine" backHref="/r16-cadence-pattern-report" backLabel="Cadence Pattern Report">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
