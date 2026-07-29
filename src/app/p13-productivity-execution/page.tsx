"use client";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";
import IntelligenceModule from "@/components/lamidOne/IntelligenceModule";
import { MODULE_REGISTRY, buildFallbackConfig } from "@/lib/intelligence/moduleRegistry";

export default function P13Page() {
  const config = MODULE_REGISTRY["P13"] ?? buildFallbackConfig("P13", "P-Series — Enterprise Productivity", "Productivity Execution Engine");
  return (
    <DashboardTierGate pillar="Productivity Execution" backHref="/p12-productivity-delivery" backLabel="Productivity Delivery">
      <IntelligenceModule config={config} />
    </DashboardTierGate>
  );
}
