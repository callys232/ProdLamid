"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P09Page() {
  const config = MODULE_REGISTRY["P09"] ?? buildFallbackConfig("P09", "P-Series — Enterprise Productivity", "Productivity Alignment Engine");
  return (
    <DashboardTierGate pillar="P09 — Productivity Alignment Engine" backHref="/p08-productivity-integration" backLabel="Productivity Integration">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
