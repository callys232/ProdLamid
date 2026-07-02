"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q09Page() {
  const config = MODULE_REGISTRY["Q09"] ?? buildFallbackConfig("Q09", "Q-Series — Quality Intelligence", "Quality Balance Engine");
  return (
    <DashboardTierGate pillar="Q09 — Quality Balance Engine" backHref="/q08-quality-stability" backLabel="Quality Stability">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
