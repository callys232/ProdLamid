"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R15Page() {
  const config = MODULE_REGISTRY["R15"] ?? buildFallbackConfig("R15", "R-Series — Cadence Intelligence", "Organisational Cadence Profile Engine");
  return (
    <DashboardTierGate pillar="Organisational Cadence Profile" backHref="/r14-real-time-cadence-pulse" backLabel="Real-Time Cadence Pulse">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
