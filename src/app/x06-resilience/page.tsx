"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function X06Page() {
  const config = MODULE_REGISTRY["X06"] ?? buildFallbackConfig("X06", "X-Series — Protection Intelligence", "Resilience Intelligence Engine");
  return (
    <DashboardTierGate pillar="X06 — Resilience Intelligence Engine" backHref="/x05-security" backLabel="Security Intelligence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
