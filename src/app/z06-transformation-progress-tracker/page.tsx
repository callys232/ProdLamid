"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z06Page() {
  const config = MODULE_REGISTRY["Z06"] ?? buildFallbackConfig("Z06", "Z-Series — Transformation Intelligence", "Transformation Progress Tracker Engine");
  return (
    <DashboardTierGate pillar="Z06 — Transformation Progress Tracker Engine" backHref="/z05-singularity-convergence" backLabel="Transformation Alignment Across Teams">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
