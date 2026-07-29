"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P23Page() {
  const config = MODULE_REGISTRY["P23"] ?? buildFallbackConfig("P23", "P-Series — Enterprise Productivity", "Systems Productivity Engine");
  return (
    <DashboardTierGate pillar="Systems Productivity" backHref="/p22-workflow-intelligence" backLabel="Workflow Intelligence">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
