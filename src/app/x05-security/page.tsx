"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function X05Page() {
  const config = MODULE_REGISTRY["X05"] ?? buildFallbackConfig("X05", "X-Series — Protection Intelligence", "Security Intelligence Engine");
  return (
    <DashboardTierGate pillar="X05 — Security Intelligence Engine" backHref="/x04-ethics" backLabel="Ethics Intelligence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
