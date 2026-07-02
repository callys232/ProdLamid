"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R04Page() {
  const config = MODULE_REGISTRY["R04"] ?? buildFallbackConfig("R04", "R-Series — Rhythm Intelligence", "Rhythm Stability Engine");
  return (
    <DashboardTierGate pillar="R04 — Rhythm Stability Engine" backHref="/r03-rhythm-drift" backLabel="Rhythm Drift">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
