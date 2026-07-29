"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R23Page() {
  const config = MODULE_REGISTRY["R23"] ?? buildFallbackConfig("R23", "R-Series — Cadence Intelligence", "Long-Term Cadence Trends Engine");
  return (
    <DashboardTierGate pillar="Long-Term Cadence Trends" backHref="/r22-enterprise-wide-cadence-view" backLabel="Enterprise-Wide Cadence View">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
