"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P15Page() {
  const config = MODULE_REGISTRY["P15"] ?? buildFallbackConfig("P15", "P-Series — Enterprise Productivity", "Productivity Intelligence Engine");
  return (
    <DashboardTierGate pillar="Productivity Intelligence" backHref="/p14-productivity-optimisation" backLabel="Productivity Optimisation">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
