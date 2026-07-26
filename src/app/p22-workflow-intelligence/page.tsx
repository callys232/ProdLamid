"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P22Page() {
  const config = MODULE_REGISTRY["P22"] ?? buildFallbackConfig("P22", "P-Series — Enterprise Productivity", "Workflow Intelligence Engine");
  return (
    <DashboardTierGate pillar="Workflow Intelligence Engine" backHref="/p21-process-optimisation" backLabel="Process Optimisation">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
