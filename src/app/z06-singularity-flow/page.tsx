"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z06Page() {
  const config = MODULE_REGISTRY["Z06"] ?? buildFallbackConfig("Z06", "Z-Series — Singularity Intelligence", "Singularity Flow Engine");
  return (
    <DashboardTierGate pillar="Z06 — Singularity Flow Engine" backHref="/z05-singularity-convergence" backLabel="Singularity Convergence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
