"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z05Page() {
  const config = MODULE_REGISTRY["Z05"] ?? buildFallbackConfig("Z05", "Z-Series — Singularity Intelligence", "Singularity Convergence Engine");
  return (
    <DashboardTierGate pillar="Z05 — Singularity Convergence Engine" backHref="/z04-singularity-stability" backLabel="Singularity Stability">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
