"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P26Page() {
  const config = MODULE_REGISTRY["P26"] ?? buildFallbackConfig("P26", "P-Series — Enterprise Productivity", "Transformation Engine");
  return (
    <DashboardTierGate pillar="P26 — Transformation Engine" backHref="/p25-innovation-productivity" backLabel="Innovation Productivity">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
