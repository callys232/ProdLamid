"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q06Page() {
  const config = MODULE_REGISTRY["Q06"] ?? buildFallbackConfig("Q06", "Q-Series — Quality Intelligence", "Quality Resilience Engine");
  return (
    <DashboardTierGate pillar="Q06 — Quality Resilience Engine" backHref="/q05-quality-excellence" backLabel="Quality Excellence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
