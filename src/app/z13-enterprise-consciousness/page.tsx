"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z13Page() {
  const config = MODULE_REGISTRY["Z13"] ?? buildFallbackConfig("Z13", "Z-Series — Singularity Intelligence", "Enterprise Consciousness Engine");
  return (
    <DashboardTierGate pillar="Z13 — Enterprise Consciousness Engine" backHref="/z12-cosmic-renewal" backLabel="Cosmic Renewal">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
