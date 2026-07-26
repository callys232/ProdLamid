"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function F01Page() {
  const config = MODULE_REGISTRY["F01"] ?? buildFallbackConfig("F01", "F-Series — Financial Intelligence", "Financial Visibility Engine");
  return (
    <DashboardTierGate pillar="F01 — Financial Visibility Engine" backHref="/finance-dashboard" backLabel="Finance Dashboard">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
