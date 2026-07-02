"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R10Page() {
  const config = MODULE_REGISTRY["R10"] ?? buildFallbackConfig("R10", "R-Series — Rhythm Intelligence", "Rhythm Convergence Engine");
  return (
    <DashboardTierGate pillar="R10 — Rhythm Convergence Engine" backHref="/r09-rhythm-alignment" backLabel="Rhythm Alignment">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
