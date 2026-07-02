"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R29Page() {
  const config = MODULE_REGISTRY["R29"] ?? buildFallbackConfig("R29", "R-Series — Rhythm Intelligence", "Rhythm Crown Engine");
  return (
    <DashboardTierGate pillar="R29 — Rhythm Crown Engine" backHref="/r28-rhythm-sovereign" backLabel="Rhythm Sovereign">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
