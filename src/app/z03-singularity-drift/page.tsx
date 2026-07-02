"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z03Page() {
  const config = MODULE_REGISTRY["Z03"] ?? buildFallbackConfig("Z03", "Z-Series — Singularity Intelligence", "Singularity Drift Engine");
  return (
    <DashboardTierGate pillar="Z03 — Singularity Drift Engine" backHref="/z02-singularity-velocity" backLabel="Singularity Velocity">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
