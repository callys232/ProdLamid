"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R10Page() {
  const config = MODULE_REGISTRY["R10"] ?? buildFallbackConfig("R10", "R-Series — Cadence Intelligence", "Multi-Team Cadence Sync Engine");
  return (
    <DashboardTierGate pillar="Multi-Team Cadence Sync" backHref="/r09-strategy-to-execution-alignment" backLabel="Strategy-to-Execution Alignment">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
