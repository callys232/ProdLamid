"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R27Page() {
  const config = MODULE_REGISTRY["R27"] ?? buildFallbackConfig("R27", "R-Series — Rhythm Intelligence", "Rhythm Apex Engine");
  return (
    <DashboardTierGate pillar="R27 — Rhythm Apex Engine" backHref="/r26-rhythm-source" backLabel="Rhythm Source">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
