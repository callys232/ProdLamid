"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function F05Page() {
  const config = MODULE_REGISTRY["F05"] ?? buildFallbackConfig("F05", "F-Series — Financial Intelligence", "Enterprise Value Engine");
  return (
    <DashboardTierGate pillar="Enterprise Value" backHref="/finance-dashboard" backLabel="Finance Dashboard">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
