"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q08Page() {
  const config = MODULE_REGISTRY["Q08"] ?? buildFallbackConfig("Q08", "Q-Series — Quality Intelligence", "Quality Stability Engine");
  return (
    <DashboardTierGate pillar="Q08 — Quality Stability Engine" backHref="/q07-quality-continuity" backLabel="Quality Continuity">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
