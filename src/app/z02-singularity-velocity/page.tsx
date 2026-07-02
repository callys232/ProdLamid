"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z02Page() {
  const config = MODULE_REGISTRY["Z02"] ?? buildFallbackConfig("Z02", "Z-Series — Singularity Intelligence", "Singularity Velocity Engine");
  return (
    <DashboardTierGate pillar="Z02 — Singularity Velocity Engine" backHref="/z01-singularity-mapping" backLabel="Singularity Mapping">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
