"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function F06Page() {
  const config = MODULE_REGISTRY["F06"] ?? buildFallbackConfig("F06", "F-Series — Financial Intelligence", "Financial Governance Engine");
  return (
    <DashboardTierGate pillar="Financial Governance Engine" backHref="/finance-dashboard" backLabel="Finance Dashboard">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
