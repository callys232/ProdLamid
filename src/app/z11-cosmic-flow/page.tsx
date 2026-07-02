"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z11Page() {
  const config = MODULE_REGISTRY["Z11"] ?? buildFallbackConfig("Z11", "Z-Series — Singularity Intelligence", "Cosmic Flow Engine");
  return (
    <DashboardTierGate pillar="Z11 — Cosmic Flow Engine" backHref="/z10-cosmic-convergence" backLabel="Cosmic Convergence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
