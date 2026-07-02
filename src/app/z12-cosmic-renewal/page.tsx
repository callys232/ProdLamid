"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z12Page() {
  const config = MODULE_REGISTRY["Z12"] ?? buildFallbackConfig("Z12", "Z-Series — Singularity Intelligence", "Cosmic Renewal Engine");
  return (
    <DashboardTierGate pillar="Z12 — Cosmic Renewal Engine" backHref="/z11-cosmic-flow" backLabel="Cosmic Flow">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
