"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function F04Page() {
  const config = MODULE_REGISTRY["F04"] ?? buildFallbackConfig("F04", "F-Series — Financial Intelligence", "Cost Optimization Diagnostic");
  return (
    <DashboardTierGate pillar="Cost Optimization Diagnostic" backHref="/finance-dashboard" backLabel="Finance Dashboard">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
