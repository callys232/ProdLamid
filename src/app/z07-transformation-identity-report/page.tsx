"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z07Page() {
  const config = MODULE_REGISTRY["Z07"] ?? buildFallbackConfig("Z07", "Z-Series — Transformation Intelligence", "Transformation Identity Report Engine");
  return (
    <DashboardTierGate pillar="Z07 — Transformation Identity Report Engine" backHref="/z06-singularity-flow" backLabel="Transformation Progress Tracker">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
