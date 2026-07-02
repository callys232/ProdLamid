"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q04Page() {
  const config = MODULE_REGISTRY["Q04"] ?? buildFallbackConfig("Q04", "Q-Series — Quality Intelligence", "Quality Assurance Engine");
  return (
    <DashboardTierGate pillar="Q04 — Quality Assurance Engine" backHref="/q03-quality-drift" backLabel="Quality Drift">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
