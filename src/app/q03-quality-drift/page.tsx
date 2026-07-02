"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q03Page() {
  const config = MODULE_REGISTRY["Q03"] ?? buildFallbackConfig("Q03", "Q-Series — Quality Intelligence", "Quality Drift Engine");
  return (
    <DashboardTierGate pillar="Q03 — Quality Drift Engine" backHref="/q02-quality-velocity" backLabel="Quality Velocity">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
