"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P09Page() {
  const config = MODULE_REGISTRY["P09"] ?? buildFallbackConfig("P09", "P-Series — Enterprise Productivity", "Productivity Alignment Engine");
  return (
    <DashboardTierGate pillar="Productivity Alignment Engine" backHref="/p08-productivity-integration" backLabel="Productivity Integration">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
