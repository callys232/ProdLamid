"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q07Page() {
  const config = MODULE_REGISTRY["Q07"] ?? buildFallbackConfig("Q07", "Q-Series — Quality Intelligence", "Quality Continuity Engine");
  return (
    <DashboardTierGate pillar="Q07 — Quality Continuity Engine" backHref="/q06-quality-resilience" backLabel="Quality Resilience">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
