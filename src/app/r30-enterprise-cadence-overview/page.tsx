"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R30Page() {
  const config = MODULE_REGISTRY["R30"] ?? buildFallbackConfig("R30", "R-Series — Cadence Intelligence", "Enterprise Cadence Overview Engine");
  return (
    <DashboardTierGate pillar="Enterprise Cadence Overview Engine" backHref="/r29-executive-cadence-report" backLabel="Executive Cadence Report">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
