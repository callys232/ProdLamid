"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R06Page() {
  const config = MODULE_REGISTRY["R06"] ?? buildFallbackConfig("R06", "R-Series — Rhythm Intelligence", "Rhythm Harmony Engine");
  return (
    <DashboardTierGate pillar="R06 — Rhythm Harmony Engine" backHref="/r05-rhythm-balance" backLabel="Rhythm Balance">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
