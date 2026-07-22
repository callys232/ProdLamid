"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R28Page() {
  const config = MODULE_REGISTRY["R28"] ?? buildFallbackConfig("R28", "R-Series — Cadence Intelligence", "Cadence Governance Console Engine");
  return (
    <DashboardTierGate pillar="R28 — Cadence Governance Console Engine" backHref="/r27-rhythm-apex" backLabel="Peak Performance Cadence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
