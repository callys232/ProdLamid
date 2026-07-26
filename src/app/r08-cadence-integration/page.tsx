"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R08Page() {
  const config = MODULE_REGISTRY["R08"] ?? buildFallbackConfig("R08", "R-Series — Cadence Intelligence", "Cadence Integration Engine");
  return (
    <DashboardTierGate pillar="R08 — Cadence Integration Engine" backHref="/r07-rhythm-coherence" backLabel="Cadence Consistency Check">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
