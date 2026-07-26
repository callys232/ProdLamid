"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P16Page() {
  const config = MODULE_REGISTRY["P16"] ?? buildFallbackConfig("P16", "P-Series — Enterprise Productivity", "Team Productivity Engine");
  return (
    <DashboardTierGate pillar="Team Productivity Engine" backHref="/p15-productivity-intelligence" backLabel="Productivity Intelligence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
