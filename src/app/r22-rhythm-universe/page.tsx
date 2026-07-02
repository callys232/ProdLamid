"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R22Page() {
  const config = MODULE_REGISTRY["R22"] ?? buildFallbackConfig("R22", "R-Series — Rhythm Intelligence", "Rhythm Universe Engine");
  return (
    <DashboardTierGate pillar="R22 — Rhythm Universe Engine" backHref="/r21-rhythm-realm" backLabel="Rhythm Realm">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
