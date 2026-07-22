"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R26Page() {
  const config = MODULE_REGISTRY["R26"] ?? buildFallbackConfig("R26", "R-Series — Cadence Intelligence", "Cadence Data Sources Engine");
  return (
    <DashboardTierGate pillar="R26 — Cadence Data Sources Engine" backHref="/r25-rhythm-origin" backLabel="Root Cause of Cadence Issues">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
