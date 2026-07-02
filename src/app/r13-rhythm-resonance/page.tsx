"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R13Page() {
  const config = MODULE_REGISTRY["R13"] ?? buildFallbackConfig("R13", "R-Series — Rhythm Intelligence", "Rhythm Resonance Engine");
  return (
    <DashboardTierGate pillar="R13 — Rhythm Resonance Engine" backHref="/r12-rhythm-flow" backLabel="Rhythm Flow">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
