"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R17Page() {
  const config = MODULE_REGISTRY["R17"] ?? buildFallbackConfig("R17", "R-Series — Rhythm Intelligence", "Rhythm Essence Engine");
  return (
    <DashboardTierGate pillar="R17 — Rhythm Essence Engine" backHref="/r16-rhythm-identity" backLabel="Rhythm Identity">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
