"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z04Page() {
  const config = MODULE_REGISTRY["Z04"] ?? buildFallbackConfig("Z04", "Z-Series — Singularity Intelligence", "Singularity Stability Engine");
  return (
    <DashboardTierGate pillar="Z04 — Singularity Stability Engine" backHref="/z03-singularity-drift" backLabel="Singularity Drift">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
