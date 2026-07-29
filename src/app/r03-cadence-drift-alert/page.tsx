"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R03Page() {
  const config = MODULE_REGISTRY["R03"] ?? buildFallbackConfig("R03", "R-Series — Cadence Intelligence", "Cadence Drift Alert Engine");
  return (
    <DashboardTierGate pillar="Cadence Drift Alert" backHref="/r02-pace-of-execution" backLabel="Pace of Execution">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
