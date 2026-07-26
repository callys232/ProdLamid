"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R24Page() {
  const config = MODULE_REGISTRY["R24"] ?? buildFallbackConfig("R24", "R-Series — Cadence Intelligence", "Historical Cadence Tracking Engine");
  return (
    <DashboardTierGate pillar="R24 — Historical Cadence Tracking Engine" backHref="/r23-rhythm-infinity" backLabel="Long-Term Cadence Trends">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
