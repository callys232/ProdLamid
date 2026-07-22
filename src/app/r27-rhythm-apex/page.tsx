"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R27Page() {
  const config = MODULE_REGISTRY["R27"] ?? buildFallbackConfig("R27", "R-Series — Cadence Intelligence", "Peak Performance Cadence Engine");
  return (
    <DashboardTierGate pillar="R27 — Peak Performance Cadence Engine" backHref="/r26-rhythm-source" backLabel="Cadence Data Sources">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
