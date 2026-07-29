"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R13Page() {
  const config = MODULE_REGISTRY["R13"] ?? buildFallbackConfig("R13", "R-Series — Cadence Intelligence", "Team Cadence Engagement Score Engine");
  return (
    <DashboardTierGate pillar="Team Cadence Engagement Score" backHref="/r12-operational-flow-tracker" backLabel="Operational Flow Tracker">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
