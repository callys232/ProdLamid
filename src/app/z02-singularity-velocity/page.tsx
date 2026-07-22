"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z02Page() {
  const config = MODULE_REGISTRY["Z02"] ?? buildFallbackConfig("Z02", "Z-Series — Transformation Intelligence", "Pace of Transformation Engine");
  return (
    <DashboardTierGate pillar="Z02 — Pace of Transformation Engine" backHref="/z01-singularity-mapping" backLabel="Breakthrough Opportunity Mapping">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
