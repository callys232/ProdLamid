"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function R12Page() {
  const config = MODULE_REGISTRY["R12"] ?? buildFallbackConfig("R12", "R-Series — Cadence Intelligence", "Operational Flow Tracker Engine");
  return (
    <DashboardTierGate pillar="Operational Flow Tracker Engine" backHref="/r11-real-time-cadence-sync" backLabel="Real-Time Cadence Sync">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
