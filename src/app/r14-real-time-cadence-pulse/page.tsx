"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R14Page() {
  const config = MODULE_REGISTRY["R14"] ?? buildFallbackConfig("R14", "R-Series — Cadence Intelligence", "Real-Time Cadence Pulse Engine");
  return (
    <DashboardTierGate pillar="Real-Time Cadence Pulse" backHref="/r13-team-cadence-engagement-score" backLabel="Team Cadence Engagement Score">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
