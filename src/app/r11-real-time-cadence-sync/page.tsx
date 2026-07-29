"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R11Page() {
  const config = MODULE_REGISTRY["R11"] ?? buildFallbackConfig("R11", "R-Series — Cadence Intelligence", "Real-Time Cadence Sync Engine");
  return (
    <DashboardTierGate pillar="Real-Time Cadence Sync" backHref="/r10-multi-team-cadence-sync" backLabel="Multi-Team Cadence Sync">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
