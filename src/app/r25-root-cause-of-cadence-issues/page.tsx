"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R25Page() {
  const config = MODULE_REGISTRY["R25"] ?? buildFallbackConfig("R25", "R-Series — Cadence Intelligence", "Root Cause of Cadence Issues Engine");
  return (
    <DashboardTierGate pillar="Root Cause of Cadence Issues" backHref="/r24-historical-cadence-tracking" backLabel="Historical Cadence Tracking">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
