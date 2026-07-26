"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function X06Page() {
  const config = MODULE_REGISTRY["X06"] ?? buildFallbackConfig("X06", "X-Series — Protection Intelligence", "Resilience Intelligence Engine");
  return (
    <DashboardTierGate pillar="Resilience Intelligence Engine" backHref="/x05-security" backLabel="Security Intelligence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
