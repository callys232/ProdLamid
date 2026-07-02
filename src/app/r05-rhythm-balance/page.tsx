"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R05Page() {
  const config = MODULE_REGISTRY["R05"] ?? buildFallbackConfig("R05", "R-Series — Rhythm Intelligence", "Rhythm Balance Engine");
  return (
    <DashboardTierGate pillar="R05 — Rhythm Balance Engine" backHref="/r04-rhythm-stability" backLabel="Rhythm Stability">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
