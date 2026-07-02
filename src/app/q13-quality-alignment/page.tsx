"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q13Page() {
  const config = MODULE_REGISTRY["Q13"] ?? buildFallbackConfig("Q13", "Q-Series — Quality Intelligence", "Quality Alignment Engine");
  return (
    <DashboardTierGate pillar="Q13 — Quality Alignment Engine" backHref="/q12-quality-integration" backLabel="Quality Integration">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
