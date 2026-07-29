"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R20Page() {
  const config = MODULE_REGISTRY["R20"] ?? buildFallbackConfig("R20", "R-Series — Cadence Intelligence", "Department Cadence View Engine");
  return (
    <DashboardTierGate pillar="Department Cadence View" backHref="/r19-cadence-impact-area" backLabel="Cadence Impact Area">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
