"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z08Page() {
  const config = MODULE_REGISTRY["Z08"] ?? buildFallbackConfig("Z08", "Z-Series — Transformation Intelligence", "Enterprise-Wide Intelligence Summary Engine");
  return (
    <DashboardTierGate pillar="Z08 — Enterprise-Wide Intelligence Summary Engine" backHref="/z07-singularity-identity" backLabel="Transformation Identity Report">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
