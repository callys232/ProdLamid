"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R28Page() {
  const config = MODULE_REGISTRY["R28"] ?? buildFallbackConfig("R28", "R-Series — Cadence Intelligence", "Cadence Governance Console Engine");
  return (
    <DashboardTierGate pillar="Cadence Governance Console" backHref="/r27-peak-performance-cadence" backLabel="Peak Performance Cadence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
