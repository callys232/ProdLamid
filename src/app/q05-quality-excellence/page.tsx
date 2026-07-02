"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function Q05Page() {
  const config = MODULE_REGISTRY["Q05"] ?? buildFallbackConfig("Q05", "Q-Series — Quality Intelligence", "Quality Excellence Engine");
  return (
    <DashboardTierGate pillar="Q05 — Quality Excellence Engine" backHref="/q04-quality-assurance" backLabel="Quality Assurance">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
