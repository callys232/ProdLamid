"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z02Page() {
  const config = MODULE_REGISTRY["Z02"] ?? buildFallbackConfig("Z02", "Z-Series — Transformation Intelligence", "Pace of Transformation Engine");
  return (
    <DashboardTierGate pillar="Pace of Transformation" backHref="/z01-breakthrough-opportunity-mapping" backLabel="Breakthrough Opportunity Mapping">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
