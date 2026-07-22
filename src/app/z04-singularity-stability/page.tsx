"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z04Page() {
  const config = MODULE_REGISTRY["Z04"] ?? buildFallbackConfig("Z04", "Z-Series — Transformation Intelligence", "Transformation Stability Score Engine");
  return (
    <DashboardTierGate pillar="Z04 — Transformation Stability Score Engine" backHref="/z03-singularity-drift" backLabel="Transformation Drift Alert">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
