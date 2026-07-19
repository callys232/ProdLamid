"use client";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";
import IntelligenceModule from "@/components/aivora/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function F05Page() {
  const config = MODULE_REGISTRY["F05"] ?? buildFallbackConfig("F05", "F-Series — Financial Intelligence", "Enterprise Value Engine");
  return (
    <DashboardTierGate pillar="F05 — Enterprise Value Engine" backHref="/finance-dashboard" backLabel="Finance Dashboard">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
