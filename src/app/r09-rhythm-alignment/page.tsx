"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R09Page() {
  const config = MODULE_REGISTRY["R09"] ?? buildFallbackConfig("R09", "R-Series — Cadence Intelligence", "Strategy-to-Execution Alignment Engine");
  return (
    <DashboardTierGate pillar="R09 — Strategy-to-Execution Alignment Engine" backHref="/r08-rhythm-integration" backLabel="Cadence Integration">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
