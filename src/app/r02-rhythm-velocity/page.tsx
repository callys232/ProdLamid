"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R02Page() {
  const config = MODULE_REGISTRY["R02"] ?? buildFallbackConfig("R02", "R-Series — Cadence Intelligence", "Pace of Execution Engine");
  return (
    <DashboardTierGate pillar="R02 — Pace of Execution Engine" backHref="/r01-rhythm-mapping" backLabel="Cadence Mapping">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
