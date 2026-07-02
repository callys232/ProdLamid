"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q10Page() {
  const config = MODULE_REGISTRY["Q10"] ?? buildFallbackConfig("Q10", "Q-Series — Quality Intelligence", "Quality Harmony Engine");
  return (
    <DashboardTierGate pillar="Q10 — Quality Harmony Engine" backHref="/q09-quality-balance" backLabel="Quality Balance">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
