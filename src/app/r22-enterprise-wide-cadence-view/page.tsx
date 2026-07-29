"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R22Page() {
  const config = MODULE_REGISTRY["R22"] ?? buildFallbackConfig("R22", "R-Series — Cadence Intelligence", "Enterprise-Wide Cadence View Engine");
  return (
    <DashboardTierGate pillar="Enterprise-Wide Cadence View" backHref="/r21-business-unit-cadence-view" backLabel="Business Unit Cadence View">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
