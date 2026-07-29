"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R21Page() {
  const config = MODULE_REGISTRY["R21"] ?? buildFallbackConfig("R21", "R-Series — Cadence Intelligence", "Business Unit Cadence View Engine");
  return (
    <DashboardTierGate pillar="Business Unit Cadence View" backHref="/r20-department-cadence-view" backLabel="Department Cadence View">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
