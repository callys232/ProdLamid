"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z15Page() {
  const config = MODULE_REGISTRY["Z15"] ?? buildFallbackConfig("Z15", "Z-Series — Singularity Intelligence", "Consciousness Flow Engine");
  return (
    <DashboardTierGate pillar="Z15 — Consciousness Flow Engine" backHref="/z14-consciousness-coherence" backLabel="Consciousness Coherence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
