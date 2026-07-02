"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q15Page() {
  const config = MODULE_REGISTRY["Q15"] ?? buildFallbackConfig("Q15", "Q-Series — Quality Intelligence", "Quality Flow Engine");
  return (
    <DashboardTierGate pillar="Q15 — Quality Flow Engine" backHref="/q14-quality-convergence" backLabel="Quality Convergence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
