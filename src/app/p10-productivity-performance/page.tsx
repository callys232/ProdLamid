"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P10Page() {
  const config = MODULE_REGISTRY["P10"] ?? buildFallbackConfig("P10", "P-Series — Enterprise Productivity", "Productivity Performance Engine");
  return (
    <DashboardTierGate pillar="Productivity Performance Engine" backHref="/p09-productivity-alignment" backLabel="Productivity Alignment">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
