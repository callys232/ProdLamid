"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R26Page() {
  const config = MODULE_REGISTRY["R26"] ?? buildFallbackConfig("R26", "R-Series — Cadence Intelligence", "Cadence Data Sources Engine");
  return (
    <DashboardTierGate pillar="Cadence Data Sources" backHref="/r25-root-cause-of-cadence-issues" backLabel="Root Cause of Cadence Issues">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
