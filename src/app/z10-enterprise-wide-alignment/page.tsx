"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z10Page() {
  const config = MODULE_REGISTRY["Z10"] ?? buildFallbackConfig("Z10", "Z-Series — Transformation Intelligence", "Enterprise-Wide Alignment Engine");
  return (
    <DashboardTierGate pillar="Enterprise-Wide Alignment" backHref="/z09-enterprise-consistency-check" backLabel="Enterprise Consistency Check">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
