"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Z12Page() {
  const config = MODULE_REGISTRY["Z12"] ?? buildFallbackConfig("Z12", "Z-Series — Transformation Intelligence", "Enterprise Renewal Cycle Engine");
  return (
    <DashboardTierGate pillar="Enterprise Renewal Cycle" backHref="/z11-enterprise-flow-tracker" backLabel="Enterprise Flow Tracker">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
