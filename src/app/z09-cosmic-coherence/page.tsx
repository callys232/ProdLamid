"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z09Page() {
  const config = MODULE_REGISTRY["Z09"] ?? buildFallbackConfig("Z09", "Z-Series — Singularity Intelligence", "Cosmic Coherence Engine");
  return (
    <DashboardTierGate pillar="Z09 — Cosmic Coherence Engine" backHref="/z08-cosmic-intelligence" backLabel="Cosmic Intelligence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
