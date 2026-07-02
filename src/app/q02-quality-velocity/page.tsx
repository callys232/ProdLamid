"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q02Page() {
  const config = MODULE_REGISTRY["Q02"] ?? buildFallbackConfig("Q02", "Q-Series — Quality Intelligence", "Quality Velocity Engine");
  return (
    <DashboardTierGate pillar="Q02 — Quality Velocity Engine" backHref="/q01-quality-mapping" backLabel="Quality Mapping">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
