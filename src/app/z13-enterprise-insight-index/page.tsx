"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z13Page() {
  const config = MODULE_REGISTRY["Z13"] ?? buildFallbackConfig("Z13", "Z-Series — Transformation Intelligence", "Enterprise Insight Index Engine");
  return (
    <DashboardTierGate pillar="Z13 — Enterprise Insight Index Engine" backHref="/z12-cosmic-renewal" backLabel="Enterprise Renewal Cycle">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
