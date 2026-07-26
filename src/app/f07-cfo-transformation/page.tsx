"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function F07Page() {
  const config = MODULE_REGISTRY["F07"] ?? buildFallbackConfig("F07", "F-Series — Financial Intelligence", "CFO Transformation Engine");
  return (
    <DashboardTierGate pillar="F07 — CFO Transformation Engine" backHref="/finance-dashboard" backLabel="Finance Dashboard">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
