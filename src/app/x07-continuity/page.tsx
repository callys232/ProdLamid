"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function X07Page() {
  const config = MODULE_REGISTRY["X07"] ?? buildFallbackConfig("X07", "X-Series — Protection Intelligence", "Continuity Intelligence Engine");
  return (
    <DashboardTierGate pillar="X07 — Continuity Intelligence Engine" backHref="/x06-resilience" backLabel="Resilience Intelligence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
