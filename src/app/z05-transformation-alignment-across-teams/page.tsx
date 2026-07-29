"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z05Page() {
  const config = MODULE_REGISTRY["Z05"] ?? buildFallbackConfig("Z05", "Z-Series — Transformation Intelligence", "Transformation Alignment Across Teams Engine");
  return (
    <DashboardTierGate pillar="Transformation Alignment Across Teams" backHref="/z04-transformation-stability-score" backLabel="Transformation Stability Score">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
