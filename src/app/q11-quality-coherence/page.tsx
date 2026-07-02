"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q11Page() {
  const config = MODULE_REGISTRY["Q11"] ?? buildFallbackConfig("Q11", "Q-Series — Quality Intelligence", "Quality Coherence Engine");
  return (
    <DashboardTierGate pillar="Q11 — Quality Coherence Engine" backHref="/q10-quality-harmony" backLabel="Quality Harmony">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
