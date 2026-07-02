"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R20Page() {
  const config = MODULE_REGISTRY["R20"] ?? buildFallbackConfig("R20", "R-Series — Rhythm Intelligence", "Rhythm Domain Engine");
  return (
    <DashboardTierGate pillar="R20 — Rhythm Domain Engine" backHref="/r19-rhythm-field" backLabel="Rhythm Field">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
