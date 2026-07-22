"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R13Page() {
  const config = MODULE_REGISTRY["R13"] ?? buildFallbackConfig("R13", "R-Series — Cadence Intelligence", "Team Cadence Engagement Score Engine");
  return (
    <DashboardTierGate pillar="R13 — Team Cadence Engagement Score Engine" backHref="/r12-rhythm-flow" backLabel="Operational Flow Tracker">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
