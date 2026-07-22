"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z05Page() {
  const config = MODULE_REGISTRY["Z05"] ?? buildFallbackConfig("Z05", "Z-Series — Transformation Intelligence", "Transformation Alignment Across Teams Engine");
  return (
    <DashboardTierGate pillar="Z05 — Transformation Alignment Across Teams Engine" backHref="/z04-singularity-stability" backLabel="Transformation Stability Score">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
