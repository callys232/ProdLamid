"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z10Page() {
  const config = MODULE_REGISTRY["Z10"] ?? buildFallbackConfig("Z10", "Z-Series — Transformation Intelligence", "Enterprise-Wide Alignment Engine");
  return (
    <DashboardTierGate pillar="Z10 — Enterprise-Wide Alignment Engine" backHref="/z09-cosmic-coherence" backLabel="Enterprise Consistency Check">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
